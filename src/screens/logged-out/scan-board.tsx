import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import AppCamera from '../../components/camera/camera';
import { processImageLocally } from '../../helpers/image-processing';
import { CameraCapturedPicture } from 'expo-camera/build/Camera.types';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-reanimated-table';

const LoggedOutScanBoardScreen = () => {
    const [shouldOpenCamera, setShouldOpenCamera] = useState(false);
    const [capturedPictureUrl, setCapturedPictureUrl] = useState<string>();
    const [grid, setGrid] = useState<LotoGrid>();

    const onCapturedPicture = async (photo: CameraCapturedPicture) => {
        if (photo.base64) {
            setShouldOpenCamera(false);
            setCapturedPictureUrl(photo.uri);
            const lotoGrid = await processImageLocally(photo.base64);
            setGrid(lotoGrid);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Button title="Scanner mon carton" onPress={() => setShouldOpenCamera(true)} />
            {shouldOpenCamera && !capturedPictureUrl && <AppCamera onCapturedPicture={onCapturedPicture} />}
            {capturedPictureUrl && <Image source={{ uri: capturedPictureUrl }} width={500} height={500} />}
            {grid && (
                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                    <Rows data={grid} />
                </Table>
            )}
        </View>
    );
};
export default LoggedOutScanBoardScreen;
