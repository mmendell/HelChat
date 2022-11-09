__Chat__

__Description__

A mobile app abuilt on react native, allowing users to chat send messages, including images and their location.

__How to Run__

thius project was built with react native, and expo therefore it should run well both on android and ios. due to technical limitations though it was only tested so far on android.

to run:
 1. clone the git repository: gh repo clone mmendell/HelChat

 2. install the npm package for expo cli globally: npm install --global expo-cli

 3. start it either with npm start or expo start

 4. the cli will provide instructions on how to emualte/simulate the desired devices

 __Projet Dependencies__

  "@babel/plugin-proposal-export-namespace-from": "^7.18.9",

    "@react-native-community/masked-view": "^0.1.11",

    "@react-navigation/native": "^6.0.13",

    "@react-navigation/stack": "^6.3.3",
    
    "expo": "~46.0.16",
    
    "expo-status-bar": "~1.4.0",
    
    "react": "18.0.0",
    
    "react-native": "0.69.6",
    
    "react-native-gesture-handler": "~2.5.0",
    
    "react-native-gifted-chat": "^1.0.4",
    
    "react-native-reanimated": "~2.9.1",
    
    "react-native-safe-area-context": "4.3.1",
    
    "react-native-screens": "~3.15.0",
    
    "react-navigation": "^4.4.4",
    
    "firebase": "8.2.3",
    
    "@react-native-async-storage/async-storage": "~1.17.3",
    
    "@react-native-community/netinfo": "9.3.0",
    
    "expo-permissions": "~13.2.0",
    
    "expo-image-picker": "~13.3.1",
    
    "expo-location": "~14.3.0",
    
    "react-native-maps": "0.31.1"

__Technical points__

* project written in react native
* the app was developed with expo
* data is stored with google firebase
* users are authenticated with firebase auth
* conversations are stored locally with async storage
* users are able to pic and send images from the phone gallery or take new photos
* users can share location data with other users in the app
* chat interface is supplied from gifted chat library