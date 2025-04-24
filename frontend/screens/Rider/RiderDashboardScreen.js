import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import Header from "../../components/RIderHeader"; // Adjust the path as necessary
import BottomNav from "../../components/RiderBottomNav"; // Adjust the path as necessary
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase/firebaseConfig"; // adjust based on your file structure

const RiderDashboardScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isReadyForRide, setIsReadyForRide] = useState(false);
  const [fullName, setFullName] = useState("");

  const loadFonts = async () => {
    await Font.loadAsync({
      "IndieFlower-Regular": require("../../assets/fonts/IndieFlower-Regular.ttf"),
    });
    setFontsLoaded(true);
  };
  const fetchUserFullName = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      console.log("Current User:", user); // Log user to check if authenticated

      if (!user || !user.email) {
        console.log("No user is logged in or missing email");
        return;
      }

      const db = getFirestore(firebaseApp);
      const riderRef = collection(db, "riders");
      const q = query(riderRef, where("email", "==", user.email));
      console.log("Firestore Query:", q); // Log query to ensure it's correct

      const querySnapshot = await getDocs(q);
      console.log("Query Snapshot:", querySnapshot); // Log querySnapshot to inspect data

      if (!querySnapshot.empty) {
        const riderDoc = querySnapshot.docs[0];
        const riderData = riderDoc.data();
        console.log("Fetched rider data:", riderData); // Log rider data

        setFullName(riderData?.name || "Rider");
        setIsReadyForRide(riderData?.status === "Active");
      } else {
        console.log("No matching rider found.");
      }
    } catch (error) {
      console.error("Error fetching rider info:", error);
    }
  };



  useEffect(() => {
    loadFonts();
    fetchUserFullName();

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

  useEffect(() => {
    loadFonts();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Ride data to filter (Example data)
  const rides = [
    { id: "1", name: "City Ride to Downtown", category: "Regular" },
    { id: "2", name: "Airport Transfer", category: "Premium" },
    { id: "3", name: "Grocery Delivery", category: "Express" },
    // Add more rides here
  ];

  const filteredRides = rides.filter((ride) =>
    ride.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!fontsLoaded) {
    return null;
  }

  const toggleStatus = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (user && user.email) {
        const db = getFirestore(firebaseApp);
        const riderRef = collection(db, "riders");
        const q = query(riderRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const riderDoc = querySnapshot.docs[0];
          const docRef = doc(db, "riders", riderDoc.id); // ✅ Proper reference

          const newStatus = isReadyForRide ? "Inactive" : "Active";

          // Update Firestore
          await updateDoc(docRef, {
            status: newStatus,
          });

          // Update local state
          setIsReadyForRide(!isReadyForRide);
        } else {
          console.log("Rider not found.");
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };



  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <Header navigation={navigation} />

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search for Rides..."
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
        </View>

        {searchTerm === "" && keyboardVisible && (
          <Text style={styles.noResultsText}>No search results...</Text>
        )}

        {searchTerm && (
          <View style={styles.rideList}>
            {filteredRides.length > 0 ? (
              filteredRides.map((ride) => (
                <View key={ride.id} style={styles.rideCard}>
                  <Text style={styles.rideText}>{ride.name}</Text>
                  <Text style={styles.rideText}>{ride.category}</Text>
                </View>
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
              source={require("../../assets/riders.jpg")} // Change to a relevant image
              style={styles.rideImage}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>
              Ready to make a difference on the road!
            </Text>

            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => {
                navigation.navigate("RidesAssigned"); // Navigate to track ride screen
              }}
            >
              <Text style={styles.buttonText}>Take a Ride</Text>
            </TouchableOpacity>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  isReadyForRide && styles.checkboxChecked,
                ]}
                onPress={toggleStatus}
              >
                {isReadyForRide && <Text style={styles.tickMark}>✓</Text>}
              </TouchableOpacity>

              <Text style={styles.checkboxLabel}>Ready For Ride</Text>
            </View>
          </View>
        )}

        {!keyboardVisible && (
          <View style={styles.bottomNav}>
            <BottomNav navigation={navigation} />
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
    height: 1,
    width: "100%",
  },
  rideList: {
    padding: 20,
    width: "90%",
    backgroundColor: "#F7F7F7",
    marginVertical: 10,
  },
  rideCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  rideText: {
    fontSize: 16,
    color: "#333",
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
  rideImage: {
    width: "100%",
    height: 200,
    marginVertical: 20,
  },
  infoText: {
    textAlign: "center",
    fontSize: 25,
    color: "#FFFFFF",
    fontFamily: "IndieFlower-Regular",
  },
  requestButton: {
    marginTop: 40,
    backgroundColor: "#002855",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  offerButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#001F42",
    borderWidth: 2,
    width: "50%",
  },
  offerButtonText: {
    color: "#001F42",
    fontSize: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#001F42",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#002855",
    borderColor: "#002855",
  },
  tickMark: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#001F42",
    marginTop: 5,
  },

});

export default RiderDashboardScreen;
