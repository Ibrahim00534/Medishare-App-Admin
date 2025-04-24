
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator, // Import ActivityIndicator for the loader
  TextInput,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../firebase/firebaseConfig"; // Ensure this points to your Firebase config
import Header from "../../components/DonorHeader";
import BottomNav from "../../components/DonorBottomNav";
import { getAuth } from "firebase/auth"; // Firebase Authentication

const DonorDonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const navigation = useNavigation();

  // Get current logged-in user's ID
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Fetch donation data from Firestore
  const fetchDonationData = async () => {
    if (!userId) {
      console.error("❌ User is not logged in.");
      return;
    }

    try {
      setLoading(true); // Set loading to true before fetching data
      console.log("📥 Fetching donation data...");
      const donationsRef = collection(db, "medicineDonations");
      const q = query(donationsRef, where("userId", "==", userId)); // Filter donations by userId

      const querySnapshot = await getDocs(q);
      const donationData = [];
      querySnapshot.forEach((doc) => {
        donationData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setDonations(donationData);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch donation data.");
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchDonationData(); // Fetch data when component mounts
  }, [userId]);

  const handlePress = (donationId) => {
    // Navigate to donation details page
    navigation.navigate("DonorDonationDetails", { donationId });
  };

  // Filter donations based on the search term
  const filteredDonations = donations.filter((donation) =>
    donation.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView style={styles.content}>
        <Text style={styles.heading}>My Donations</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search donations..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)} // Update searchTerm
          />
        </View>

        {/* Display loader while data is loading */}
        {loading ? (
          <ActivityIndicator size="large" color="#00f" style={styles.loader} />
        ) : (
          filteredDonations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.donationCard}
              onPress={() => handlePress(item.id)}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.donationImage} />
              ) : (
                <Text>No Image Available</Text>
              )}
              <Text style={styles.donationTitle}>{item.medicineName || item.title}</Text>
              <Text>
                {item.createdAt
                  ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </Text>
              <Text>Status: {item.status || "Unknown"}</Text>
            </TouchableOpacity>
          ))
        )}
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
    padding: 20,
    backgroundColor: "#fff",
    maxHeight: 680,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  donationCard: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#e0f7fa",
  },
  donationImage: {
    width: "100%",
    height: 200, // Adjust height as needed
    marginBottom: 10,
    borderRadius: 10,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
    alignSelf: "center", // Center the loader
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
});

export default DonorDonationsList;
