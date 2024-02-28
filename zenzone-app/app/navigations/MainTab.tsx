import colors from "@constants/colors";
import { MainTabRoutes } from "@constants/screens";
import { BottomTabContext } from "@context/BottomTabContext";
import { MyText } from "@elements/SharedElements";
import useStyle from "@hooks/useStyle";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { Keyboard, Platform, Pressable, StatusBar, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import Pose from "../shared/Pose";
import FaceDetectionStack from "./FaceDetectionStack/FaceDetectionStack";
import HomeStack from "./HomeStack/HomeStack";
import ProfileStack from "./ProfileStack/ProfileStack";
import SleepStack from "./SleepStack/SleepStack";
const Tab = createBottomTabNavigator();

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

type MyTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

type ClockProps = {
  1: "one";
  2: "two";
  3: "three";
  4: "four";
  5: "five";
  6: "six";
  7: "seven";
  8: "eight";
  9: "nine";
  10: "ten";
  11: "eleven";
  12: "twelve";
};

const clock: ClockProps = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
};

const MyTabBar: React.FC<MyTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { color } = useStyle();

  const currentTime = moment().format("LT");
  const insets = useSafeAreaInsets();

  //@ts-ignore
  const time =
    //@ts-ignore
    clock[
      Number(currentTime) > 9
        ? currentTime.substring(0, 2)
        : currentTime.substring(0, 1)
    ];

  const { tabHeight } = useContext(BottomTabContext);

  const btStyle = useAnimatedStyle(() => {
    return {
      height: tabHeight.value + insets.bottom,
    };
  });

  const iconNames = [
    "home",
    "power-sleep",
    // "meditation",
    `face-man-profile`,
    // "human",
    "account",
  ];

  useEffect(() => {
    let keyboardEventListeners: any;
    if (Platform.OS === "android") {
      keyboardEventListeners = [
        Keyboard.addListener("keyboardDidShow", () => (tabHeight.value = 0)),
        Keyboard.addListener("keyboardDidHide", () => (tabHeight.value = 60)),
      ];
    }
    return () => {
      if (Platform.OS === "android") {
        keyboardEventListeners &&
          keyboardEventListeners.forEach((eventListener: any) =>
            eventListener.remove()
          );
      }
    };
  }, [tabHeight]);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={color.main}
        barStyle={
          color.main === colors.darkTheme ? "light-content" : "dark-content"
        }
      />
      <Animated.View
        style={[
          {
            flexDirection: "row",
            elevation: 0,
            backgroundColor: color.main,
          },
          btStyle,
        ]}
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const iconName = iconNames[index];
          return (
            <AnimatedPress
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              key={index}
              style={[
                {
                  flex: 1,
                  alignItems: "center",
                  paddingTop: 10,
                },
              ]}
            >
              <View
                style={[
                  {
                    backgroundColor: isFocused ? color.iconColor : color.main,
                    padding: 7,
                    borderRadius: 10,
                  },
                ]}
              >
                <Icon
                  name={iconName}
                  size={25}
                  style={[
                    {
                      color: isFocused ? color.white : color.inverse,
                    },
                  ]}
                />
              </View>
              <MyText
                style={{
                  color: color.grey,
                  fontSize: 13,
                }}
                center
              >
                {label}
              </MyText>
            </AnimatedPress>
          );
        })}
      </Animated.View>
    </>
  );
};

function MainTab() {
  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name={MainTabRoutes.HomeStack}
          component={HomeStack}
          options={{
            tabBarLabel: "Home",
          }}
        />
        <Tab.Screen
          name={MainTabRoutes.SleepStack}
          component={SleepStack}
          options={{
            tabBarLabel: "Trend",
          }}
        />
        {/* <Tab.Screen
          name={MainTabRoutes.MeditationStack}
          component={MeditationStack}
          options={{
            tabBarLabel: "Meditation",
            // kill the tab as user leaves the application
            unmountOnBlur: true,
          }}
        /> */}

        <Tab.Screen
          name={MainTabRoutes.FaceDetectionStack}
          component={FaceDetectionStack}
          options={{
            tabBarLabel: "Face",
            // kill the tab as user leaves the application
            unmountOnBlur: true,
          }}
        />

        {/* <Tab.Screen
          name={MainTabRoutes.BodyDetectionStack}
          component={Pose}
          options={{
            tabBarLabel: "BodyScan",
            unmountOnBlur: true,
          }}
        /> */}
        <Tab.Screen
          name={MainTabRoutes.ProfileStack}
          component={ProfileStack}
          options={{
            tabBarLabel: "Account",
          }}
        />
      </Tab.Navigator>
    </>
  );
}
export default MainTab;
