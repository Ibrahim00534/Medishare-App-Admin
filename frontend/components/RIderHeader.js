import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import NotificationScreen from "../screens/Rider/RiderNotificationScreen"; // Adjust path for RiderNotificationScreen
import LeftDrawer from "../screens/Rider/RiderLeftDrawer"; // Adjust path for RiderLeftDrawer
import { db } from "../firebase/firebaseConfig"; // adjust path as needed
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase/firebaseConfig"; // adjust the path

const RiderHeader = ({ navigation }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count
  const [showDrawer, setShowDrawer] = useState(false);
  const auth = getAuth(firebaseApp);
  const riderId = auth.currentUser?.uid;
  useEffect(() => {

    const fetchNotifications = async () => {
      try {
        const q = query(collection(db, "riders"), where("uid", "==", riderId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const riderDoc = querySnapshot.docs[0];
          const data = riderDoc.data();
          const notifs = data.notifications || [];

          const sortedNotifs = notifs.sort(
            (a, b) => b.timestamp?.seconds - a.timestamp?.seconds
          );
          setNotificationCount(sortedNotifs.length);
        } else {
          console.warn("No rider found with this UID:", riderId);
        }
      } catch (error) {
        console.error("Error fetching rider notifications:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchNotifications();
  }, [riderId]);
  // Toggle notification drawer visibility
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      setNotificationCount(0); // Reset notifications when opened
    }
  };

  // Toggle left drawer visibility
  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };
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

      {/* Notification Bell */}
      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={styles.bellContainer}
          onPress={toggleNotifications}
        >
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
      <LeftDrawer
        isVisible={showDrawer}
        toggleDrawer={toggleDrawer}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
    backgroundColor: "#F8F9FA", // Light gray for a clean rider theme
    alignItems: "center",
    marginTop: 5,
  },
  logo: {
    width: 200,
    height: 40,
    marginTop: 5,
  },
  hamburgerIcon: {
    fontSize: 22,
    color: "#09B5B6", // Blue for rider-specific branding
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellContainer: {
    position: "relative",
  },
  bellIcon: {
    fontSize: 22,
    color: "#1E90FF",
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default RiderHeader;
