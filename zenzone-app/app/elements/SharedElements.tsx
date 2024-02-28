import React from "react";
import {
  ButtonProps,
  Pressable,
  SafeAreaView,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import useStyle from "../hooks/useStyle";

type CustomViewProps = {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  full?: boolean;
};

const SafeView: React.FC<CustomViewProps> = ({ children, style }) => {
  const { color } = useStyle();

  return (
    <SafeAreaView style={[style, { backgroundColor: color.main, flex: 1 }]}>
      {children}
    </SafeAreaView>
  );
};

const CenteredView: React.FC<CustomViewProps> = ({ children, style, full }) => {
  const { color } = useStyle();

  return (
    <SafeAreaView
      style={[
        style,
        {
          backgroundColor: color.main,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

interface CustomTextProps extends TextProps {
  style?: TextStyle | TextStyle[];
  color?: string;
  fontSize?: number;
  title?: boolean;
  fontFamily?: string;
  center?: boolean;
  bold?: boolean;
  textAlign?: any;
  fontWeight?: any;
  numberOfLines?: number;
  light?: boolean;
  semibold?: boolean;
}

const MyText: React.FC<CustomTextProps> = ({
  children,
  title,
  fontSize,
  style,
  center,
  textAlign,
  bold,
  fontWeight,
  color: textColor,
  numberOfLines,
  light,
  semibold,
}) => {
  const { color } = useStyle();
  return (
    <Text
      numberOfLines={numberOfLines && numberOfLines}
      style={[
        {
          color: textColor ? textColor : color.textColor,
          fontSize: fontSize ? fontSize : title ? 32 : 17,
          textAlign: center ? "center" : textAlign,
          fontWeight: bold ? "bold" : fontWeight,
          // fontFamily: bold
          //   ? 'Nunito-ExtraBold'
          //   : light
          //   ? 'Nunito-Light'
          //   : semibold
          //   ? 'Nunito-SemiBold'
          //   : 'Nunito-Regular',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

interface CustomButtonProps extends ButtonProps {
  style?: TextStyle | TextStyle[];
  onPress: () => void;
  color?: string;
  title: string;
}
const CenteredButton: React.FC<CustomButtonProps> = ({
  onPress,
  color,
  title,
  style,
}) => {
  return (
    <Pressable
      style={[
        {
          backgroundColor: "#2BAE66FF",
          padding: 10,
          borderRadius: 12,
          width: "100%",
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        },
        style,
      ]}
      onPress={onPress}
    >
      <MyText
        style={{
          color: "#fff",
        }}
        bold
      >
        {title}
      </MyText>
    </Pressable>
  );
};

interface CustomButtonProps extends ButtonProps {
  style?: TextStyle | TextStyle[];
  onPress: () => void;
  color?: string;
  title: string;
}
const MyButton: React.FC<CustomButtonProps> = ({
  onPress,
  color,
  title,
  style,
}) => {
  return (
    <Pressable
      style={[
        {
          backgroundColor: "#2BAE66FF",
          padding: 10,
          borderRadius: 12,
          width: "100%",
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        },
        style,
      ]}
      onPress={onPress}
    >
      <MyText
        style={{
          color: "#fff",
        }}
        bold
      >
        {title ? title : "Button"}
      </MyText>
    </Pressable>
  );
};

export { SafeView, MyText, CenteredButton, CenteredView, MyButton };
