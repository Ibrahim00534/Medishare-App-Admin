import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet , Alert} from 'react-native';
import Header from '../../components/DonorHeader'; // Adjust the path if needed
import BottomNav from '../../components/DonorBottomNav'; // Adjust the path if needed
import { getAuth, signOut } from "firebase/auth";  // Correct import

const DonorRequestMedicineScreen = ({ navigation }) => {

   const handleLogoutNavigation = () => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to logout as donor to login as patient?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: () => {
              // Log out from Firebase
              handleLogout();
            },
          },
        ],
        { cancelable: false }
      );
    };
  
    const handleLogout = () => {
      const auth = getAuth();  // Initialize auth from Firebase
  
      signOut(auth)  // Call signOut correctly
        .then(() => {
          // After signing out, navigate to the login screen
          navigation.replace("Welcome");
        })
        .catch((error) => {
          Alert.alert("Logout Error", error.message);
        });
    };
  return (
    <View style={styles.container}>
      {/* Add Header Component */}
      <Header navigation={navigation} />

      <View style={styles.content}>
        <Text style={styles.messageText}>
          To request a medicine, please log in as a patient.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogoutNavigation}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>

      {/* Add BottomNav Component */}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#09B5B6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DonorRequestMedicineScreen;
