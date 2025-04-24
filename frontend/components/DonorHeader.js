import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import NotificationScreen from "../screens/Donor/DonorNotificationScreen"; // Import the NotificationScreen
import DonorLeftDrawer from "../screens/Donor/DonorLeftDrawer"; // Import the LeftDrawer component
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Adjust path accordingly

const DonorHeader = ({ navigation }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [userId, setUserId] = useState(null);
  const [slideAnim] = useState(new Animated.Value(Dimensions.get("window").width));
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's ID
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid); // Set the user ID
    }
  }, []);

  // Fetch notifications from donor document
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching donor with ID:", userId);
        const donorRef = doc(db, "donors", userId);
        const donorSnap = await getDoc(donorRef);

        if (donorSnap.exists()) {
          const data = donorSnap.data();
          console.log("Donor data:", data);

          const rawNotifications = data.notifications || [];
          console.log("Raw notifications:", rawNotifications);

          const generated = rawNotifications
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((n, index) => {
              const desc = (n.message || "").toLowerCase();

              let title = "Notification";
              if (desc.includes("thank")) title = "Thank You!";
              else if (desc.includes("request")) title = "Donation Request";
              else if (desc.includes("not approved")) title = "Pending Approval";
              else if (desc.includes("rejected")) title = "Donation Rejected";
              else if (desc.includes("updated")) title = "Status Update";
              else if (desc.includes("successful") || desc.includes("received"))
                title = "Donation Successful";
              else if (desc.includes("urgent")) title = "Urgent Request";

              return {
                id: index + 1,
                title,
                details: n.message || "No message",
                time: n.timestamp
                  ? new Date(n.timestamp).toLocaleString()
                  : "N/A",
              };
            });

          console.log("Parsed notifications:", generated);
          setNotificationCount(generated.length);
        } else {
          console.warn("No such donor found!");
        }
      } catch (error) {
        console.error("Error fetching donor notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);
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
      {showNotifications && userId && (
        <NotificationScreen donorId={userId} onClose={() => setShowNotifications(false)} setNotificationCount={setNotificationCount} />
      )}

      {/* Left Drawer */}
      <DonorLeftDrawer isVisible={showDrawer} toggleDrawer={toggleDrawer} navigation={navigation} />
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

export default DonorHeader;
