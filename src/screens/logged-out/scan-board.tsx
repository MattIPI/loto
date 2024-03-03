import React, { useCallback, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
// import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Camera, CameraType, PermissionStatus } from "expo-camera";

function LoggedOutScanBoardScreen() {
  const [camera, setCamera] = useState({
    hasCameraPermission: null,
    type: CameraType.back,
  });
  const [shouldOpenCamera, setShouldOpenCamera] = useState(false);

  const [cameraStatus, requestPermission] = Camera.useCameraPermissions();

  const openExpoCamera = async () => {
    if (!cameraStatus?.granted) {
      await requestPermission();
    }
    setShouldOpenCamera(true);
  };

  const takeSnapshot = useCallback(() => {
    console.log("takeSnapshot");
  }, []);

  if (cameraStatus?.status === PermissionStatus.DENIED) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Button title="Scanner mon carton" onPress={openExpoCamera} />
      {shouldOpenCamera && (
        <Camera style={{ flex: 1 }} type={camera.type}>
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: "flex-end",
                alignItems: "center",
              }}
              onPress={() => {
                setCamera({
                  type: CameraType.back,
                  hasCameraPermission: camera.hasCameraPermission,
                });
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                {" "}
                Flip{" "}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: "flex-end",
                alignItems: "center",
              }}
              onPress={async () => {
                takeSnapshot();
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                Take snap
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});

export default LoggedOutScanBoardScreen;
