import * as React from "react";
import { runOnJS, useSharedValue } from "react-native-reanimated";

import { StyleSheet } from "react-native";
import {
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";

import { Camera } from "react-native-vision-camera";
import { scanFaces, Face } from "vision-camera-face-detector";

import { Label } from "@components/Label";
import { faceExpression } from "@utils/faceExpression";
import { useNavigation } from "@react-navigation/native";
import { FaceDetectionStackRoutes } from "@constants/screens";

const FaceExpression = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [faces, setFaces] = React.useState<Face[]>();
  const currentLabel = useSharedValue("");
  const [executionCount, setExecutionCount] = React.useState(0);

  const navigation = useNavigation<any>();
  const devices = useCameraDevices();
  const device = devices.front;

  React.useEffect(() => {
    if (faces !== null && faces !== undefined) {
      const face = faces[0];
      if (face && executionCount < 2) {
        currentLabel.value = faceExpression(face.smilingProbability);
        setExecutionCount(executionCount + 1);

        if (currentLabel.value !== "") {
          console.log(currentLabel.value);
          navigation.navigate(FaceDetectionStackRoutes.DetectedFace, {
            expression: currentLabel.value,
          });
        }
      }
    }
  }, [currentLabel, faces]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const scannedFaces = scanFaces(frame);
    // console.log(frame);
    runOnJS(setFaces)(scannedFaces);
  }, []);

  return device != null && hasPermission ? (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <Label sharedValue={currentLabel} />
    </>
  ) : null;
};

export default FaceExpression;
