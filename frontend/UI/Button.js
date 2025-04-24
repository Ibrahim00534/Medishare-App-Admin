import React from "react";
import { Pressable, Text } from "react-native";
import btnStyle from "./ButtonStyle";

const Button = (props) => {
  return (
    <Pressable onPress={props.onPress} style={btnStyle.btn}>
      <Text style={{ color: "#FFFFFF", fontSize: 16 }}>{props.children}</Text>
    </Pressable>
  );
};

export default Button;

