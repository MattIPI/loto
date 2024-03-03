import { Link } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import React from "react";
import { Alert, Button } from "react-native";
import { SignUpScreen } from "./sign-up";
import { Routes } from "../utils/routing";

type RootStackParamList = {
  Home: JSX.Element;
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenProps;
};

export const HomeScreen = ({ navigation }: Props) => {
  const createTwoButtonAlert = () =>
    Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  console.log("navigation:", navigation);

  return (
    <>
      <Link to={Routes.SIGN_UP.path}>Créer un compte</Link>
      <Link to={Routes.LOGGED_OUT_SCAN_BOARD.path}>Commencer sans compte</Link>
      <Button title="Go to Jane's profile" onPress={createTwoButtonAlert} />
    </>
  );
};
