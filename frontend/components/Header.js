import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  Image, slideAnim
} from "react-native"; import NotificationScreen from "../screens/Patient/PatientNotificationScreen"; // Import the NotificationScreen
import LeftDrawer from "../screens/Patient/PatientLeftDrawer"; // Import the LeftDrawer component
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase/firebaseConfig"; // adjust the path

const Header = ({ navigation }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [slideAnim] = useState(new Animated.Value(Dimensions.get("window").width));
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  // Toggle notification drawer visibility
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // If notifications are opened, reset count to 0
    if (showNotifications) {
      setNotificationCount(0);
    }
  };

  // Toggle left drawer visibility
  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };
  useEffect(() => {
    // slide animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    // fetch notifications
    const fetchNotifications = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const patientRef = doc(db, "patients", uid);
        const patientSnap = await getDoc(patientRef);

        if (patientSnap.exists()) {
          const data = patientSnap.data();
          const notifs = data.notifications || [];

          // sort by time (latest first)
          const sorted = notifs
            .slice()
            .sort((a, b) => b.time?.seconds - a.time?.seconds);

          setNotificationCount(sorted.length); // Set the notification count
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Text style={styles.hamburgerIcon}>☰</Text>
      </TouchableOpacity>

      <Image
        source={require("../assets/logo.png")} // Adjust the path as necessary
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.bellContainer} onPress={toggleNotifications}>
          <Text style={styles.bellIcon}>🔔</Text>
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notification Drawer */}
      {showNotifications && (
        <NotificationScreen onClose={() => setShowNotifications(false)} />
      )}

      {/* Left Drawer */}
      <LeftDrawer isVisible={showDrawer} toggleDrawer={toggleDrawer} navigation={navigation} />

    </View>

  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    marginTop: 5,
  },
  logo: {
    width: 250,
    height: 50,
    marginTop: 10,
  },
  hamburgerIcon: {
    fontSize: 22,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIcon: {
    fontSize: 22,
    marginRight: 5, // Space between bell and profile icon
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

});

export default Header;
