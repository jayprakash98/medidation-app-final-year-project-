import { AuthContext } from "@context/AuthContextProvider";
import { MyText, SafeView } from "@elements/SharedElements";
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const LoginPage = () => {
  const navigation = useNavigation<any>();
  const { signInWithGoogle } = useContext(AuthContext);

  const handleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <SafeView style={styles.container}>
      <Image source={require("../../assets/icon.png")} style={styles.image} />
      <MyText style={styles.title} bold>
        Welcome to Zenzone
      </MyText>
      <MyText
        style={{
          marginBottom: 50,
          fontSize: 18,
        }}
      >
        Meditation made easy
      </MyText>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <FontAwesome
          name="google"
          size={24}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F0F8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    // color: "#1E90FF",
    // marginBottom: 50,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 5,
    width: "60%",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
  image: {
    width: "50%",
    height: "30%",
    resizeMode: "contain",
    marginBottom: 50,
  },
});

export default LoginPage;
