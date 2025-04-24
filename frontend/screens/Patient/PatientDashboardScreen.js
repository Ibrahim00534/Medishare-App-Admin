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
  ActivityIndicator,
  Alert
} from "react-native";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase/firebaseConfig";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import { signOut } from "firebase/auth"; // Import these if not already

const DashboardScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullName, setFullName] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
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

      if (user && user.email) {
        const db = getFirestore(firebaseApp);
        const patientRef = collection(db, "patients");
        const q = query(patientRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const patientData = querySnapshot.docs[0].data();
          setFullName(patientData.fullName || "Patient");
          setUserStatus(patientData.status);
        } else {
          console.log("No matching patient found.");
        }
      }
    } catch (error) {
      console.error("Error fetching patient info:", error);
    }
  };

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const db = getFirestore(firebaseApp);
      const medicineRef = collection(db, "medicineDonations");
      const q = query(medicineRef, where("status", "==", "Approved"));
      const querySnapshot = await getDocs(q);

      const medicineData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedicines(medicineData);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFonts();
    fetchUserFullName();
    fetchMedicines();

    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const filteredMedicines = medicines.filter((item) =>
    item.medicineName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePress = (medicine) => {
    navigation.navigate("PatientMedicineDetails", { medicine });
  };



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
    return <ActivityIndicator size="large" color="#1E90FF" style={{ flex: 1 }} />;
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Header navigation={navigation} />

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search for Medicines..."
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
        </View>

        {searchTerm && (
          <View style={styles.overlayList}>
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.medicineCard}
                  onPress={() => handlePress(item)}
                >
                  <Text style={styles.medicineText}>
                    {item.medicineName} - {item.category}
                  </Text>
                  <Text style={styles.medicineText}>
                    Qty: {item.quantity || "N/A"}
                  </Text>
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
              style={styles.medicineImage}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>
              No Worries{"\n"}We Got Medicines for You
            </Text>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => {
                navigation.navigate("PatientMedicineList");
              }}
            >
              <Text style={styles.buttonText}>Request a Medicine</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.availableButton}
              // inside your onPress:
              onPress={() => {
                Alert.alert(
                  "Confirm",
                  "You will have to login as donor to donate!",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Login",
                      onPress: async () => {
                        const auth = getAuth();
                        try {
                          await signOut(auth); // ✅ first logout current user
                          navigation.navigate("DonorLogin"); // ✅ then navigate
                        } catch (error) {
                          console.error("Error signing out:", error);
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Text >Donate a Medicine</Text>
            </TouchableOpacity>

          </View>
        )}

        {!keyboardVisible && (
          <View style={styles.bottomNav}>
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
  medicineList: {
    padding: 20,
    width: "90%",
    backgroundColor: "#F7F7F7",
    marginVertical: 10,
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

  medicineCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  medicineText: {
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
  medicineImage: {
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
  availableButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#001F42",
    borderWidth: 2,
    width: "50%",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff", // Adjust as needed to match your design
  },
});

export default DashboardScreen;
