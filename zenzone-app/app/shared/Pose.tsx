import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Image,
  SafeAreaView,
} from "react-native";

import { Camera } from "expo-camera";

import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  bundleResourceIO,
  cameraWithTensors,
} from "@tensorflow/tfjs-react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { CameraType } from "expo-camera/build/Camera.types";
import { MyText, SafeView } from "@elements/SharedElements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TrackProps } from "@constants/Interfaces";

// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);

const IS_ANDROID = Platform.OS === "android";
const IS_IOS = Platform.OS === "ios";

// Camera preview size.
//
// From experiments, to render camera feed without distortion, 16:9 ratio
// should be used fo iOS devices and 4:3 ratio should be used for android
// devices.
//
// This might not cover all cases.
const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3;

// The size of the resized output from TensorCamera.
//
// For movenet, the size here doesn't matter too much because the model will
// preprocess the input (crop, resize, etc). For best result, use the size that
// doesn't distort the image.
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// Whether to auto-render TensorCamera preview.
const AUTO_RENDER = false;

// Whether to load model from app bundle (true) or through network (false).
const LOAD_MODEL_FROM_BUNDLE = false;

const POSE_CONNECTIONS = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["right_shoulder", "right_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_elbow", "right_wrist"],
  ["nose", "left_eye"],
  ["nose", "right_eye"],
  ["left_eye", "left_ear"],
  ["right_eye", "right_ear"],
  ["left_ear", "left_shoulder"],
  ["right_ear", "right_shoulder"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["right_hip", "right_knee"],
  ["left_knee", "left_ankle"],
  ["right_knee", "right_ankle"],
];

export default function Pose({ route }: { route: any }) {
  const {
    item,
  }: {
    item: TrackProps;
  } = route.params;

  const YOGA_POSES = [item.points];
  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>();
  const [poses, setPoses] = useState<posedetection.Pose[]>();
  const [fps, setFps] = useState(0);
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>();
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.front
  );
  const navigation = useNavigation<any>();
  // Use `useRef` so that changing it won't trigger a re-render.
  //
  // - null: unset (initial value).
  // - 0: animation frame/loop has been canceled.
  // - >0: animation frame has been scheduled.
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    async function prepare() {
      rafId.current = null;

      // Set initial orientation.
      const curOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(curOrientation);

      // Listens to orientation change.
      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();

      const movenetModelConfig: posedetection.MoveNetModelConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };
      if (LOAD_MODEL_FROM_BUNDLE) {
        const modelJson = require("../offline_model/model.json");
        const modelWeights1 = require("../offline_model/group1-shard1of2.bin");
        const modelWeights2 = require("../offline_model/group1-shard2of2.bin");
        movenetModelConfig.modelUrl = bundleResourceIO(modelJson, [
          modelWeights1,
          modelWeights2,
        ]);
      }
      const model = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        movenetModelConfig
      );
      setModel(model);

      // Ready!
      setTfReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    // Called when the app is unmounted.
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    const loop = async () => {
      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;

      const startTs = Date.now();
      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now()
      );
      const latency = Date.now() - startTs;
      setFps(Math.floor(1000 / latency));
      setPoses(poses);
      tf.dispose([imageTensor]);

      if (rafId.current === 0) {
        return;
      }

      // Render camera preview manually when autorender=false.
      if (!AUTO_RENDER) {
        updatePreview();
        gl.endFrameEXP();
      }

      rafId.current = requestAnimationFrame(loop);
    };

    loop();
  };

  function checkPose(currentPose, targetPose) {
    let isPoseMatched = true;

    for (let joint in targetPose) {
      let targetJoint = targetPose[joint];
      let currentJoint = currentPose.find((j) => j.name === joint);

      if (!currentJoint) continue; // Skip if the joint is not detected

      let diffX = Math.abs(targetJoint.x - currentJoint.x);
      let diffY = Math.abs(targetJoint.y - currentJoint.y);

      // setTimeout(() => {
      // console.log(
      //   `targetJoint.x: ${targetJoint.x}, targetJoint.y: ${targetJoint.y}`
      // );
      // console.log(
      //   `currentJoint.x: ${currentJoint.x}, currentJoint.y: ${currentJoint.y}`
      // );
      //   );

      // console.log(`X: ${targetJoint.x} - ${currentJoint.x} = ${diffX}`);
      // console.log(`Y: ${targetJoint.y} - ${currentJoint.y} = ${diffY}`);

      // console.log(`diffX: ${diffX}, diffY: ${diffY}`);
      // }, 1000);
      // console.log(`diffX: ${diffX}, diffY: ${diffY}`);
      // Consider the pose to be a match if the x and y coordinates of each joint
      // are within 50 units of the target pose.
      if (diffX > 60 || diffY > 60) {
        isPoseMatched = false;
        break;
      }
    }

    return isPoseMatched;
  }

  const renderPose = () => {
    if (poses != null && poses.length > 0) {
      // console.log(poses[0].keypoints);
      const keypoints = poses[0].keypoints
        .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
        .map((k) => {
          const flipX = IS_ANDROID || cameraType === Camera.Constants.Type.back;
          const x = flipX ? getOutputTensorWidth() - k.x : k.x;
          const y = k.y;
          return {
            name: k.name,
            x:
              (x / getOutputTensorWidth()) *
              (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT),
            y:
              (y / getOutputTensorHeight()) *
              (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH),
          };
        });

      const isPoseMatched = checkPose(keypoints, YOGA_POSES[0]);
      const fillColour = isPoseMatched ? "#00AA00" : "#AA0000";

      const circles = keypoints.map((k) => (
        <Circle
          key={`skeletonkp_${k.name}`}
          cx={k.x}
          cy={k.y}
          r="4"
          strokeWidth="2"
          fill={fillColour}
          stroke="white"
        />
      ));

      const lines = POSE_CONNECTIONS.map(([start, end]) => {
        const startKeyPoint = keypoints.find((k) => k.name === start);
        const endKeyPoint = keypoints.find((k) => k.name === end);
        if (startKeyPoint && endKeyPoint) {
          return (
            <Line
              key={`skeletonline_${start}_${end}`}
              x1={startKeyPoint.x}
              y1={startKeyPoint.y}
              x2={endKeyPoint.x}
              y2={endKeyPoint.y}
              stroke={fillColour}
              strokeWidth="2"
            />
          );
        } else {
          return null;
        }
      }).filter(Boolean);

      return (
        <Svg style={styles.svg}>
          {circles}
          {lines}
        </Svg>
      );
    } else {
      return <View></View>;
    }
  };

  const renderNormalPose = () => {
    const keypoints = Object.values(YOGA_POSES[0]);

    console.log(keypoints);
    // const isPoseMatched = checkPose(keypoints, YOGA_POSES[0]);
    const fillColour = "#ff0";

    const circles = keypoints.map((k, index) => (
      <Circle
        key={`skeletonkp_${index}`}
        cx={k.x}
        cy={k.y}
        r="4"
        strokeWidth="2"
        fill={fillColour}
        stroke="white"
      />
    ));

    const lines = POSE_CONNECTIONS.map(([start, end]) => {
      const startKeyPoint = keypoints.find((k) => k.name === start);
      const endKeyPoint = keypoints.find((k) => k.name === end);
      if (startKeyPoint && endKeyPoint) {
        return (
          <Line
            key={`skeletonline_${start}_${end}`}
            x1={startKeyPoint.x}
            y1={startKeyPoint.y}
            x2={endKeyPoint.x}
            y2={endKeyPoint.y}
            stroke={fillColour}
            strokeWidth="2"
          />
        );
      } else {
        return null;
      }
    }).filter(Boolean);

    return (
      <Svg style={styles.svg}>
        {circles}
        {lines}
      </Svg>
    );
  };

  const savePoseKeyPoints = async () => {
    const data = poses[0].keypoints;
    const formattedData = {};

    data.forEach(({ name, score, x, y }) => {
      formattedData[name] = {
        x:
          (x / getOutputTensorWidth()) *
          (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT),
        y:
          (y / getOutputTensorHeight()) *
          (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH),
      };
    });

    console.log(JSON.stringify([formattedData], null, 2));
  };

  const renderCloseButton = () => {
    return (
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="times" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSaveButton = () => {
    return (
      <View
        style={[
          styles.closeButtonContainer,
          {
            top: 100,
            backgroundColor: "green",
          },
        ]}
      >
        <TouchableOpacity onPress={() => savePoseKeyPoints()}>
          <FontAwesome name="circle" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderImage = () => {
    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri:
              item.url_png ||
              "https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483074/yoga-api/5_i64gif.png",
          }}
        />
      </View>
    );
  };

  const renderCameraTypeSwitcher = () => {
    return (
      <View style={styles.cameraSwitch} onTouchEnd={handleSwitchCameraType}>
        <Text>
          Switch to{" "}
          {cameraType === Camera.Constants.Type.front ? "back" : "front"} camera
        </Text>
      </View>
    );
  };

  const handleSwitchCameraType = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const isPortrait = () => {
    return (
      orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    );
  };

  const getOutputTensorWidth = () => {
    // On iOS landscape mode, switch width and height of the output tensor to
    // get better result. Without this, the image stored in the output tensor
    // would be stretched too much.
    //
    // Same for getOutputTensorHeight below.
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_WIDTH
      : OUTPUT_TENSOR_HEIGHT;
  };

  const getOutputTensorHeight = () => {
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_HEIGHT
      : OUTPUT_TENSOR_WIDTH;
  };

  const getTextureRotationAngleInDegrees = () => {
    // On Android, the camera texture will rotate behind the scene as the phone
    // changes orientation, so we don't need to rotate it in TensorCamera.
    if (IS_ANDROID) {
      return 0;
    }

    // For iOS, the camera texture won't rotate automatically. Calculate the
    // rotation angles here which will be passed to TensorCamera to rotate it
    // internally.
    switch (orientation) {
      // Not supported on iOS as of 11/2021, but add it here just in case.
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 180;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return cameraType === Camera.Constants.Type.front ? 270 : 90;
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return cameraType === Camera.Constants.Type.front ? 90 : 270;
      default:
        return 0;
    }
  };

  if (!tfReady) {
    return (
      <SafeView style={styles.loadingMsg}>
        <MyText fontSize={20}>Loading...</MyText>
      </SafeView>
    );
  } else {
    return (
      <SafeAreaView
        style={
          isPortrait() ? styles.containerPortrait : styles.containerLandscape
        }
      >
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          // tensor related props
          resizeWidth={getOutputTensorWidth()}
          resizeHeight={getOutputTensorHeight()}
          resizeDepth={3}
          rotation={getTextureRotationAngleInDegrees()}
          onReady={handleCameraStream}
        />
        {/* {renderNormalPose()} */}
        {renderPose()}
        {renderCloseButton()}
        {renderCameraTypeSwitcher()}
        {renderImage()}
        {renderSaveButton()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  containerPortrait: {
    position: "relative",
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    marginTop: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  containerLandscape: {
    position: "relative",
    width: CAM_PREVIEW_HEIGHT,
    height: CAM_PREVIEW_WIDTH,
    marginLeft: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  loadingMsg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  svg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 30,
  },
  cameraSwitch: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 180,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 50,
    height: 50,
    alignItems: "center",
    backgroundColor: "red",
    justifyContent: "center",
    borderRadius: 50,
    padding: 8,
    zIndex: 20,
  },
  imageContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    width: 100,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 30,
  },
  image: {
    width: 100,
    height: 100,
  },
});
