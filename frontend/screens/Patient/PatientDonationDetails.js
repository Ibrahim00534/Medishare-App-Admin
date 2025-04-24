import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";

const DonationDetails = ({ navigation }) => {
  const route = useRoute();
  const { donationId } = route.params;
  const [donationDetails, setDonationDetails] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // To toggle between edit and view mode

  const donationData = {
    1: {
      title: "Medicine Donation 1",
      date: "2024-11-01",
      time: "10:30 AM",
      amount: "500",
      recipient: "XYZ Charity",
      location: "New York",
      status: "Completed", // Completed status
      recipientContact: "123-456-7890",
      medicineName: "Paracetamol",
      medicineImage: "https://example.com/medicine_image1.jpg",
      quantity: "500 units",
      category: "Painkillers",
      condition: "New",
      reason: "Medical Supplies for Emergency Aid",
      details: "Donated 500 units of Paracetamol to XYZ charity for medical supplies.",
    },
    2: {
      title: "Medical Equipment Donation 2",
      date: "2024-10-20",
      time: "02:15 PM",
      amount: "200",
      recipient: "ABC NGO",
      location: "Los Angeles",
      status: "Pending",
      recipientContact: "987-654-3210",
      medicineName: "Aspirin",
      medicineImage: "https://invalid.url/medicine_image2.jpg", // Invalid image URL for testing
      quantity: "200 units",
      category: "Painkillers",
      condition: "New",
      reason: "For Community Health Initiative",
      details: "Donated 200 units of Aspirin to ABC NGO. Waiting for confirmation.",
    },
  };

  useEffect(() => {
    setDonationDetails(donationData[donationId]);
  }, [donationId]);

  const handleSave = () => {
    // Save logic: You can update the donation details by sending a request to your backend or local storage.
    Alert.alert("Success", "Your donation details have been updated");
    setIsEditable(false); // Switch back to view mode after saving
  };

  if (!donationDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView style={styles.content}>
        <Text style={styles.heading}>Donation Details</Text>

        {/* Editable Image */}
        <Image
          source={{ uri: donationDetails.medicineImage }}
          style={styles.medicineImage}
          onError={() => {
            setDonationDetails({
              ...donationDetails,
              medicineImage: "https://via.placeholder.com/300x200.png?text=No+Image+Available",
            });
          }}
        />

        {/* Editable or Static Medicine Name */}
        {donationDetails.status === "Completed" ? (
          <Text style={styles.medicineName}>{donationDetails.medicineName}</Text>
        ) : (
          <TextInput
            style={styles.medicineName}
            value={donationDetails.medicineName}
            editable={isEditable}
            onChangeText={(text) => setDonationDetails({ ...donationDetails, medicineName: text })}
          />
        )}

        {/* Editable or Static Quantity */}
        {donationDetails.status === "Completed" ? (
          <Text style={styles.input}>{donationDetails.quantity}</Text>
        ) : (
          <TextInput
            style={styles.input}
            value={donationDetails.quantity}
            editable={isEditable}
            onChangeText={(text) => setDonationDetails({ ...donationDetails, quantity: text })}
          />
        )}

        {/* Editable or Static Category */}
        {donationDetails.status === "Completed" ? (
          <Text style={styles.input}>{donationDetails.category}</Text>
        ) : (
          <TextInput
            style={styles.input}
            value={donationDetails.category}
            editable={isEditable}
            onChangeText={(text) => setDonationDetails({ ...donationDetails, category: text })}
          />
        )}

        {/* Editable or Static Condition */}
        {donationDetails.status === "Completed" ? (
          <Text style={styles.input}>{donationDetails.condition}</Text>
        ) : (
          <TextInput
            style={styles.input}
            value={donationDetails.condition}
            editable={isEditable}
            onChangeText={(text) => setDonationDetails({ ...donationDetails, condition: text })}
          />
        )}

        {/* Editable or Static Details */}
        {donationDetails.status === "Completed" ? (
          <Text style={[styles.input, styles.textArea]}>{donationDetails.details}</Text>
        ) : (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={donationDetails.details}
            editable={isEditable}
            onChangeText={(text) => setDonationDetails({ ...donationDetails, details: text })}
            multiline
          />
        )}

        {/* Editable or Static Reason for Donation */}
        {donationDetails.status === "Completed" ? (
          <Text style={styles.input}>{donationDetails.reason}</Text>
        ) : (
          <TextInput
            style={styles.input}
            value={donationDetails.reason}
            editable={isEditable}
            onChangeText={(text) => setDonationDetails({ ...donationDetails, reason: text })}
          />
        )}

        {/* Show/Hide Donation Status and Related Details */}
        {donationDetails.status === "Completed" && (
          <>
            <Text style={styles.input}>Status: {donationDetails.status}</Text>
            <Text style={styles.input}>Recipient Contact: {donationDetails.recipientContact}</Text>
            <Text style={styles.input}>Location: {donationDetails.location}</Text>
          </>
        )}

        {/* Toggle between Edit and View Mode */}
        {donationDetails.status !== "Completed" && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => (isEditable ? handleSave() : setIsEditable(true))}
          >
            <Text style={styles.buttonText}>{isEditable ? "Save Changes" : "Edit Donation"}</Text>
          </TouchableOpacity>
        )}
        
          <TouchableOpacity>
            <Text > </Text>
          </TouchableOpacity>
        
      </ScrollView>
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
    maxHeight: 650,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#09B5B6",
    textAlign: "center",
  },
  medicineImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#09B5B6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DonationDetails;
