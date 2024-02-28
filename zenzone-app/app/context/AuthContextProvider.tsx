import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "287897879279-h350fpnlc15v5qa5l721mh2lmdvkq1pe.apps.googleusercontent.com", // Get this from Firebase Console
});

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signOut: () => void;
  signInWithPhoneNumbers: (phoneNumber: string) => void;
  signInWithGoogle: () => void;
  confirmCode: (code: string) => Promise<false>;
  error: string | null;
};

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  signOut: () => {},
  signInWithPhoneNumbers: () => {},
  signInWithGoogle: () => {},
  confirmCode: () => Promise.resolve(false),
  error: null,
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [phonenumber, setPhonenumber] = useState("");

  const signOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
    } catch (error: any) {
      Alert.alert(error);
    }
  };

  const signInWithPhoneNumbers = async (phoneNumber: string) => {
    setPhonenumber(phoneNumber);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmation);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const { user } = await auth().signInWithCredential(googleCredential);

      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: "user",
        };

        await firestore().collection("users").doc(user.uid).set(userData);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const confirmCode = async (code: string) => {
    try {
      if (confirmation) {
        await confirmation.confirm(code);
        auth().currentUser?.uid &&
          (await firestore()
            .collection("users")
            .doc(auth().currentUser?.uid)
            .set({
              phoneNumber: phonenumber,
              uid: auth().currentUser?.uid,
            }));
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signOut,
        signInWithPhoneNumbers,
        signInWithGoogle,
        //@ts-ignore
        confirmCode,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
