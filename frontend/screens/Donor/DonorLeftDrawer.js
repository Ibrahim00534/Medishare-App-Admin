import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal, Alert } from "react-native";

const LeftDrawer = ({ isVisible, toggleDrawer, navigation }) => {
    const [slideAnim] = useState(new Animated.Value(-Dimensions.get("window").width));

  // Handle drawer visibility
  const handleDrawerVisibility = () => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get("window").width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  React.useEffect(() => {
    handleDrawerVisibility();
  }, [isVisible]);

  // Function to handle navigation and close the drawer
  const handleNavigation = (screen) => {
    toggleDrawer(); // Close the drawer
    navigation.navigate(screen); // Navigate to the desired screen
  };

  // Function to show logout confirmation alert
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            toggleDrawer(); // Close the drawer
            navigation.navigate("Welcome"); // Navigate to Welcome screen or logout flow
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Modal transparent={true} animationType="none" visible={isVisible} onRequestClose={toggleDrawer}>
      <TouchableOpacity style={styles.modalOverlay} onPress={toggleDrawer} />
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.drawerHeader}>Menu</Text>
        <TouchableOpacity style={styles.drawerButton} onPress={() => handleNavigation('DonorDashboardScreen')}>
          <Text style={styles.drawerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerButton} onPress={() => handleNavigation('DonorMyRequestsScreen')}>
          <Text style={styles.drawerButtonText}>Your Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerButton} onPress={() => handleNavigation('DonorDonationsList')}>
          <Text style={styles.drawerButtonText}>Your Donations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerButton} onPress={() => handleNavigation('DonorProfile')}>
          <Text style={styles.drawerButtonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerButton} onPress={handleLogout}>
          <Text style={styles.drawerButtonText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#FFFFFF",
    padding: 20,
    elevation: 10,
  },
  drawerHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  drawerButton: {
    paddingVertical: 10,
  },
  drawerButtonText: {
    fontSize: 16,
    color: "#002855",
  },
});

export default LeftDrawer;
