import { MainStackRoutes } from "@constants/screens";
import { CenteredView, SafeView } from "@elements/SharedElements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Detection = () => {
  const navigation = useNavigation<any>();
  const detections = [MainStackRoutes.FaceDetection];

  const onPress = (detection: string) => {
    console.log(detection);
    navigation.navigate(detection);
  };

  return (
    <SafeView>
      <CenteredView full>
        <View style={styles.container}>
          {detections.map((detection, index) => {
            return (
              <Pressable
                key={index}
                style={styles.button}
                onPress={() => onPress(detection)}
              >
                <Text style={styles.text}>{detection}</Text>
              </Pressable>
            );
          })}
        </View>
      </CenteredView>
    </SafeView>
  );
};

export default Detection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    height: 50,
    shadowColor: "#000",
    marginTop: 20,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
