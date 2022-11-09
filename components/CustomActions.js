import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import PropTypes from "prop-types";
import { connectActionSheet } from '@expo/react-native-action-sheet';


import { getStorage, ref, uploadBytes, getDownloadUrl } from "firebase/storage";

import firebase from 'firebase';
import 'firebase/firestore';
class CustomAction extends React.Component {
  state = {
    image: null,
    location: null,
  };
  uploadImage = async (uri) => {
    // create XMLHttpRequest and set its responseType to 'blob'.
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      //open the connection and get the URI’s data (the image)
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    //reference to the image in which you put the blob data:
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    //store the content retrieved from the Ajax request:
    const snapshot = await ref.put(blob);
    // close connection:
    blob.close();
    //get image URL from storage:
    return await snapshot.ref.getDownloadURL();
  };


  // func for image selection from camera roll

  pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
      if (status === 'granted') {
        // pick image
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        }).catch((error) => console.log(error));
        // canceled process
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // func to take images
  takeImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    try {
      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // func for getting user location

  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    try {
      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({}).catch(
          (error) => console.log(error)
        );

        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  onActionPress = () => {
    const options = [
      "Choose from library",
      "Take picture",
      "Send location",
      "Cancel",
    ];
    const cancelButtIndex = options.length - 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user is picking image");
            return this.pickImage();
          case 1:
            console.log("user taking photo");
            return this.takeImage();
          case 2:
            console.log("user sharing location");
            return this.getLocation();
        }
      }
    );
  };

  render(){
    return(
      <TouchableOpacity
      accessible={true}
      accessibilityLabel='more message options'
      style={[styles.container]}
      onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>     
           </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomAction.contextType = {
  actionSheet: PropTypes.func,
};

CustomAction.defaultProps = {
  onSend: () => {},
  options: {},
  renderIcon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

const CustomActions = connectActionSheet(CustomAction);

export default CustomActions;
