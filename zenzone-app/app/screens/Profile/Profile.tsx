import { LIGHT } from "@constants/const";
import { AuthContext } from "@context/AuthContextProvider";
import { ThemeContext } from "@context/ThemeContext";
import { MyText, SafeView } from "@elements/SharedElements";
import useNavHelper from "@hooks/useNavHelper";
import React, { useContext } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Profile = () => {
  const { goToTrackUpload } = useNavHelper();
  const { user, signOut } = useContext(AuthContext);

  const { toggleTheme, theme } = useContext(ThemeContext);

  const allowedEmails = ["bhattaraijay23@gmail.com", "testnowuu@gmail.com"];

  const userSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "OK", onPress: () => signOut() },
    ]);
  };

  const meditationQuotes = [
    "Inhale the present, exhale the past.",
    "Your calm mind is the ultimate weapon against your challenges.",
    "Be where you are, not where you think you should be.",
    "The mind is everything. What you think, you become.",
    "Don't stress. Do your best. Forget the rest.",
    "Happiness is a state of mind.",
    "Breathe in peace, exhale stress.",
    "In the midst of movement and chaos, keep stillness inside of you.",
    "You cannot control the waves, but you can learn to surf.",
    "Let go of your mind and then be mindful. Close your ears and listen!",
  ];

  const yogaQuotes = [
    "Yoga is the journey of the self, through the self, to the self.",
    "Yoga teaches us to cure what need not be endured and endure what cannot be cured.",
    "The attitude of gratitude is the highest yoga.",
    "Yoga is the fountain of youth. You're only as young as your spine is flexible.",
    "Yoga is not about touching your toes, it's about what you learn on the way down.",
    "Yoga is the perfect opportunity to be curious about who you are.",
    "Yoga is the dance of every cell with the music of every breath that creates inner serenity and harmony.",
    "Yoga is the art of melting into the moment.",
    "Yoga is the space where flower blossoms.",
    "Yoga is a light, which once lit, will never dim. The better your practice, the brighter your flame.",
  ];

  const renderQuotes = (quotes) => {
    return quotes.map((quote, index) => (
      <MyText style={styles.quoteText} key={index}>
        ⊛ {quote}
      </MyText>
    ));
  };
  return (
    <SafeView
      style={{
        padding: 10,
      }}
    >
      <View style={styles.topView}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: user?.photoURL }}
            style={{
              width: 70,
              height: 70,
              backgroundColor: "#ff0000",
              borderRadius: 50,
            }}
          />
          <MyText style={{ marginTop: 15, marginLeft: 10 }} fontSize={30}>
            Hi {user?.displayName ? user?.displayName : user?.email}
          </MyText>
        </View>
        <Pressable style={styles.themeSwitchButton} onPress={toggleTheme}>
          <Icon
            name={theme === LIGHT ? "moon-o" : "sun-o"}
            size={30}
            color={theme === LIGHT ? "#000" : "#fff"}
          />
        </Pressable>
      </View>

      <ScrollView
        style={{
          height: 300,
        }}
      >
        <View style={styles.quoteContainer}>
          {renderQuotes(meditationQuotes)}

          {renderQuotes(yogaQuotes)}
        </View>
      </ScrollView>

      <View style={{ marginTop: 30 }}>
        {allowedEmails.includes(user?.email) && (
          <Pressable
            onPress={goToTrackUpload}
            style={{
              width: "80%",
              height: 50,
              backgroundColor: "#8E97FD",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              alignSelf: "center",
            }}
          >
            <MyText fontSize={25}>Upload Track</MyText>
          </Pressable>
        )}
        <Pressable
          onPress={userSignOut}
          style={{
            width: "80%",
            height: 50,
            backgroundColor: "#FD3C4A",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            alignSelf: "center",
          }}
        >
          <MyText fontSize={25}>Sign out</MyText>
        </Pressable>
      </View>
    </SafeView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  topView: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 20,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  followerView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quoteContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "justify",
  },
  themeSwitchButton: {
    position: "absolute",
    top: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  themeSwitchButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
