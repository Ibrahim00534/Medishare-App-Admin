// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   Modal,
// } from "react-native";

// import { collection, query, where, getDocs } from "firebase/firestore";

// const fetchNotifications = async () => {
//   try {
//     const q = query(collection(db, "riders"), where("uid", "==", riderId));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       const riderDoc = querySnapshot.docs[0];
//       const data = riderDoc.data();
//       const notifs = data.notifications || [];

//       const sortedNotifs = notifs.sort(
//         (a, b) => b.timestamp?.seconds - a.timestamp?.seconds
//       );
//       setNotifications(sortedNotifs);
//     } else {
//       console.warn("No rider found with this UID:", riderId);
//     }
//   } catch (error) {
//     console.error("Error fetching rider notifications:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// const RiderNotificationScreen = ({ onClose }) => {
//   const [slideAnim] = useState(new Animated.Value(Dimensions.get("window").width));

//   useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const handleClose = () => {
//     Animated.timing(slideAnim, {
//       toValue: Dimensions.get("window").width,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       onClose();
//     });
//   };

//   return (
//     <Modal animationType="slide" transparent={true} visible={true}>
//       <Animated.View
//         style={[
//           styles.notificationContainer,
//           { transform: [{ translateX: slideAnim }] },
//         ]}
//       >
//         <TouchableOpacity style={styles.backButton} onPress={handleClose}>
//           <Text style={{ color: "white" }}>Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.header}>Rider Notifications</Text>

//         {riderNotifications.map((notification) => (
//           <View key={notification.id} style={styles.notification}>
//             <Text style={styles.title}>{notification.title}</Text>
//             <Text style={styles.details}>{notification.details}</Text>
//             <Text style={styles.time}>{notification.time}</Text>
//           </View>
//         ))}
//       </Animated.View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   notificationContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.95)",
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//     elevation: 20,
//     zIndex: 1000,
//   },
//   backButton: {
//     alignSelf: "flex-end",
//     padding: 10,
//     backgroundColor: "#1E90FF", // Blue button for rider theme
//     borderRadius: 5,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#FFF",
//     marginBottom: 20,
//   },
//   notification: {
//     backgroundColor: "#FFF",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#1E90FF", // Blue for rider notification title
//   },
//   details: {
//     fontSize: 14,
//     color: "#333",
//   },
//   time: {
//     fontSize: 12,
//     color: "#777",
//     textAlign: "right",
//     marginTop: 5,
//   },
// });

// export default RiderNotificationScreen;



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
import { db } from "../../firebase/firebaseConfig"; // adjust path as needed
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase/firebaseConfig"; // adjust the path
// adjust the path as needed
import { useNavigation } from "@react-navigation/native";
const RiderNotificationScreen = ({ onClose }) => {
  const [slideAnim] = useState(new Animated.Value(Dimensions.get("window").width));
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(firebaseApp);
  const riderId = auth.currentUser?.uid;
  const router = useNavigation();
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
          setNotifications(sortedNotifs);
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

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
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
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleString(); // or customize format
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

        <Text style={styles.header}>Rider Notifications</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <View key={index} style={styles.notification}>
              <TouchableOpacity
                onPress={() => {

                  onClose(); // close modal first
                  router.push("RidesAssigned");
                }}
                style={styles.notification}
              >
                <Text style={styles.title}>
                  {notification.type === "assignment"
                    ? "New Ride Assigned"
                    : notification.type === "unassignment"
                      ? "Ride Unassigned"
                      : "Notification"}
                </Text>
                <Text style={styles.details}>Check your assigned rides.</Text>
                <Text style={styles.time}>{formatTime(notification.timestamp)}</Text>
              </TouchableOpacity>

            </View>
          ))
        ) : (
          <Text style={{ color: "white" }}>No notifications found.</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    paddingHorizontal: 20,
    paddingVertical: 40,
    elevation: 20,
    zIndex: 1000,
  },
  backButton: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "#1E90FF",
    borderRadius: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  notification: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E90FF",
    textTransform: "capitalize",
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

export default RiderNotificationScreen;
