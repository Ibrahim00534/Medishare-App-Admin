
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import Header from "../../components/DonorHeader";
import BottomNav from "../../components/DonorBottomNav";
import * as Font from "expo-font";

const DonorMyRequestsScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "IndieFlower-Regular": require("../../assets/fonts/IndieFlower-Regular.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const requests = [
    {
      name: "Medicine ABC",
      status: "Pending",
      donor: "Person XYZ",
      date: "01 May, 2024",
      image: "https://via.placeholder.com/100", // Add image URL
    },
    {
      name: "Medicine ABC",
      status: "Approved",
      donor: "Person XYZ",
      date: "01 May, 2024",
      image: "https://via.placeholder.com/100", // Add image URL
    },
    {
      name: "Medicine ABC",
      status: "Success",
      donor: "Person XYZ",
      date: "01 May, 2024",
      image: "https://via.placeholder.com/100", // Add image URL
    },
  ];

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

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <View style={styles.content}>
        <ScrollView>
          {requests.map((request, index) => (
            <View key={index} style={styles.requestCard}>
              <View style={styles.textContainer}>
                <Text style={styles.requestName}>Name: {request.name}</Text>
                <Text style={[styles.requestStatus, getStatusStyle(request.status)]}>
                  Status: {request.status}
                </Text>
                <Text>Donor: {request.donor}</Text>
                <Text>{request.date}</Text>
              </View>
              <Image source={{ uri: request.image }} style={styles.medicineImage} />
            </View>
          ))}
        </ScrollView>
      </View>

      <BottomNav navigation={navigation} />
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
    flexDirection: "row", // Align image and text side by side
    justifyContent: "space-between", // Space out the text and image
    alignItems: "center", // Vertically center the content
  },
  textContainer: {
    flex: 1, // Take up remaining space for text
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
});

export default DonorMyRequestsScreen;
