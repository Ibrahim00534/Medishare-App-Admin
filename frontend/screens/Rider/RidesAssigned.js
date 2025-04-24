

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  Button,
  TextInput, TouchableOpacity
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore"; // Add at top
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Header from "../../components/RIderHeader";
import BottomNav from "../../components/RiderBottomNav";
import CheckBox from '@react-native-community/checkbox';

const RidesAssigned = ({ navigation }) => {
  const [assignedRides, setAssignedRides] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    idCard: "",
    address: "",
    contactInfo: "",
  });
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [outForDelivery, setOutForDelivery] = useState(false);
  const auth = getAuth();
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    orderId: "", // now included
  });

  const [checks, setChecks] = useState({
    prescriptionChecked: false,
    cnicVerified: false,
    allChecksDone: false,
  });



  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  useEffect(() => {
    const fetchAssignedRides = async () => {
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
            const donationRef = query(collection(db, "orders"), where("id", "==", donationId));
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
          setAssignedRides(rides.filter((ride) => ride !== undefined));
        }
      } catch (error) {
        console.error("Error fetching assigned rides:", error);
      }
    };

    fetchAssignedRides();
  }, []);

  const openModal = (ride) => {
    setSelectedRide(ride);
    setModalVisible(true);
    setIsAccepted(false);
    setOutForDelivery(ride.status === "Out for Delivery");
  };

  const handleAccept = () => {
    setIsAccepted(true);
  };

  const handleReject = () => {
    setModalVisible(false);
  };

  const handleDeliveryUpdate = () => {
    if (outForDelivery) {
      selectedRide.status = "Out for Delivery";
    } else {
      selectedRide.status = "Pending";
    }
    setDeliveryModalVisible(true);
  };

  const handleGoForDelivery = () => {
    setLocationModalVisible(true);
  };

  const handleLocationSharing = () => {
    setIsSharingLocation(!isSharingLocation);
    if (!isSharingLocation) {
      alert("Location sharing started.");
    } else {
      alert("Location sharing stopped.");
    }
  };


  const handleDeliverySubmit = async () => {
    if (!selectedRide) return;

    if (!checks.prescriptionChecked || !checks.cnicVerified || !checks.allChecksDone) {
      alert("Please verify all required checks before submitting.");
      return;
    }

    try {
      const donationRef = doc(db, "orders", selectedRide.docId);

      await updateDoc(donationRef, {
        deliveryInfo,
        deliveryStatus: "Delivered",
        deliveredAt: new Date(),
        verificationChecks: checks,
      });

      alert("Delivery information submitted and stored successfully.");

      // Update UI
      setAssignedRides((prevRides) =>
        prevRides.map((ride) =>
          ride.id === selectedRide.id ? { ...ride, status: "Delivered" } : ride
        )
      );

      // Show review modal and store selectedRide ID for review
      setReview((prev) => ({
        ...prev,
        orderId: selectedRide.docId,
      }));

      // Close modals after small delay
      setTimeout(() => {
        setDeliveryModalVisible(false);
        setModalVisible(false);
        setSelectedRide(null);
      }, 100);

      // Reset form states
      setDeliveryInfo({
        name: "",
        idCard: "",
        address: "",
        contactInfo: "",
      });
      setChecks({
        prescriptionChecked: false,
        cnicVerified: false,
        allChecksDone: false,
      });

      setReviewModalVisible(true);

    } catch (error) {
      console.error("Error submitting delivery:", error);
      alert("Error storing delivery info.");
    }
  };




  const renderItem = ({ item }) => (
    <Pressable style={styles.rideCard} onPress={() => openModal(item)}>
      <Text style={[styles.rideText, styles.boldText]}>{item.patientName}</Text>
      <Text style={styles.rideText}>📅 {formatDate(item.orderCreatedAt)}</Text>
      <Text style={styles.rideText}>📍 {item.patientAddress}</Text>
      <Text style={styles.rideText}>Status: {item.status}</Text>
    </Pressable>
  );

  const handleReviewSubmit = async () => {
    try {
      // Step 1: Find the document where field `id == review.orderId`
      const q = query(collection(db, "orders"), where("id", "==", review.orderId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Order not found.");
        return;
      }

      const docRef = querySnapshot.docs[0].ref;

      // Step 2: Update using the actual document reference
      await updateDoc(docRef, {
        riderReview: {
          rating: review.rating,
          comment: review.comment,
        },
      });

      alert("Review submitted successfully.");
      setReviewModalVisible(false);

      // Optional UI update
      setAssignedRides((prevRides) =>
        prevRides.map((ride) =>
          ride.id === review.orderId
            ? { ...ride, riderReview: { rating: review.rating, comment: review.comment } }
            : ride
        )
      );
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review.");
    }
  };



  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.title}>Rides Assigned</Text>
        <FlatList
          data={assignedRides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
        {selectedRide && (
          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ride Details</Text>
                <Text style={styles.modalText}>Medicine: {selectedRide.medicineName}</Text>
                <Text style={styles.modalText}>Quantity: {selectedRide.quantity}</Text>
                <Text style={styles.modalText}>Pick-up Location: {selectedRide.patientAddress}</Text>
                <Text style={styles.modalText}>Patient Name: {selectedRide.patientName}</Text>
                <Text style={styles.modalText}>Patient Contact: {selectedRide.patientMobile}</Text>
                <Text style={styles.modalText}>Donor Name: {selectedRide.donorName}</Text>

                <View style={styles.buttonContainer}>
                  <Button title="Accept" onPress={handleAccept} />
                  <Button title="Reject" onPress={handleReject} />
                </View>

                {isAccepted && (
                  <View style={styles.deliveryOptions}>
                    <Button title="Go For Delivery" onPress={handleGoForDelivery} />
                    <Button title="Confirm Delivery" onPress={handleDeliveryUpdate} />
                  </View>
                )}
              </View>
            </View>
          </Modal>
        )}

        {deliveryModalVisible && (
          <Modal
            transparent={true}
            visible={deliveryModalVisible}
            animationType="slide"
            onRequestClose={() => setDeliveryModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Delivery Information</Text>
                <TextInput
                  placeholder="Received By Name"
                  value={deliveryInfo.name}
                  onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, name: text })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="ID Card Number"
                  value={deliveryInfo.idCard}
                  onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, idCard: text })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Address"
                  value={deliveryInfo.address}
                  onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, address: text })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Contact Info"
                  value={deliveryInfo.contactInfo}
                  onChangeText={(text) => setDeliveryInfo({ ...deliveryInfo, contactInfo: text })}
                  style={styles.input}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      checks.prescriptionChecked && styles.checkboxChecked,
                    ]}
                    onPress={() => setChecks({ ...checks, prescriptionChecked: !checks.prescriptionChecked })}
                  >
                    {checks.prescriptionChecked && <Text style={styles.tickMark}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>Prescription Checked</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      checks.cnicVerified && styles.checkboxChecked,
                    ]}
                    onPress={() => setChecks({ ...checks, cnicVerified: !checks.cnicVerified })}
                  >
                    {checks.cnicVerified && <Text style={styles.tickMark}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>CNIC Verified</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      checks.allChecksDone && styles.checkboxChecked,
                    ]}
                    onPress={() => setChecks({ ...checks, allChecksDone: !checks.allChecksDone })}
                  >
                    {checks.allChecksDone && <Text style={styles.tickMark}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>All Delivery Checks Completed</Text>
                </View>



                <Button title="Submit" onPress={handleDeliverySubmit} />
                <Button title="Cancel" onPress={() => setDeliveryModalVisible(false)} />
              </View>
            </View>
          </Modal>
        )}
        {reviewModalVisible && (
          <Modal
            transparent={true}
            visible={reviewModalVisible}
            animationType="slide"
            onRequestClose={() => setReviewModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Leave a Review</Text>

                <Text style={styles.modalText}>Rating (1-5):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(review.rating)}
                  onChangeText={(text) => {
                    const parsed = parseInt(text);
                    setReview({ ...review, rating: isNaN(parsed) ? 0 : parsed });
                  }}

                />

                <Text style={styles.modalText}>Comment:</Text>
                <TextInput
                  style={styles.input}
                  value={review.comment}
                  onChangeText={(text) => setReview({ ...review, comment: text })}
                />

                <Button title="Submit Review" onPress={handleReviewSubmit} />
                <Button title="Cancel" onPress={() => setReviewModalVisible(false)} />
              </View>
            </View>
          </Modal>
        )}


        {locationModalVisible && (
          <Modal
            transparent={true}
            visible={locationModalVisible}
            animationType="slide"
            onRequestClose={() => setLocationModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Location Sharing</Text>
                <Text style={styles.modalText}>
                  {isSharingLocation ? "Sharing your location. Tap to stop." : "Tap to start sharing your location."}
                </Text>
                <Button
                  title={isSharingLocation ? "Stop Sharing Location" : "Start Sharing Location"}
                  onPress={handleLocationSharing}
                />
                <Button title="Cancel" onPress={() => setLocationModalVisible(false)} />
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
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  deliveryOptions: { marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  list: { marginTop: 10 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  checkboxChecked: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  tickMark: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 16,
  }

});

export default RidesAssigned;