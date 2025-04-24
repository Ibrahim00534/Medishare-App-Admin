import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Header from "../../components/RIderHeader";
import BottomNav from "../../components/RiderBottomNav";

const RidesCompleted = ({ navigation }) => {
  const [completedRides, setCompletedRides] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const auth = getAuth();

  // Function to format the timestamp (deliveredAt, requestedAt, orderCreatedAt)
  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()} UTC+${date.getHours()}`;
  };

  useEffect(() => {
    const fetchCompletedRides = async () => {
      const riderId = auth.currentUser?.uid;
      try {
        const riderRef = query(
          collection(db, "riders"),
          where("uid", "==", riderId)
        );
        const riderSnap = await getDocs(riderRef);

        if (!riderSnap.empty) {
          const riderData = riderSnap.docs[0].data();
          const assignedDonations = riderData.assignedDonations || [];

          const ridePromises = assignedDonations.map(async (donationId) => {
            const donationRef = query(
              collection(db, "orders"),
              where("id", "==", donationId),
              where("deliveryStatus", "==", "Delivered")
            );
            const donationSnap = await getDocs(donationRef);
            if (!donationSnap.empty) {
              const docData = donationSnap.docs[0].data();
              return {
                ...docData,
                docId: donationSnap.docs[0].id,
              };
            }
          });

          const rides = await Promise.all(ridePromises);
          setCompletedRides(rides.filter((ride) => ride !== undefined));
        }
      } catch (error) {
        console.error("Error fetching completed rides:", error);
      }
    };

    fetchCompletedRides();
  }, []);

  const openModal = (ride) => {
    setSelectedRide(ride);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRide(null);
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.rideCard} onPress={() => openModal(item)}>
      <Text style={[styles.rideText, styles.boldText]}>{item.patientName}</Text>
      <Text style={styles.rideText}>📅 {formatDate(item.orderCreatedAt)}</Text>
      <Text style={styles.rideText}>📍 {item.patientAddress}</Text>
      <Text style={styles.rideText}>Status: {item.status}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.title}>Rides Completed</Text>
        <FlatList
          data={completedRides}
          renderItem={renderItem}
          keyExtractor={(item) => item.docId}
          ListEmptyComponent={<Text>No completed rides found.</Text>}
        />
        {selectedRide && (
          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ride Details</Text>
                
                {/* General Information */}
                <Text style={styles.modalText}>Medicine: {selectedRide.medicineName}</Text>
                <Text style={styles.modalText}>Quantity: {selectedRide.quantity}</Text>
                <Text style={styles.modalText}>Delivery Method: {selectedRide.deliveryMethod}</Text>
                <Text style={styles.modalText}>Delivery Status: {selectedRide.deliveryStatus}</Text>
                <Text style={styles.modalText}>Patient Name: {selectedRide.patientName}</Text>
                <Text style={styles.modalText}>Patient Contact: {selectedRide.patientMobile}</Text>
                <Text style={styles.modalText}>Patient Address: {selectedRide.patientAddress}</Text>
                <Text style={styles.modalText}>Requested By: {selectedRide.requestedBy}</Text>
                
                {/* Delivery Info */}
                <Text style={styles.modalTitle}>Delivery Info</Text>
                <Text style={styles.modalText}>Address: {selectedRide.deliveryInfo?.address}</Text>
                <Text style={styles.modalText}>Contact Info: {selectedRide.deliveryInfo?.contactInfo}</Text>
                <Text style={styles.modalText}>ID Card: {selectedRide.deliveryInfo?.idCard}</Text>
                <Text style={styles.modalText}>Name: {selectedRide.deliveryInfo?.name}</Text>
                <Text style={styles.modalText}>Donor Name: {selectedRide.donorName}</Text>

                {/* Timestamps */}
                <Text style={styles.modalTitle}>Timestamps</Text>
                <Text style={styles.modalText}>
                  Order Created At: {formatDate(selectedRide.orderCreatedAt)}
                </Text>
                <Text style={styles.modalText}>
                  Delivered At: {formatDate(selectedRide.deliveredAt)}
                </Text>
                <Text style={styles.modalText}>
                  Requested At: {formatDate(selectedRide.requestedAt)}
                </Text>

                {/* Review Section */}
                <Text style={styles.modalTitle}>Rider Review</Text>
                {selectedRide.riderReview ? (
                  <>
                    <Text style={styles.modalText}>
                      Rating: {selectedRide.riderReview.rating} ⭐
                    </Text>
                    <Text style={styles.modalText}>
                      Comment: {selectedRide.riderReview.comment}
                    </Text>
                  </>
                ) : (
                  <Text>No review available.</Text>
                )}

                {/* Verification Checks */}
                <Text style={styles.modalTitle}>Verification Checks</Text>
                <Text style={styles.modalText}>
                  CNIC Verified: {selectedRide.verificationChecks?.cnicVerified ? "Yes" : "No"}
                </Text>
                <Text style={styles.modalText}>
                  Prescription Checked: {selectedRide.verificationChecks?.prescriptionChecked ? "Yes" : "No"}
                </Text>
                <Text style={styles.modalText}>
                  All Checks Done: {selectedRide.verificationChecks?.allChecksDone ? "Yes" : "No"}
                </Text>

                <Button title="Close" onPress={handleCloseModal} />
              </View>
            </View>
          </Modal>
        )}
      </View>
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  rideCard: { backgroundColor: "#f0f0f0", padding: 12, marginBottom: 10, borderRadius: 10 },
  rideText: { fontSize: 16 },
  boldText: { fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 5 },
});

export default RidesCompleted;
