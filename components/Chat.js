import { query, QuerySnapshot } from "firebase/firestore";
import React from "react";
//imporrt requyired react native components
import { Platform, KeyboardAvoidingView, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

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
        _id: '',
        avatar: '',
        name: '',
      },
    };

    if(!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBVAEagIt7wm_EMo1cLTcAqP7cXbt_Ysm4",
        authDomain: "chatapp-b1174.firebaseapp.com",
        projectId: "chatapp-b1174",
        storageBucket: "chatapp-b1174.appspot.com",
        messagingSenderId: "659309150012",
        appId: "1:659309150012:web:4cab34958266356feb2839",
        measurementId: "G-KFNS1DE272",
      });
    }
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  // updating the message state to have default system messages
  componentDidMount() {
  //  setting message stae 
  this.setState({
    messages: [
      {
        _id: 2,
        text: `${name} has entered chat `,
        createdAt: new Date(),
        system: true,
      },
    ],
  });

  this.props.navigation.setOptions({ title: name });

  this.referenceMessages = firebase.firestore().collection('messages');
  

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
    this.unsubscribe = this.referenceMessages
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.onCollectionUpdate);
  });
}

componentWillUnmount() {
  this.unsubscribe();
  this.authUnsubscribe();
}


  // function updaating the data upon collection update

  onCollectionUpDate = (querySnapshot) => {
    const messages = [];
    // go through all documents
    querySnapshot.forEach((doc) => {
      // get the snapshots dta
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || '',
        },
      });
    });
    this.setState({
      messages,
    });
  };

  // adding message to the database

  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
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
      }
    );
  }

  // forming ht eactual view
  render() {
    // have the name sentered by user display ion top
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    let color = this.props.route.params.color;

    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
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
