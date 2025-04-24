import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert, Modal, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Ensure this points to your Firebase config
import Header from "../../components/DonorHeader";
import BottomNav from "../../components/DonorBottomNav";

const DonorDonationDetails = ({ navigation }) => {
  const route = useRoute();
  const { donationId } = route.params;
  const [donationDetails, setDonationDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch donation details from Firestore based on donationId
  const fetchDonationDetails = async () => {
    try {
      console.log("📥 Fetching donation details...");
      const donationRef = doc(db, "medicineDonations", donationId);
      const donationDoc = await getDoc(donationRef);

      if (donationDoc.exists()) {
        setDonationDetails(donationDoc.data());
      } else {
        console.error("❌ No such donation found.");
        Alert.alert("Error", "Donation not found.");
      }
    } catch (error) {
      console.error("❌ Error fetching donation details:", error);
      Alert.alert("Error", "Failed to fetch donation details.");
    }
  };

  useEffect(() => {
    if (donationId) {
      fetchDonationDetails(); // Fetch data when component mounts
    }
  }, [donationId]);

  if (!donationDetails) {
    return <Text>Loading...</Text>;
  }



  // Handle image click to open in full screen
  const handleImageClick = () => {
    setModalVisible(true);
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Convert Firestore timestamp to Date object
    return `${date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} - ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
  };


  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView style={styles.content}>
        <Text style={styles.heading}>Donation Details</Text>
        <Text style={styles.donationTitle}>{donationDetails.medicineName}</Text>

        {/* Image */}
        <TouchableOpacity onPress={handleImageClick}>
          <Image
            source={{ uri: donationDetails.imageUrl || "https://via.placeholder.com/300x200.png?text=No+Image+Available" }}
            style={styles.medicineImage}
          />
        </TouchableOpacity>
        <View style={styles.row}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{donationDetails.quantity || "Unknown"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{donationDetails.status || "Unknown"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date & Time:</Text>
          <Text style={styles.value}>{donationDetails.createdAt ? formatDate(donationDetails.createdAt) : "N/A"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{donationDetails.category || "Unknown"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Condition:</Text>
          <Text style={styles.value}>{donationDetails.condition || "Unknown"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Details:</Text>
          <Text style={styles.value}>{donationDetails.details || "No details available."}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Reason:</Text>
          <Text style={styles.value}>{donationDetails.reason || "No reason provided."}</Text>
        </View>


      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} />

      {/* Full-Screen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: donationDetails.imageUrl || "https://via.placeholder.com/300x200.png?text=No+Image+Available" }}
            style={styles.fullScreenImage}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#09B5B6",
    textAlign: "center",
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  medicineImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  label: {
    fontWeight: "bold", // Bold for headings
    fontSize: 16,
    marginRight: 10, // Space between label and value
  },
  row: {
    flexDirection: "row", // Align label and value in a row
    marginVertical: 5,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  // Modal styles for full-screen image
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#09B5B6",
    padding: 10,
    borderRadius: 10,
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fullScreenImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
});

export default DonorDonationDetails;
