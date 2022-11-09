import React from "react";
//imporrt requyired react native components
import { Platform, KeyboardAvoidingView, View } from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from './CustomActions';
import MapView from "react-native-maps";
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
const firebase = require("firebase");
require("firebase/firestore");

// creating the chat module
export default class Chat extends React.Component {
  constructor() {
    super();
    // creating the message state
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        avatar: "",
        name: "",
        location: null,
      },
      isConnected: false,
    };

    const firebaseConfig = {
      apiKey: "AIzaSyBVAEagIt7wm_EMo1cLTcAqP7cXbt_Ysm4",
      authDomain: "chatapp-b1174.firebaseapp.com",
      projectId: "chatapp-b1174",
      storageBucket: "chatapp-b1174.appspot.com",
      messagingSenderId: "659309150012",
      appId: "1:659309150012:web:4cab34958266356feb2839",
      measurementId: "G-KFNS1DE272",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceMessages = firebase.firestore().collection("messages");
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  // updating the message state to have default system messages
  componentDidMount() {
    let { name, color } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");
        this.setState({ isConnected: true });
        //Anonymous user authentication
        this.referenceChatMessages = firebase
          .firestore()
          .collection("messages");

        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
            },
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
        this.getMessages();
      } else {
        this.setState({
          isConnected: false,
        });
        console.log("offline");
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if(this.isConnected){
      this.unsubscribe();
      this.authUnsubscribe();
    }
  
  }

  // function updaating the data upon collection update

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  // add custom action button

  renderCustomActions = (props) => <CustomActions {...props} />;

    //custom map view
    renderCustomView(props) {
      const { currentMessage } = props;
      if (currentMessage.location) {
        return (
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }
      return null;
    }

  // adding message to the database

  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  // handle the sent messages
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  // forming ht eactual view
  render() {
    const { color, name } = this.props.route.params;

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          renderActions={this.renderCustomActions}
          onSend={(messages) => this.onSend(messages)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderCustomView={this.renderCustomView}
          user={{
            _id: this.state.uid,
            name: name,
          }}
        />

        {/* ensure the keyboard isnt overlapped on android */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
