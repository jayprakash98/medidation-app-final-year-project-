import { TrackProps } from "@constants/Interfaces";
import { MyText } from "@elements/SharedElements";
import { AudioHelperType } from "@helpers/audio-helper";
import useStyle from "@hooks/useStyle";
import Slider from "@react-native-community/slider";
import { pause, resume, speak, stop } from "expo-speech";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AVPlaybackStatus } from "expo-av";
import * as Speech from "expo-speech";

const AnimaedPressable = Animated.createAnimatedComponent(Pressable);

const Player = ({
  player,
  item,
}: {
  player: AudioHelperType;
  item: TrackProps;
}) => {
  const [showElapsed, setShowElapsed] = useState(false);
  const { color } = useStyle();
  const playScale = useSharedValue(6);
  const pressPadding = useSharedValue(20);

  useEffect(() => {
    player.setVolume(40);
    player.play();
    return () => {
      stop();
    };
  }, []);

  const speakText = (text: string) => {
    speak(text, {
      language: "en",
      rate: 0.5,
      voice: "com.apple.speech.synthesis.voice.Alex",
      volume: 1,
    });
  };

  const play = () => {
    player.setVolume(15);
    player.play();
    !player.isMuted && speakText(item.pose_description);

    pressPadding.value = withSpring(20);

    resume();
  };

  const pauses = () => {
    player.pause();
    // MusicControl.stopControl();
    pressPadding.value = withSpring(15);
    //@ts-ignore
    if (global.sound !== undefined) {
      //@ts-ignore
      global.sound === undefined;
    }
    pause();
  };

  useEffect(() => {
    playScale.value = Math.random() * 6 + 2;
  }, [player, playScale]);

  const playStyle = useAnimatedStyle(() => {
    return {
      padding: withSpring(playScale.value * 5),
    };
  });

  const pressStyle = useAnimatedStyle(() => {
    return {
      padding: withSpring(pressPadding.value),
    };
  });

  return (
    <>
      <View style={[styles.switches]}>
        <Pressable onPress={player.rewind10s}>
          <Icon name="replay-10" size={35} color={color.inverse} />
        </Pressable>
        <View
          style={{
            padding: 50,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: color.grey,
                borderRadius: 100,
                position: "absolute",
                zIndex: -10,
              },
              playStyle,
            ]}
          >
            {player.status === "play" ? (
              <AnimaedPressable
                onPress={pauses}
                style={[
                  {
                    backgroundColor: color.inverse,
                    borderRadius: 100,
                  },
                  pressStyle,
                ]}
              >
                <Icon name="pause" size={35} color={color.main} />
              </AnimaedPressable>
            ) : (
              <AnimaedPressable
                onPress={play}
                style={[
                  {
                    backgroundColor: color.inverse,
                    borderRadius: 45,
                  },
                  pressStyle,
                ]}
              >
                <Icon name="play-arrow" size={35} color={color.main} />
              </AnimaedPressable>
            )}
          </Animated.View>
        </View>
        <Pressable onPress={player.forward10s}>
          <Icon name="forward-10" size={35} color={color.inverse} />
        </Pressable>
      </View>

      <>
        <View
          style={{
            marginTop: 15,
            flexDirection: "row",
          }}
        >
          <Slider
            style={{ width: "80%", alignSelf: "center" }}
            minimumValue={0}
            maximumValue={player.duration}
            value={player.currentTime}
            minimumTrackTintColor={color.inverse}
            maximumTrackTintColor={
              player.status === "loading" ? "#f00" : color.inverse
            }
            thumbTintColor={color.grey}
            onTouchStart={player.pause}
            onTouchEnd={player.play}
            onSlidingComplete={(seconds) => player.seekToTime(seconds)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            justifyContent: "space-between",
          }}
        >
          <MyText>{player.currentTimeString}</MyText>
          <Pressable onPress={() => setShowElapsed(!showElapsed)}>
            <MyText>
              {showElapsed
                ? `- ${player.elapsedTime}`
                : player.durationString || "05:00"}
            </MyText>
          </Pressable>
        </View>
      </>
    </>
  );
};

export default Player;

const styles = StyleSheet.create({
  switches: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 50,
    width: "70%",
    alignItems: "center",
  },
});
