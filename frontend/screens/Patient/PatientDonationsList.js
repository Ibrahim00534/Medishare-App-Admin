import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";

const PatientDonationsList = () => {
  const [donations, setDonations] = useState([]);
  const navigation = useNavigation();

  // Dummy donation data
  const donationData = [
    { id: '1', title: "Donation 1", date: "2024-11-01", status: "Completed" },
    { id: '2', title: "Donation 2", date: "2024-10-20", status: "Pending" },
    // Add more donations here
  ];

  useEffect(() => {
    // Fetch donation data from your backend (example is static data)
    setDonations(donationData);
  }, []);

  const handlePress = (donationId) => {
    // Navigate to donation details page
    navigation.navigate("PatientDonationDetails", { donationId });
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation}/>
    <View style={styles.content}>
      <Text style={styles.heading}>My Donations</Text>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.donationCard} onPress={() => handlePress(item.id)}>
            <Text style={styles.donationTitle}>{item.title}</Text>
            <Text>{item.date}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
      <BottomNav navigation={navigation}/>
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
  },
  donationCard: {
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#e0f7fa",
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PatientDonationsList;
