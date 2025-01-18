import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Image, Text } from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import axios from "axios";

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [photoUri, setPhotoUri] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const takePhoto = async () => {
        if (camera) {
            const photo = await camera.takePictureAsync();
            setPhotoUri(photo.uri);
            console.log("Photo taken:", photo.uri);

            // Send the photo to the laptop server
            const photoBase64 = await FileSystem.readAsStringAsync(photo.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            await sendPhoto(photoBase64);
        }
    };

    const sendPhoto = async (photoBase64) => {
        try {
            const response = await axios.post("http://<YOUR_LAPTOP_IP>:5000/upload", {
                photo: photoBase64,
            });
            console.log("Photo uploaded:", response.data);
        } catch (error) {
            console.error("Error uploading photo:", error);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} ref={(ref) => setCamera(ref)} />
            <Button title="Take Photo" onPress={takePhoto} />
            {photoUri && (
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    camera: {
        flex: 1,
        width: "100%",
    },
    photoPreview: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
});
