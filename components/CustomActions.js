import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import PropTypes from "prop-types";
import { connectActionSheet } from '@expo/react-native-action-sheet';


import { getStorage, ref, uploadBytes, getDownloadUrl } from "firebase/storage";

class CustomAction extends React.Component {
  state = {
    image: null,
    location: null,
  };
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(error);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    // storage reference for images
    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    const storage = getStorage();
    const storageRef = ref(storage, `images/${imageName}`);
    await uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("uploaded has been successful!");
    });
    const downloadUrl = await getDownloadUrl(storageRef);
    return downloadUrl;
  };

  // func for image selection from camera roll

  pickImage = async () => {
    const status = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  };

  // func to take images
  takeImage = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.MEDIA_LIBRARY,
      Permissions.CAMERA
    );

    if ((status = "granted")) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: "all",
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  };

  // func for getting user location

  getLocation = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION_FOREGROUND
    );

    if (status === "granted") {
      let result = await Location.getCurrentPositionAsync({});
      if (result) {
        this.props.onSend({
          location: {
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
          },
        });
      }
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
