import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import Header from "../../components/Header"; // Adjust path if needed
import BottomNav from "../../components/BottomNav"; // Adjust path if needed
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const MedicineListScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    // Cleanup listeners
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);



  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const q = query(
          collection(db, "medicineDonations"),
          where("status", "==", "Approved")
        );

        const snapshot = await getDocs(q);
        const data = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const medicine = { id: docSnapshot.id, ...docSnapshot.data() };

            // Fetch the corresponding donor's full name using userId as document ID
            try {
              const donorRef = doc(db, "donors", medicine.userId);
              const donorDoc = await getDoc(donorRef);

              if (donorDoc.exists()) {
                const donorData = donorDoc.data();
                medicine.donorName = donorData.fullName || "Anonymous";
              } else {
                medicine.donorName = "Anonymous";
              }
            } catch (error) {
              console.error("Error fetching donor name:", error);
              medicine.donorName = "Anonymous";
            }

            return medicine;
          })
        );

        setMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);


  const filteredMedicines = medicines.filter((medicine) =>
    medicine.medicineName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Header navigation={navigation} />
          <View style={styles.content}>
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
            <Text style={styles.title}>Available Medicines</Text>
            <ScrollView contentContainerStyle={styles.medicineList}>
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <View key={medicine.id} style={styles.medicineCard}>
                    <Image
                      source={{
                        uri:
                          medicine.imageUrl ||
                          "https://via.placeholder.com/110x110.png?text=No+Image",
                      }}
                      style={styles.medicineImage}
                    />
                    <View style={styles.medicineInfo}>
                      <Text style={styles.medicineText}>
                        Name:{" "}
                        {medicine.medicineName?.length > 10
                          ? `${medicine.medicineName.slice(0, 10)}...`
                          : medicine.medicineName}
                      </Text>
                      <Text style={styles.medicineText}>
                        Quantity:{" "}
                        {medicine.quantity?.length > 10
                          ? `${medicine.quantity.slice(0, 10)}...`
                          : medicine.quantity}
                      </Text>
                      <Text style={styles.medicineText}>
                        Category:{" "}
                        {medicine.category?.length > 10
                          ? `${medicine.category.slice(0, 10)}...`
                          : medicine.category}
                      </Text>
                      <Text style={styles.medicineText}>
                        Donor: {medicine.donorName || "Anonymous"}
                      </Text>

                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() =>
                          navigation.navigate("PatientMedicineDetails", {
                            medicine,
                          })
                        }
                      >
                        <Text style={styles.buttonText}>Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.requestButton}
                        onPress={() =>
                          navigation.navigate("PatientRequestMedicine", { medicine })
                        }
                      >
                        <Text style={styles.buttonText}>Request</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No medicines found</Text>
              )}
            </ScrollView>
          </View>
          {!keyboardVisible && <BottomNav navigation={navigation} />}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.container}>
//           <Header navigation={navigation} />
//           <View style={styles.content}>
//             <View style={styles.searchContainer}>
//               <View style={styles.searchBar}>
//                 <TextInput
//                   placeholder="Search for Medicines..."
//                   style={styles.searchInput}
//                   value={searchTerm}
//                   onChangeText={setSearchTerm}
//                 />
//                 <Text style={styles.searchIcon}>🔍</Text>
//               </View>
//             </View>
//             <Text style={styles.title}>Available Medicines</Text>
//             <ScrollView contentContainerStyle={styles.medicineList}>
//               {filteredMedicines.length > 0 ? (
//                 filteredMedicines.map((medicine) => (
//                   <View key={medicine.id} style={styles.medicineCard}>
//                     <Image
//                       source={{ uri: medicine.image }}
//                       style={styles.medicineImage}
//                     />
//                     <View style={styles.medicineInfo}>
//                       <Text style={styles.medicineText}>
//                         Name:{" "}
//                         {medicine.name.length > 10
//                           ? `${medicine.name.slice(0, 10)}...`
//                           : medicine.name}
//                       </Text>
//                       <Text style={styles.medicineText}>
//                         Quantity:{" "}
//                         {medicine.quantity.length > 10
//                           ? `${medicine.quantity.slice(0, 10)}...`
//                           : medicine.quantity}
//                       </Text>
//                       <Text style={styles.medicineText}>
//                         Category:{" "}
//                         {medicine.category.length > 10
//                           ? `${medicine.category.slice(0, 10)}...`
//                           : medicine.category}
//                       </Text>
//                       <Text style={styles.medicineText}>
//                         Donor:{" "}
//                         {medicine.donor.length > 10
//                           ? `${medicine.donor.slice(0, 10)}...`
//                           : medicine.donor}
//                       </Text>
//                     </View>
//                     <View style={styles.buttonContainer}>
//                       <TouchableOpacity
//                         style={styles.detailsButton}
//                         onPress={() =>
//                           navigation.navigate("PatientMedicineDetails", { medicine })
//                         }
//                       >
//                         <Text style={styles.buttonText}>Details</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={styles.requestButton}
//                         onPress={() =>
//                           navigation.navigate("PatientRequestMedicine", { medicine })
//                         }
//                       >
//                         <Text style={styles.buttonText}>Request</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.emptyText}>No medicines found</Text>
//               )}
//             </ScrollView>
//           </View>
//            {!keyboardVisible && <BottomNav navigation={navigation} />}
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  content: {
    flex: 1,
    padding: 15,
    maxHeight: "78%",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  medicineList: {
    paddingBottom: 20,
  },
  medicineCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  medicineImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#076A70",
    marginBottom: 5,
  },
  medicineDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "evenly",
    justifyContent: "space-evenly",
  },
  searchContainer: {
    marginVertical: 20,
    width: "100%",
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
  detailsButton: {
    backgroundColor: "#09B5B6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  requestButton: {
    backgroundColor: "#002855",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
  medicineText: {
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis", // Ensures the text is truncated with ellipsis
    whiteSpace: "nowrap", // Prevents text from wrapping
    marginTop: 5,
  },
});

export default MedicineListScreen;
