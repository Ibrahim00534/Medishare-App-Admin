import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import * as Font from "expo-font";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase/firebaseConfig"; // Adjust the path if needed

const PatientMyRequestsScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelRequestIndex, setCancelRequestIndex] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "IndieFlower-Regular": require("../../assets/fonts/IndieFlower-Regular.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "PatientRequests"),
        where("requestedBy", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Error fetching requests: ", error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return styles.pending;
      case "Approved":
        return styles.approved;
      case "Success":
        return styles.success;
      default:
        return {};
    }
  };

  const cancelRequest = (index) => {
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel the request for this medicine?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setCancelRequestIndex(index);
            setShowCancelModal(true);
          },
        },
      ]
    );
  };

  const handleConfirmCancel = async () => {
    if (cancelRequestIndex !== null) {
      const requestToDelete = requests[cancelRequestIndex];
      try {
        await deleteDoc(doc(db, "PatientRequests", requestToDelete.id));
        const updatedRequests = [...requests];
        updatedRequests.splice(cancelRequestIndex, 1);
        setRequests(updatedRequests);
      } catch (error) {
        console.error("Error deleting request:", error);
        Alert.alert("Error", "Failed to cancel the request. Please try again.");
      }
      setCancelRequestIndex(null);
      setReason("");
      setShowCancelModal(false);
    }
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <View style={styles.content}>
        <ScrollView>
          {requests.map((request, index) => (
            <View key={request.id} style={styles.requestCard}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => cancelRequest(index)}
              >
                <Text style={styles.cancelText}>X</Text>
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.requestName}>Name: {request.medicineName}</Text>
                <Text
                  style={[styles.requestStatus, getStatusStyle(request.status)]}
                >
                  Status: {request.status}
                </Text>
                <Text>Donor: {request.donorName}</Text>
                <Text>{request.date}</Text>
                <TouchableOpacity onPress={() => viewDetails(request)}>
                  <Text style={styles.detailsLink}>View Details</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{ uri: request.image }}
                style={styles.medicineImage}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <BottomNav navigation={navigation} />

      {/* Cancel Request Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCancelModal}
        onRequestClose={() => {
          setShowCancelModal(false);
          setReason("");
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Request</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Please provide a reason"
              value={reason}
              onChangeText={setReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleConfirmCancel}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowCancelModal(false);
                  setReason("");
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Medicine Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetailsModal}
        onRequestClose={() => {
          setShowDetailsModal(false);
          setSelectedRequest(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Medicine Details</Text>
            {selectedRequest ? (
              <>
                <Text style={styles.requestName}>Medicine: {selectedRequest.medicineName}</Text>
                <Text>Quantity: {selectedRequest.quantity}</Text>
                <Text>Priority: {selectedRequest.priority}</Text>
                <Text>Delivery Method: {selectedRequest.deliveryMethod}</Text>
                <Text>Status: {selectedRequest.status}</Text>

                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Patient Info:</Text>
                <Text>Name: {selectedRequest.patientName}</Text>
                <Text>Email: {selectedRequest.patientEmail}</Text>
                <Text>Mobile: {selectedRequest.patientMobile}</Text>
                <Text>Address: {selectedRequest.patientAddress}</Text>

                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Donor Info:</Text>
                <Text>Donor: {selectedRequest.donorName}</Text>

                <Text style={{ marginTop: 10 }}>Requested At: {new Date(selectedRequest.requestedAt?.seconds * 1000).toLocaleString()}</Text>
              </>
            ) : (
              <Text>Loading...</Text>
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowDetailsModal(false);
                setSelectedRequest(null);
              }}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  requestCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#e0f7fa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff4d4d",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  requestStatus: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 14,
  },
  pending: {
    color: "#ff9800",
  },
  approved: {
    color: "#4caf50",
  },
  success: {
    color: "#2196f3",
  },
  medicineImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  detailsLink: {
    color: "#007bff",
    marginTop: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  detailsText: {
    marginTop: 10,
    fontSize: 14,
  },
});

export default PatientMyRequestsScreen;
