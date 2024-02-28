import { MainStackRoutes } from "@constants/screens";
import useStyle from "@hooks/useStyle";
import { createStackNavigator } from "@react-navigation/stack";
import DownloadedMusic from "@screens/Downloads/DownloadedMusic";
import OfflineMusicPlayer from "@screens/Downloads/OfflineMusicPlayer";
import PlayerPage from "@screens/MusicView/PlayerPage";
import TrackUpdate from "@shared/Inputs/TrackUpdate";
import TrackUpload from "@shared/Inputs/TrackUpload";
import MusicPage from "@shared/MusicPage";
import React from "react";
import MainTab from "./MainTab";
import FaceExpression from "@camera/FaceDetection";
import Pose from "@shared/Pose";

const Stack = createStackNavigator();

const MainStack = () => {
  const { color } = useStyle();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: color.main,
          elevation: 0,
        },
        headerTintColor: color.textColor,
        headerTitleAlign: "center",
        cardStyle: {
          backgroundColor: "transparent",
        },
        headerMode: "float",
        headerShown: false,
      }}
    >
      <Stack.Group>
        <Stack.Screen name={MainStackRoutes.MainTab} component={MainTab} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen
          name={MainStackRoutes.MainMusicPage}
          component={PlayerPage}
        />
        <Stack.Screen
          name={MainStackRoutes.MainDownloadedMusicPage}
          component={OfflineMusicPlayer}
        />
        <Stack.Screen
          name={MainStackRoutes.MainDownloadedMusicListPage}
          component={DownloadedMusic}
        />
        <Stack.Screen
          name={MainStackRoutes.MusicDescription}
          component={MusicPage}
        />
        <Stack.Screen
          name={MainStackRoutes.TrackUpload}
          component={TrackUpload}
        />
        <Stack.Screen
          name={MainStackRoutes.TrackUpdate}
          component={TrackUpdate}
        />

        <Stack.Screen
          name={MainStackRoutes.FaceDetection}
          component={FaceExpression}
        />

        {/* 
        <Stack.Screen
          name={MainStackRoutes.ObjectDetection}
          component={ObjectDetection}
        /> */}
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name={MainStackRoutes.PoseDetection} component={Pose} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainStack;
