import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { NetworkInfo } from 'react-native-network-info';
import * as Network from 'expo-network';
import * as Speech from 'expo-speech';


export default function App() {
  const [text, setText] = useState("");
  const [hazard, setHazard] = useState("");
  const [responseText, setResponseText] = useState("");
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photoApp, setPhotoApp] = useState(null);
  let lastMessageTime = Date.now() + 10000

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (await Network.getIpAddressAsync().then((ip) => ip === "100.66.7.79")) {
        const hazard = await sendPhotoToServer();
        if (hazard) {
          sendHapticFeedback(hazard[3], hazard[1]);
        }
      } else if (await Network.getIpAddressAsync() === "100.67.149.162") {
        const response = await axios.get("http://100.67.199.63:5002/get-hazard", {
          hazard: hazard
        });

        if (response.data.hazard) {
          const currentTime = Date.now();

          console.log(currentTime)
          console.log(lastMessageTime)
          if (response.data.hazard[1] < 1.0) {
            console.log("less than one meter calls")
            sendMessage(response.data.hazard);
            lastMessageTime = currentTime;
          } else if (currentTime - lastMessageTime >= 7000) {
            console.log("10 sec passed")

            sendMessage(response.data.hazard);
            lastMessageTime = currentTime;
          }
          sendHapticFeedback(response.data.hazard[3], response.data.hazard[1]);
        }
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const isSecondary = async () => {
    return await Network.getIpAddressAsync() === "100.67.149.162"
  }

  const sendMessage = async (hazard) => {
    const hazardName = hazard[0];
    const currentDistance = Math.round(hazard[1] * 10) / 10;
    const angle = hazard[4];
    let message = ""

    console.log("Send message");

    if (-20 < angle < 20) {
      message = `${hazardName}, ${currentDistance} metres away slightly to your ${hazard[3]}`;
    } else {
      message = `${hazardName}, ${currentDistance} metres away to your ${hazard[3]}`;
    }

    // const voices = await Speech.getVoices();
    // const britishVoice = voices.find(voice => voice.lang === 'en-GB');
    Speech.speak(message)
    // , { voice: britishVoice }

    previousDistances[hazardName] = currentDistance;
  };

  const sendHapticFeedback = async (hazard, distance) => {
    let hapticStyle;
    let buzz_count;
    if (distance < 0.5) {
      hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
      buzz_count = 30;
    }
    else if (hazard === "left") {
      if (await Network.getIpAddressAsync() == "100.67.149.162") {
        if (distance < 0.8) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
          buzz_count = 20;
        } else if (distance < 1.5) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
          buzz_count = 15;
        } else if (distance < 2) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
          buzz_count = 10;
        }
      }
    }
    else if (hazard === "right") {
      if (await Network.getIpAddressAsync() == "100.66.7.79") {
        if (distance < 0.8) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
          buzz_count = 20;
        } else if (distance < 1.5) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
          buzz_count = 15;
        } else if (distance < 2) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
          buzz_count = 10;
        }
      }
    }

    if (hapticStyle) {
      let count = 0;
      const interval = setInterval(() => {
        Haptics.impactAsync(hapticStyle);
        count++;
        if (count >= buzz_count) {
          clearInterval(interval);
        }
      }, 50);
    }
  }


  const sendPhotoToServer = async () => {
    try {
      if (cameraRef.current) {
        const options = {
          quality: 1,
          base64: true,
          exif: false,
        };
        const takedPhoto = await cameraRef.current.takePictureAsync(options);
        const formData = new FormData();
        formData.append('photo', {
          uri: takedPhoto.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });

        const response = await axios.post("http://100.67.199.63:5002/set-photo", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(response.data.hazard)
        return response.data.hazard
      }

    } catch (error) {
      console.error("Error sending photo to server:", error);
    }
  }

  const sendTextToServer = async () => {
    try {
      const response = await axios.post("http://100.67.199.63:5002/set-text", {
        text: text
      });
      console.log("test")
      console.log(response)

    } catch (error) {
      console.error("Error sending text to server:", error);
    }
  };

  // cameraRef.current = setInterval(sendPhotoToServer, 2000);


  return (
    <View style={styles.container}>
      {isSecondary() ?
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
          </View>
        </CameraView >
        :
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'white',
              marginTop: 20,
            }}
          >Secondary Device</Text>
        </View>
      }
    </View >
  );

}
const styles = StyleSheet.create({
  textInput: {
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
  }, buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
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
