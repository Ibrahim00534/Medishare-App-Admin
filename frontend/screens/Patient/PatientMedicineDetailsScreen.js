import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from "react-native";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";

const DonorMedicineDetailsScreen = ({ navigation, route }) => {
  const { medicine } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  // Use medicine.imageUrl from Firebase, fallback to local image
  const imageSource = medicine.imageUrl
    ? { uri: medicine.imageUrl }
    : require("../../assets/Pills_Image.png");

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={() => openModal(imageSource)}>
            <Image source={imageSource} style={styles.image} />
          </TouchableOpacity>

          <Text style={styles.label}>
            Name: <Text style={styles.value}>{medicine.medicineName}</Text>
          </Text>
          <Text style={styles.label}>
            Quantity: <Text style={styles.value}>{medicine.quantity}</Text>
          </Text>
          <Text style={styles.label}>
            Category: <Text style={styles.value}>{medicine.category}</Text>
          </Text>
          <Text style={styles.label}>
            Description: <Text style={styles.value}>{medicine.details || "No description provided"}</Text>
          </Text>
          <Text style={styles.label}>
            Condition: <Text style={styles.value}>{medicine.condition || "Not specified"}</Text>
          </Text>
          {/* <Text style={styles.label}>
            Expiry Date: <Text style={styles.value}>{medicine.expiryDate || "Not provided"}</Text>
          </Text> */}
          <Text style={styles.label}>
            Donor: <Text style={styles.value}>{medicine.donorName || "Anonymous"}</Text>
          </Text>
          <Text style={styles.label}>
            Reason of Donation: <Text style={styles.value}>{medicine.reason || "N/A"}</Text>
          </Text>
          <Text style={styles.label}>
            Status: <Text style={styles.value}>{medicine.status || "N/A"}</Text>
          </Text>
          <Text style={styles.label}>
            Posted On:{" "}
            <Text style={styles.value}>
              {medicine.createdAt
                ? new Date(medicine.createdAt.seconds * 1000).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
                : "Not provided"}
            </Text>
          </Text>


          {/* <Text style={styles.label}>
            Contact Info: <Text style={styles.value}>{medicine.contact || "Not provided"}</Text>
          </Text>
          <Text style={styles.label}>
            Location: <Text style={styles.value}>{medicine.location || "Not specified"}</Text>
          </Text> */}
        </View>

        <TouchableOpacity
          style={styles.requestButton}
          onPress={() =>
            navigation.navigate("PatientRequestMedicine", { medicine })
          }         >
          <Text style={styles.buttonText}>Request Now</Text>
        </TouchableOpacity>
      </View>

      <BottomNav navigation={navigation} />

      {/* Full Screen Modal for Image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          <Image source={selectedImage} style={styles.fullScreenImage} />
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  detailsContainer: {
    backgroundColor: "#E3FAFA",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    marginBottom: 15,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: "#002855",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#002855",
    fontSize: 16,
  },
  fullScreenImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
    borderRadius: 10,
  },
});

export default DonorMedicineDetailsScreen;
