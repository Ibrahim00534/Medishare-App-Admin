import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import EyeIcon from "../../assets/svg/EyeIcon"; // Adjust the path based on your file structure
import logo from "../../assets/logo.png"; // Add your logo image here
import { auth } from "../../firebase/firebaseConfig"; // Correct import
import { onAuthStateChanged } from "../../firebase/firebaseConfig"; // Proper import for modular Firebase SDK
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { signIn } from "../../firebase/auth";
const RiderLoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔒 Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("RiderDashboardScreen"); // replace() so back button won't return here
      }
    });

    return unsubscribe; // cleanup
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Check if email exists in Firestore "donors" collection
      const db = getFirestore();
      const donorsRef = collection(db, "riders");
      const q = query(donorsRef, where("email", "==", username.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setLoading(false);
        Alert.alert("Email Not Registered", "This email does not exist");
        return;
      }

      // Step 2: If email found, proceed to login
      const userCredential = await signIn(username.trim(), password);
      setLoading(false);
      navigation.navigate("RiderDashboardScreen");
    } catch (error) {
      setLoading(false);
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <Image source={logo} style={styles.logo} />

      {/* Form background container */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>RIDER LOGIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <EyeIcon isVisible={isPasswordVisible} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "LOADING..." : "LOGIN"}
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.link, { textDecorationLine: "underline" }]}
          onPress={() => navigation.navigate("RiderForgotPassword")}
        >
          Forgot Password?
        </Text>
      </View>

      {/* Bottom rectangle design */}
      <View style={styles.bottomRectangle}>
        <Text style={styles.pillText}> </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", // To space the content top to bottom
    backgroundColor: "#fff",
  },
  logo: {
    width: 280, // Adjust logo size
    height: 100,
    resizeMode: "contain",
    marginTop: 120, // Adjust spacing from top
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 25,
    backgroundColor: "#09B5B6", // Background color for the form
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff", // Adjust title color to match design
    marginBottom: 30,
    fontSize: 35,
    fontFamily: "Katibeh-Regular",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#001F42",
    paddingVertical: 3,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontSize: 25,
    fontFamily: "Katibeh-Regular",
  },
  link: {
    marginTop: 10,
    color: "#fff",
    fontSize: 27,
    fontFamily: "Katibeh-Regular",
  },
  eyeIcon: {
    padding: 10,
  },
  bottomRectangle: {
    width: "100%",
    height: 80,
    backgroundColor: "#09B5B6", // Adjust this color to match your design
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  pillText: {
    color: "#fff",
    fontSize: 20,
  },
});

export default RiderLoginScreen;
