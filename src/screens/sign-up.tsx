import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";

type RootStackParamList = {
  SignUp: JSX.Element;
};

export type SignUpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SignUp"
>;

type Props = {
  navigation: SignUpScreenProps;
};

export function SignUpScreen({ navigation }: Props) {
  const [text, onChangeText] = useState<string>("Useless Text");
  const [number, onChangeNumber] = useState<string>();

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
