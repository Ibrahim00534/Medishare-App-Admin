import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";  // Correct import

const BottomNav = ({ navigation }) => {
  // Separate navigation functions for each button
  const handleMedicineNavigation = () => {
    navigation.navigate("PatientMedicineList");
  };

  const handleRequestNavigation = () => {
    navigation.navigate("PatientMyRequestsScreen");
  };

  const handleHomeNavigation = () => {
    navigation.navigate("PatientDashboardScreen");
  };

  const handleProfileNavigation = () => {
    navigation.navigate("PatientProfile");
  };

  const handleLogoutNavigation = () => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to logout?",
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
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={handleMedicineNavigation}>
        <Text style={styles.navIcon}>💊</Text>
        <Text style={styles.navLabel}>Medicine</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={handleRequestNavigation}>
        <Text style={styles.navIcon}>📝</Text>
        <Text style={styles.navLabel}>Request</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, styles.homeContainer]} onPress={handleHomeNavigation}>
        <View style={styles.homeIconContainer}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={handleProfileNavigation}>
        <Text style={styles.navIcon}>👤</Text>
        <Text style={styles.navLabel}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, styles.logoutContainer]} onPress={handleLogoutNavigation}>
        <Text style={styles.navIcon}>🔑</Text>
        <Text style={styles.navLabel}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#09B5B6",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 12,
    color: "#001F42",
    marginTop: 2,
  },
  homeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  homeIconContainer: {
    backgroundColor: "#fff",
    borderRadius: 50,
    marginTop: -50,
    elevation: 5,
    padding: 12,
    paddingHorizontal: 20,
    borderColor: "#09B5B6",
    borderWidth: 2,
  },
  logoutContainer: {
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});

export default BottomNav;
