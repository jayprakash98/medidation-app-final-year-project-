import { TrackProps } from "@constants/Interfaces";
import { MainStackRoutes } from "@constants/screens";
import { MyText } from "@elements/SharedElements";
import useStyle from "@hooks/useStyle";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import EnIcon from "react-native-vector-icons/Entypo";
import IonIcon from "react-native-vector-icons/Ionicons";
type HeaderProps = {
  backHandler: () => void;
  item: TrackProps;
  downloadData: () => void;
  downloaded?: boolean;
  downloadProgress: number;
  currentTime: string;
};

const Header: React.FC<HeaderProps> = (props) => {
  const { backHandler, item } = props;
  const { color } = useStyle();
  const navigation = useNavigation<any>();

  const handleBack = () => {
    backHandler();
  };

  const goToPoseDetectionPage = () => {
    navigation.navigate(MainStackRoutes.PoseDetection, {
      item,
      currentTime: props.currentTime,
    });
  };

  return (
    <View style={[styles.headerContainer]}>
      <Pressable
        onPress={handleBack}
        style={{ ...styles.cross, backgroundColor: color.inverse }}
      >
        <EnIcon name="cross" size={30} color={color.main} />
      </Pressable>

      <MyText
        ellipsizeMode="tail"
        numberOfLines={1}
        style={{
          flex: 1,
        }}
        fontSize={18}
      >
        {item.title}
      </MyText>

      <View style={styles.icons}>
        <Pressable
          style={{
            marginRight: 10,
            padding: 10,
            borderRadius: 30,
            zIndex: 1000,
          }}
          onPress={() => {
            goToPoseDetectionPage();
          }}
        >
          <IonIcon name="body" size={24} color={color.textColor} />
        </Pressable>

        {/* {downloadProgress > 0 && downloadProgress < 0.9 ? (
          <View style={{marginRight: 10, padding: 10, borderRadius: 30}}>
            {Platform.OS === 'android' ? (
              <Progress.Pie progress={downloadProgress} size={26} />
            ) : (
              <ActivityIndicator size="small" color="#f00" />
            )}
          </View>
        ) : (
          <>
            {downloaded ? (
              <Pressable
                style={{marginRight: 10, padding: 10, borderRadius: 30}}>
                <Icon
                  name="file-download-done"
                  size={26}
                  color={color.downloadedColor}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={downloadData}
                style={{marginRight: 10, padding: 10, borderRadius: 30}}>
                <Icon name="file-download" size={24} color={color.textColor} />
              </Pressable>
            )}
          </>
        )} */}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  cross: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  icons: {
    flexDirection: "row",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});
