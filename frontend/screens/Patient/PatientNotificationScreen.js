import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase/firebaseConfig"; // adjust the path

const PatientNotificationScreen = ({ onClose }) => {
  const [slideAnim] = useState(new Animated.Value(Dimensions.get("window").width));
  const [notifications, setNotifications] = useState([]);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

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

          setNotifications(sorted);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.seconds) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
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

        <Text style={styles.header}>Notifications</Text>

        {notifications.length === 0 ? (
          <Text style={{ color: "#ccc" }}>No notifications yet.</Text>
        ) : (
          notifications.map((notification, index) => (
            <View key={index} style={styles.notification}>
              <Text style={styles.title}>Medicine: {notification.medicineName}</Text>
              <Text style={styles.details}>

                <Text >
                  {notification.message}
                </Text>.
              </Text>
              <Text style={styles.time}>{formatTime(notification.time)}</Text>
            </View>
          ))
        )}

      </Animated.View>
    </Modal>
  );
};

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
    fontSize: 20,
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
    color: "red",
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

export default PatientNotificationScreen;
