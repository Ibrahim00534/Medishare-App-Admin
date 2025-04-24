import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import HeartbeatIcon from "../assets/svg/HeartbeatIcon";

SplashScreen.preventAutoHideAsync();

const WelcomeScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0); // State for managing quote index

  // Array of quotes
  const quotes = [
    "Your small act of kindness can be the biggest hope for someone's healing.",
    "Donate your unused medicines, save a life today.",
    "Helping one person might not change the world, but it could change the world for one person.",
    "The best of people are those who bring most benefit to others. — Prophet Muhammad (PBUH)",
    "Whoever saves a life, it will be as if they saved all of humanity. — Quran 5:32" 
  ];

  // Function to load fonts
  const loadFonts = async () => {
    await Font.loadAsync({
      "Katibeh-Regular": require("../assets/fonts/Katibeh-Regular.ttf"),
      "IndieFlower-Regular": require("../assets/fonts/IndieFlower-Regular.ttf"),
    });
    setFontsLoaded(true);
    SplashScreen.hideAsync();
  };

  // UseEffect to load fonts when the component mounts
  useEffect(() => {
    loadFonts();
  }, []);

  // UseEffect to change quotes every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000); // Change quote every 2 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Main_Logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>
        Your donated medicines {"\n"} can save lives!
      </Text>

      {/* Button for Patient */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PatientLogin")}
      >
        <Text style={styles.buttonLogo}>👩‍⚕️</Text>
        <Text style={styles.buttonText}>PATIENT</Text>
      </TouchableOpacity>

      {/* Button for Donor */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DonorLogin")}
      >
        <Text style={styles.buttonLogo}>💊</Text>
        <Text style={styles.buttonText}>DONOR</Text>
      </TouchableOpacity>

      {/* Button for Rider */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RiderLoginScreen")}
      >
        <Text style={styles.buttonLogo}>🚴‍♂️</Text>
        <Text style={styles.buttonText}>RIDER</Text>
      </TouchableOpacity>

      {/* Bottom rectangle with animated quotes */}
      <View style={styles.bottomRectangle}>
        <HeartbeatIcon style={styles.HeartbeatIcon} width={10} height={10} />
        <Text style={styles.quoteText}>{quotes[quoteIndex]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    marginTop: -50,
    width: 300,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 35,
    marginBottom: 40,
    textAlign: "center",
    color: "#000000",
    fontFamily: "Katibeh-Regular",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#09B5B6",
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Katibeh-Regular",
    marginLeft: 20,
  },
  buttonLogo: {
    fontSize: 28, 
  },
  bottomRectangle: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
    backgroundColor: "#09B5B6",
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  quoteText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 5,
    fontFamily: "Verdana",
  },
});

export default WelcomeScreen;
