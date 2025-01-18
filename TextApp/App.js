import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import axios from "axios";
// import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useEffect } from 'react';
// const [photo, setPhoto] = useState < any > (null);
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

  useEffect(() => {
    // if (permission) {
    //   if (permission.granted === true) return;

    const intervalId = setInterval(async () => {
      // console.log(await Network.getIpAddressAsync())
      if (await Network.getIpAddressAsync().then((ip) => ip === "100.66.7.79")) {
        const hazard = sendPhotoToServer();
        //sendMessage(hazard);
        // if (hazard) {
        //console.log(hazard)
        //sendMessage(hazard);
        // sendHapticFeedback(hazard[3], hazard[1]);
        // }
      } else if (await Network.getIpAddressAsync() === "100.67.149.162") {
        const response = await axios.get("http://100.67.199.63:5002/get-hazard", {
          hazard: hazard
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
        });

        // sendMessage(hazard);

        console.log(response.data.hazard)
        if (response.data.hazard) {
          sendMessage(response.data.hazard);
          // sendHapticFeedback(response.data.hazard[3], response.data.hazard[1]);
        }
      }
    }, 2000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }
    // }
    // }, [permission]);
  );

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


  // const handleTakePhoto = async () => {
  //   if (cameraRef.current) {
  //     const options = {
  //       quality: 1,
  //       base64: true,
  //       exif: false,
  //     };
  //     const takedPhoto = await cameraRef.current.takePictureAsync(options);

  //     setPhoto(takedPhoto);
  //   }
  // };
  const sendMessage = async (hazard) => {
    // Speech.speak("hello")
    // send voice api
    //const ipAddress = await Network.getIpAddressAsync();
    // if (await Network.getIpAddressAsync() == "100.67.149.162") {
    // console.log("Send message")
    if (true) {//hazard[1] < 3) {
      console.log(hazard)
      //Speech.speak(msgSHort)
      // Speech.speak("Hazard detected ${hazard[0]}")


      // const msgSHort = `Hazard detected ${hazard[0]}`
      // const message = `Hazard detected ${hazard[0]}, at distance ${hazard[1]} meters, ${hazard[3]} degrees away from you`
      // console.log(message)
      // Speech.speak(message)
    }
    // }
  }

  const sendHapticFeedback = async (hazard, distance) => {
    let hapticStyle;
    let buzz_count;
    console.log("-----")
    console.log(hazard)
    console.log("-----")
    if (hazard === "left") {
      console.log(await Network.getIpAddressAsync())
      if (await Network.getIpAddressAsync() == "100.67.149.162") {

        if (distance < 1) {
          // console.log("heavy")
          hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
          buzz_count = 10;
        } else if (distance < 2) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Medium;
          buzz_count = 5;
        } else if (distance < 3) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Light;
          buzz_count = 2;
        }
      }
      // send right buzz
    }
    else if (hazard === "right") {
      // send left buzz
      if (await Network.getIpAddressAsync() == "100.66.7.79") {
        if (distance < 1) {
          // console.log("heavy")
          hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
          buzz_count = 10;
        } else if (distance < 2) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Medium;
          buzz_count = 5;
        } else if (distance < 3) {
          hapticStyle = Haptics.ImpactFeedbackStyle.Light;
          buzz_count = 2;
        }
      }
    } else {
      hapticStyle = Haptics.ImpactFeedbackStyle.Heavy;
      buzz_count = 20;
    }

    // console.log(hapticStyle)
    if (hapticStyle) {
      let count = 0;
      const interval = setInterval(() => {
        Haptics.impactAsync(hapticStyle);
        count++;
        if (count >= buzz_count) {
          clearInterval(interval); // Stop after 5 repetitions
        }
      }, 50);
    }
  }


  const sendPhotoToServer = async () => {
    // intervalRef.current = setInterval(async () => {
    // if (intervalRef.current) {
    // intervalRef
    try {
      //console.log('y')
      //sendHapticFeedback("left", 0);
      if (cameraRef.current) {
        const options = {
          quality: 1,
          base64: true,
          exif: false,
        };
        const takedPhoto = await cameraRef.current.takePictureAsync(options);
        // setPhoto(takedPhoto);
        //const res = await axios.post("http://100.67.199.63:5002/set-text", {
        //  text: takedPhoto
        //});
        const formData = new FormData();
        formData.append('photo', {
          uri: takedPhoto.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
        // console.log(takedPhoto.uri)
        // Send the photo to the backend
        //const response = await fetch("http://100.67.199.63:5002/set-photo", {
        // method: 'POST',
        // body: formData,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        //});
        const response = await axios.post("http://100.67.199.63:5002/set-photo", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // console.log(response)
        // console.log(response.data.message)
        console.log(response.data.hazard)
        return response.data.hazard
      }
      // const temp = await axios.get("http://100.67.199.63/get-text");
      // const response = await axios.post("http://100.67.199.63:5002/set-text", {
      //   text: text
      // });
      // console.log(response.data.message)
      // console.log(response.data.receivedText);
      // setResponseText(response.data.message);
      // console.log(response.data.receivedText);
    } catch (error) {
      console.error("Error sending photo to server:", error);
    }
    // };
    // }, 2000);
  }

  const sendTextToServer = async () => {
    try {
      // if (cameraRef.current) {
      //   const options = {
      //     quality: 1,
      //     base64: true,
      //     exif: false,
      //   };
      // const takedPhoto = await cameraRef.current.takePictureAsync(options);
      // setPhoto(takedPhoto);
      //const res = await axios.post("http://100.67.199.63:5002/set-text", {
      //  text: takedPhoto
      //});
      // const formData = new FormData();
      // formData.append('photo', takedPhoto);
      // const res = await fetch("http://100.67.199.63:5002/set-text", {
      //   method: 'POST',
      //   body: formData
      // });
      // console.log(takedPhoto.height)
      // const formData = new FormData();
      // formData.append('photo', {
      //   uri: takedPhoto.uri,
      //   name: 'photo.jpg',
      //   type: 'image/jpeg',
      // });

      const response = await axios.post("http://100.67.199.63:5002/set-text", {
        text: text
      });
      console.log("test")
      console.log(response)

      // Send the photo to the backend
      // const response = await fetch("http://100.67.199.63:5002/set-text", {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      // const temp = await axios.get("http://100.67.199.63/get-text");
      // const response = await axios.post("http://127.0.0.1:5002/set-text", {
      // const response = await axios.post("http://100.67.199.63:5002/set-text", {
      //   text: text
      // });
      // console.log(response.data.message)
      // console.log(response.data.receivedText);
      // setResponseText(response.data.message);
      // console.log(response.data.receivedText);
    } catch (error) {
      console.error("Error sending text to server:", error);
    }
  };

  //useEffect(() => {
  //  (async () => {
  //    const { status } = await Camera.requestCameraPermissionsAsync();
  //    setHasPermission(status === "granted");
  //  })();
  //  return () => {
  //    if (intervalRef.current) {
  //      clearInterval(intervalRef.current);
  //    }
  //  };
  // Start taking and sending photos every 2 seconds
  // intervalRef.current = setInterval(sendPhotoToServer, 2000);

  // Cleanup: Stop the interval when the component unmounts
  // return () => clearInterval(intervalRef.current);
  //     return () => {
  //       if (intervalRef.current) {
  //         clearInterval(intervalRef.current);
  //       }
  //     };
  //}, []);


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Type something"
        value={text}
        onChangeText={setText}
      />
      <Button title="Send to Flask" onPress={sendTextToServer} />
      <Text style={styles.responseText}>Received: {responseText}</Text>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name='retweet' size={44} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name='camera' size={44} color='black' />
          </TouchableOpacity> */}
          {/* <TextInput
            style={styles.textInput}
            placeholder="Type something"
            value={text}
            onChangeText={setText}
          /> */}
        </View>
      </CameraView >
      <Button title="Send photo to Flask" onPress={sendPhotoToServer} />
    </View >
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
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
});

