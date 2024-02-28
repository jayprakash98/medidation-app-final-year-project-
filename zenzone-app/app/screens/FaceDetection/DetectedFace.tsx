import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DetectedFace = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome to extercise based on your emotions
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Adjust background color as needed
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DetectedFace;
