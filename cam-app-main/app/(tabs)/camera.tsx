import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { View, , Button, Text, StyleSheet } from "react-native";
import axios from "axios";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [responseText, setResponseText] = useState("");
  const [text, setText] = useState("");

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);

      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  const sendTextToServer = async () => {
    try {
      // const temp = await axios.get("http://100.67.199.63/get-text");
      // const response = await axios.post("http://127.0.0.1:5002/set-text", {
      const response = await axios.post("http://100.67.199.63:5002/set-text", {
        text: text
      });
      console.log(response.data.message)
      // console.log(response.data.receivedText);
      setResponseText(response.data.message);
      // console.log(response.data.receivedText);
    } catch (error) {
      console.error("Error sending text to server:", error);
    }
  };


  if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />

  return (
    <View style={styles.container}>
      {/* <TextInput
        style={styles.textInput}
        placeholder="Type something"
        value={text}
        onChangeText={setText}
      /> */}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name='retweet' size={44} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name='camera' size={44} color='black' />
          </TouchableOpacity>
          {/* <TextInput
            style={styles.textInput}
            placeholder="Type something"
            value={text}
            onChangeText={setText}
          /> */}
        </View>
      </CameraView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  }, textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 12,
    paddingLeft: 8,
  },
  responseText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});