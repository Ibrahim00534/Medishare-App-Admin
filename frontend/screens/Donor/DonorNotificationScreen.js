import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Adjust path accordingly

const DonorNotificationScreen = ({ donorId, onClose }) => {
  const [slideAnim] = useState(new Animated.Value(Dimensions.get("window").width));
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animate in on mount
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Fetch notifications from donor document
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching donor with ID:", donorId);
        const donorRef = doc(db, "donors", donorId);
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
          setNotifications(generated);
        } else {
          console.warn("No such donor found!");
        }
      } catch (error) {
        console.error("Error fetching donor notifications:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (donorId) fetchNotifications();
  }, [donorId]);
  


  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <Animated.View
        style={[
          styles.notificationContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Text style={{ color: "white" }}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Donor Notifications</Text>

        {loading ? (
          <ActivityIndicator color="#fff" size="large" style={{ marginTop: 20 }} />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <View key={notification.id} style={styles.notification}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.details}>{notification.details}</Text>
              <Text style={styles.time}>{notification.time}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
            No notifications found.
          </Text>
        )}
      </Animated.View>
    </Modal>
  );
};
// Styles for the notification screen
const styles = StyleSheet.create({
  notificationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 40,
    elevation: 20,
    zIndex: 1000,
  },
  backButton: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  notification: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d9534f",
  },
  details: {
    fontSize: 14,
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
    marginTop: 5,
  },
});

export default DonorNotificationScreen;
