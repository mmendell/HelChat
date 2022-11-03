import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// background color that user can select from

const backgroundColors = {
  black: "#090C08",
  purple: "#474056",
  grey: "#8A95A5",
  green: "#B9C6AE",
};

//  this class will be the start screen that  each user will be greeted with upon entry
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "" };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/Background.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <Text style={styles.title}>Chat APP</Text>

          <View style={styles.pageWrap}>
            <TextInput
              style={styles.textInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="enter your name here"
            />

            <View style={styles.colorWrapper}>
              <Text style={styles.colorText}>
                Select your preffered background color
              </Text>
              <View style={styles.colors}>
                {/* set the bg to black */}
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.black },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.black })
                  }
                />

                {/* set tjhe bg to purp;e */}
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.purple },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.purple })
                  }
                />

                {/* set the bg to grey */}
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.grey },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.grey })
                  }
                />
                {/* set the bg to green */}
                <TouchableOpacity
                  style={[
                    styles.color,
                    { backgroundColor: backgroundColors.green },
                  ]}
                  onPress={() =>
                    this.setState({ color: backgroundColors.green })
                  }
                />
              </View>
            </View>
            <Text>You wrote: {this.state.name}</Text>
            <TouchableOpacity
              style={styles.navButt}
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    fontSize: 16,
    fontWeight: "300",
    opacity: 0.5,
    color: "#757083",
  },
  navButt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#757083",
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  pageWrap: {
    backgroundColor: "White",
    height: "44%",
    width: "88%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: "6%",
  },
  colorWrapper: {
    width: "88%",
    justifyContent: "center",
  },
  colors: {
    flexDirection: "row",
  },
  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 10,
    marginRight: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: '15%',
    alignItems: 'center'
  },

});
