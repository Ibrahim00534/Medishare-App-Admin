
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import Header from "../../components/RIderHeader";
import BottomNav from "../../components/RiderBottomNav";
import { updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // apna firebase config import karo
import { collection, query, where, getDocs } from "firebase/firestore";
import axios from "axios"; // make sure axios is installed

const RiderProfile = ({ navigation }) => {
  const [profileInfo, setProfileInfo] = useState({
    name: "Zain Ejaz",
    email: "zain@gmail.com",
    address: "Islamabad", // Rider's address
    phone: "12345678901", // Rider's phone
    assignedDonations: [
      "Donation_01",
      "nCiL6CHvykaJiYtzKMbxdo9XZV82"
    ], // Rider's donations
    status: "Active",
    vehicle: "Motorbike", // Example vehicle
    dob: { day: 15, month: 5, year: 1990 }, // Default DOB
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfileInfo, setEditedProfileInfo] = useState({
    ...profileInfo,
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleEditInfo = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const q = query(
            collection(db, "riders"),
            where("uid", "==", user.uid)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const riderDoc = querySnapshot.docs[0]; // first document
            const data = riderDoc.data();
            setProfileInfo(data);
            setEditedProfileInfo(data);
          } else {
            console.log("No rider document found for this user.");
          }
        } else {
          console.log("No user logged in.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const uploadImageToCloudinary = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const mimeType = blob.type;
      const base64 = await readBlobAsBase64(blob);
  
      const payload = new URLSearchParams({
        file: `data:${mimeType};base64,${base64}`,
        upload_preset: "ml_default", // must match your Cloudinary preset
      });
  
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dvgfilxns/image/upload",
        payload.toString(), // make sure it's passed as string
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      console.log("✅ Image uploaded successfully:", res.data);
      return res.data.secure_url;
    } catch (err) {
      console.error("❌ Cloudinary upload failed:", err.response?.data || err.message || err);
      Alert.alert("Upload Failed", "Could not upload image.");
      return null;
    }
  };
  

  const readBlobAsBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSaveInfo = async () => {
    try {
      const { name, email, address, phone, vehicle, imageUrl } = editedProfileInfo;

      if (!name || !email || !address || !phone || !vehicle) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const q = query(collection(db, "riders"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const riderDoc = querySnapshot.docs[0]; // get document ref
          const riderDocRef = riderDoc.ref;

          await updateDoc(riderDocRef, {
            name,
            email,
            address,
            phone,
            vehicle,
            imageUrl: imageUrl || null,
          });

          setProfileInfo({
            ...editedProfileInfo,
          });

          setIsEditing(false);
          Alert.alert("Success", "Profile updated successfully!");
        } else {
          Alert.alert("Error", "Rider document not found.");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };



  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfileInfo({ ...profileInfo });
  };

  const handleChange = (field, value) => {
    setEditedProfileInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please grant permission to access your gallery.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      const imageUrl = await uploadImageToCloudinary(uri);

      if (imageUrl) {
        setSelectedImage(imageUrl);
        setEditedProfileInfo((prevInfo) => ({
          ...prevInfo,
          imageUrl: imageUrl,
        }));
      }
    }
  };

  // const removeImage = () => {
  //   setSelectedImage(null);
  // };
  const removeImage = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "No user is logged in.");
        return;
      }

      const q = query(collection(db, "riders"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const riderDoc = querySnapshot.docs[0];
        const riderRef = riderDoc.ref;

        // Remove imageUrl from Firestore
        await updateDoc(riderRef, {
          imageUrl: null,
        });

        // Remove from local state
        setSelectedImage(null);
        setEditedProfileInfo((prev) => ({
          ...prev,
          imageUrl: null,
        }));

        setProfileInfo((prev) => ({
          ...prev,
          imageUrl: null,
        }));

        Alert.alert("Image removed successfully!");
      } else {
        Alert.alert("Error", "Rider document not found.");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      Alert.alert("Error", "Failed to remove image.");
    }
  };

  const years = Array.from({ length: 76 }, (_, i) => 1950 + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
  ];

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        <Pressable onPress={pickImage} style={styles.imageContainer}>
          {selectedImage || profileInfo.imageUrl ? (
            <Image
              source={{ uri: selectedImage || profileInfo.imageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.defaultImage}>
              <Text style={styles.imageText}>Select Image</Text>
            </View>
          )}
        </Pressable>

        {(selectedImage || profileInfo.imageUrl) && (
          <View style={styles.imageButtonsContainer}>
            <Button title="Remove" onPress={removeImage} />
            <Button title="Update" onPress={pickImage} />
          </View>
        )}

        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <View style={styles.infoBox}>
                <Text>📝</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.name}
                  onChangeText={(text) => handleChange("name", text)}
                  placeholder="Name"
                />
              </View>
              <View style={styles.infoBox}>
                <Text>📧</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.email}
                  onChangeText={(text) => handleChange("email", text)}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.infoBox}>
                <Text>📍</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.address}
                  onChangeText={(text) => handleChange("address", text)}
                  placeholder="Location"
                />
              </View>
              <View style={styles.infoBox}>
                <Text>📞</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.infoBox}>
                <Text>🚲</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.vehicle}
                  onChangeText={(text) => handleChange("vehicle", text)}
                  placeholder="Vehicle"
                />
              </View>

              <Button title="Save Changes" onPress={handleSaveInfo} />
              <Button title="Cancel" onPress={handleCancelEdit} />
            </>
          ) : (
            <>
              <View style={styles.infoBox}>
                <Text>📝</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.name}
                  onChangeText={(text) => handleChange("name", text)}
                  placeholder="Name"
                />
              </View>
              <View style={styles.infoBox}>
                <Text>📧</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.email}
                  onChangeText={(text) => handleChange("email", text)}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.infoBox}>
                <Text>📍</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.address}
                  onChangeText={(text) => handleChange("address", text)}
                  placeholder="Location"
                />
              </View>
              <View style={styles.infoBox}>
                <Text>📞</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.infoBox}>
                <Text>🚲</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfileInfo.vehicle}
                  onChangeText={(text) => handleChange("vehicle", text)}
                  placeholder="Vehicle"
                />
              </View>

              <Button title="Edit Info" onPress={handleEditInfo} />
            </>
          )}
        </View>
      </View>
      <BottomNav navigation={navigation} />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
  },
  defaultImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: {
    color: "#666",
    fontSize: 14,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginVertical: 10,
  },
  infoContainer: {
    width: "80%",
    alignItems: "center",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    marginVertical: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderColor: "#09B5B6",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  editButton: {
    marginTop: 10,
  },
  editText: {
    color: "darkblue",
    fontSize: 18,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  actionButtonsContainer: {
    flexDirection: "column",
    gap: 10,
    marginTop: 20,
    width: "50%",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  picker: {
    height: 30,
    width: 120,
  },
  actionButtonsContainer: {
    flexDirection: "column",
    gap: 15,
    marginTop: 30,
    width: "70%",
  },
  myDonationBtn: {
    backgroundColor: "#09B5B6",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  myRequestsBtn: {
    backgroundColor: "#09B5B6",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
});

export default RiderProfile;