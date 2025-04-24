import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import EyeIcon from '../../assets/svg/EyeIcon';
import logo from '../../assets/logo.png';
import { createUserWithEmailAndPassword, auth, db, setDoc, doc } from "../../firebase/firebaseConfig";


const DonorSignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const handleSignup = async () => {
    if (fullName === '' || username === '' || password === '' || confirmPassword === '') {
      Alert.alert('Validation Error', 'All fields are required');
    } else if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
    } else {
      try {
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;
      
            await setDoc(doc(db, "donors", user.uid), {
              fullName,
              username,
              email: username,
              userType: "donor"
            });
      
            navigation.navigate('DonorAdditionalInfo', { userId: user.uid });
          } catch (error) {
            Alert.alert("Signup Failed", error.message);
          }
    }
  };
  
  

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <View
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>DONOR SIGNUP</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <EyeIcon isVisible={isPasswordVisible} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
          >
            <EyeIcon isVisible={isConfirmPasswordVisible} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('DonorLogin')}
        >
          Already a User? <Text style={styles.linkUnderline}>Login Here</Text>
        </Text>
      </ScrollView>
      {!isKeyboardVisible && (
        <View style={styles.bottomRectangle}>
          <Text style={styles.pillText}> </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    color: '#005A5A',
    marginBottom: 30,
    fontSize: 35,
    fontFamily: 'Katibeh-Regular',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderColor: '#005A5A',
    backgroundColor: '#f8f8f8',
    fontSize: 16,
  },
  passwordContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#005A5A',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: '#001F42',
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 23,
    fontFamily: 'Katibeh-Regular',
  },
  link: {
    fontSize: 16,
    color: '#003E3B',
    marginTop: 10,
    fontSize: 27,
    fontFamily: 'Katibeh-Regular',
  },
  linkUnderline: {
    textDecorationLine: 'underline',
  },
  bottomRectangle: {
    width: '100%',
    height: 80,
    backgroundColor: '#09B5B6',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default DonorSignupScreen;
