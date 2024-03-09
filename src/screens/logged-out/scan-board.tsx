import React, { useState } from "react";
import { View, Button } from "react-native";
import AppCamera from "../../components/camera/camera";

const LoggedOutScanBoardScreen = () => {
  const [shouldOpenCamera, setShouldOpenCamera] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Scanner mon carton"
        onPress={() => setShouldOpenCamera(true)}
      />
      {shouldOpenCamera && <AppCamera />}
    </View>
  );
};
export default LoggedOutScanBoardScreen;
