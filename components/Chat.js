import React from "react";
//imporrt requyired react native components
import {  Platform, KeyboardAvoidingView, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";


// creating the chat module
export default class Chat extends React.Component {
  constructor() {
    super();
    // creating the message state
    this.state = {
      messages: [],
    };
  }

  // updating the message state to have default system messages
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
         },
      ],
    });
  }


  // handle the sent messages
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }


// forming ht eactual view
  render() {
    // have the name sentered by user display ion top
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name});
    let color = this.props.route.params.color;

    return (
    <View style={{flex:1}}>
       <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />

        {/* ensure the keyboard isnt overlapped on android */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height"/>
        ) : null}
    </View>
       

  
    );
  }
}
