

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
  ActivityIndicator,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/firebaseConfig";
import Header from "../../components/DonorHeader";
import BottomNav from "../../components/DonorBottomNav";
import * as Font from "expo-font";
import { firebaseApp } from "../../firebase/firebaseConfig";
import { getFirestore } from "firebase/firestore";

const DonorDashboardScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullName, setFullName] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const loadFonts = async () => {
    await Font.loadAsync({
      "IndieFlower-Regular": require("../../assets/fonts/IndieFlower-Regular.ttf"),
    });
    setFontsLoaded(true);
  };
  const fetchDonationData = async () => {
    const user = auth.currentUser;
    const userId = user?.uid;

    if (!userId) {
      console.error("❌ User is not logged in.");
      return;
    }

    try {
      setLoading(true);
      const donationsRef = collection(db, "medicineDonations");
      const q = query(donationsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const donationData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDonationHistory(donationData);
    } catch (error) {
      console.error("❌ Error fetching donation data:", error);
      Alert.alert("Error", "Failed to fetch donation data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFullName = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (user && user.email) {
        const db = getFirestore(firebaseApp);
        const donorRef = collection(db, "donors");
        const q = query(donorRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const donorData = querySnapshot.docs[0].data();
          setFullName(donorData.fullName || "Donor");
          setUserStatus(donorData.status);

        } else {
          console.log("No matching donor found.");
        }
      }
    } catch (error) {
      console.error("Error fetching donor info:", error);
    }
  };

  // Effect hooks
  useEffect(() => {
    loadFonts();
    fetchUserFullName();
    fetchDonationData();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const filteredHistory = donationHistory.filter((item) =>
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handlePress = (donationId) => {
    // Navigate to donation details page
    navigation.navigate("DonorDonationDetails", { donationId });
  };
  // all other hooks here...

  useEffect(() => {
    if (userStatus === "Suspended") {
      Alert.alert(
        "Account Suspended",
        "Your account is suspended due to suspicious activity. Please contact admin at admin@gmail.com.",
        [
          {
            text: "Logout",
            onPress: () => {
              auth.signOut();
              navigation.navigate("Welcome");
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [userStatus]);

  if (!fontsLoaded || loading) {
    return <Text>Loading...</Text>;
  }



  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header navigation={navigation} />

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search Donation History..."
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
        </View>

        {searchTerm && (
          <View style={styles.overlayList}>

            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <TouchableOpacity style={styles.donationCard} onPress={() => handlePress(item.id)}>

                  <View key={item.uid} style={styles.historyCard}>
                    <Text style={styles.historyText}>
                      {item.medicineName} - {item.quantity}
                    </Text>
                    <Text style={styles.historyDate}>
                      Date:{" "}
                      {item.createdAt?.seconds
                        ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
                        : "N/A"}
                    </Text>

                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResultsText}>No results found</Text>
            )}
          </View>
        )}

        {!keyboardVisible && (
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Welcome, {fullName}!</Text>
            <Image
              source={require("../../assets/Pills_Image.png")}
              style={styles.donorImage}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>
              Make a Difference {"\n"}Donate Medicines
            </Text>

            <TouchableOpacity
              style={styles.donateButton}
              onPress={() => navigation.navigate("DonorDonateMedicineScreen")}
            >
              <Text style={styles.buttonText}>Donate Medicine</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* {!keyboardVisible && <BottomNav navigation={navigation} />} */}
        {!keyboardVisible && (
          <View style={styles.bottomNavContainer}>
            <BottomNav navigation={navigation} />
          </View>
        )}

      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  searchContainer: {
    marginVertical: 20,
    width: "90%",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#076A70",
    backgroundColor: "#E3FAFA",
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 18,
    color: "#001F42",
    marginLeft: 10,
  },
  content: {
    padding: 20,
    flex: 4 / 7,
    backgroundColor: "#09B5B6",
    alignItems: "center",
    width: "100%",
    zIndex: 10,
  },
  historyList: {
    padding: 20,
    width: "90%",
    backgroundColor: "#F7F7F7",
    marginVertical: 10,


  },
  historyCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  historyText: {
    fontSize: 16,
    color: "#333",
  },
  historyDate: {
    fontSize: 14,
    color: "#777",
  },
  noResultsText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 30,
    color: "#001F42",
    fontFamily: "IndieFlower-Regular",
  },
  donorImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  infoText: {
    textAlign: "center",
    fontSize: 25,
    color: "#FFFFFF",
    fontFamily: "IndieFlower-Regular",
  },
  donateButton: {
    marginTop: 40,
    backgroundColor: "#002855",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    width: "60%",
    alignItems: "center",
  },
  overlayList: {
    position: "absolute",
    top: 180, // adjust based on your header + searchBar height
    left: 0,
    right: 0,
    bottom: 60, // leave space for BottomNav if needed
    zIndex: 99,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    height: 550
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default DonorDashboardScreen;

