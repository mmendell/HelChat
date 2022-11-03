import React from "react";
import { View, Text } from "react-native";

export default class Chat extends React.Component {
  componentDidMount(){
    // name property to display in the head
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

  }


  render() {
    // color property selced acts as background
    let color = this.props.route.params.color;
    return(
      <View
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color,
      }}
      >
        <Text>Chat window</Text>
      </View>
    )
  }
}
