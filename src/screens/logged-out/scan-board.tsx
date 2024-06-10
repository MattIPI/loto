import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import AppCamera from '../../components/camera/camera';
import { processImageLocally } from '../../helpers/image-processing';
import { CameraCapturedPicture } from 'expo-camera/build/Camera.types';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-reanimated-table';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../utils/routing';

const LoggedOutScanBoardScreen = ({ navigation }) => {
    const [shouldOpenCamera, setShouldOpenCamera] = useState(false);
    const [capturedPictureUrl, setCapturedPictureUrl] = useState<string>();
    const [grid, setGrid] = useState<LotoGrid>();
    const [isProcessingPicture, setIsProcessingPicture] = useState<boolean>();
    const router = useNavigation();

    const storeGrid = (grid: LotoGrid) => {
        localStorage.setItem('grid', JSON.stringify(grid));
    };

    const onCapturedPicture = async (photo: CameraCapturedPicture) => {
        if (photo.base64) {
            setIsProcessingPicture(true);
            setCapturedPictureUrl(photo.uri);
            const lotoGrid = await processImageLocally(photo.base64);
            setGrid(lotoGrid);
            setTimeout(() => {
                setIsProcessingPicture(false);
            }, 2000);
            storeGrid(lotoGrid);

            navigation(Routes.LOGGED_OUT_RESULTS.path);
        }
    };

    return (
        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
            <Text style={{ position: shouldOpenCamera ? 'absolute' : 'relative' }}>
                Commençons par saisir votre grille de loto
            </Text>
            {!shouldOpenCamera && <Button title="Scanner mon carton" onPress={() => setShouldOpenCamera(true)} />}
            {shouldOpenCamera && <AppCamera onCapturedPicture={onCapturedPicture} />}
            {isProcessingPicture && (
                <Text
                    style={{
                        position: 'absolute',
                        zIndex: 10,
                        fontSize: 25,
                        backgroundColor: '#eee7',
                        width: '100%',
                        textAlign: 'center',
                    }}
                >
                    Image en cours d'analyse ...
                </Text>
            )}
            {/* {capturedPictureUrl && <Image source={{ uri: capturedPictureUrl }} width={500} height={500} />} */}
            {/* {grid && (
                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                    <Rows data={grid} />
                </Table>
            )} */}
        </View>
    );
};
export default LoggedOutScanBoardScreen;
