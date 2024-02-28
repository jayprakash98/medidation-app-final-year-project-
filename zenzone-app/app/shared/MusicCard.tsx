import { TrackProps } from "@constants/Interfaces";
import { MyText } from "@elements/SharedElements";
import useStyle from "@hooks/useStyle";
import React from "react";
import { Dimensions, Image, Pressable, View } from "react-native";
const { width } = Dimensions.get("window");

interface MusicCardProps {
  onPress: () => void;
  item: TrackProps;
}

const MusicCard: React.FC<MusicCardProps> = ({ onPress, item }) => {
  const { color } = useStyle();
  return (
    <>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: "#192f6a",
          width: width / 2.2,
          height: width / 3.2,
          marginTop: 20,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={
            item.url_png
              ? {
                  uri: item.url_png,
                }
              : require("../../assets/images/1.png")
          }
          style={{
            resizeMode: "contain",
            width: width / 2.2,
            height: width / 3.2,
          }}
        />
      </Pressable>
      <View>
        <MyText
          bold
          fontSize={17}
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            width: width / 2.2,
          }}
        >
          {item.sanskrit_name
            ? item.english_name + " - " + item.sanskrit_name
            : item.title}
        </MyText>
        <MyText
          fontSize={15}
          color={color.grey}
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            width: width / 2.2,
          }}
        >
          {item.category_name
            ? item.category_name
            : item.sanskrit_name_adapted || "meditation"}
        </MyText>
      </View>
    </>
  );
};

export default MusicCard;
