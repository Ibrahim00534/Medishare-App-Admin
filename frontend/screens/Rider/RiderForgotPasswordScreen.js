import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import EyeIcon from '../../assets/svg/EyeIcon'; // Adjust the path based on your file structure
import logo from '../../assets/logo.png'; // Add your logo image here

const RiderForgotPasswordScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetLinkSent, setResetLinkSent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is open
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is closed
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleResetPassword = () => {
    if (username === '') {
      alert('Username is required');
    } else {
      alert('Password reset link sent to your email!');
      setResetLinkSent(true);
    }
  };

  const handleSetPassword = () => {
    if (newPassword === '') {
      alert('Please enter your new password');
    } else {
      alert('Password successfully reset!');
      navigation.navigate('PatientLogin');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={80} // Adjust offset as needed
    >
      {/* Logo */}
      <Image source={logo} style={styles.logo} />

      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Username"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>RESET PASSWORD</Text>
        </TouchableOpacity>

        {/* Only show the "New Password" input after reset link is sent */}
        {isResetLinkSent && (
          <>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter New Password"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword((prev) => !prev)}
              >
                <EyeIcon isVisible={showNewPassword} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSetPassword}>
              <Text style={styles.buttonText}>SET PASSWORD</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Bottom Sign-up section */}
        <Text style={styles.footerText}>
          Login with Password..{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('RiderLoginScreen')}
          >
            Click Here
          </Text>
        </Text>
      </View>

      {/* Conditionally render the bottom rectangle only when the keyboard is not visible */}
      {!isKeyboardVisible && (
        <View style={styles.bottomRectangle}>
          <Text style={styles.pillText}> </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  logo: {
    width: 280,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 120,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 25,
    backgroundColor: '#09B5B6', // Matching form background color
    alignItems: 'center',
    marginTop: -80,
  },
  title: {
    fontSize: 35,
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Katibeh-Regular', // Using the same font
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff', // White background for input
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#001F42', // Matching button color
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Katibeh-Regular', // Using the same font
  },
  footerText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Katibeh-Regular', // Using the same font
  },
  link: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  eyeIcon: {
    padding: 10,
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

export default RiderForgotPasswordScreen;
