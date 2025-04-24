
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
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import axios from "axios";
import Header from "../../components/DonorHeader";
import BottomNav from "../../components/DonorBottomNav";

const DonorProfile = ({ navigation }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  const [profileInfo, setProfileInfo] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfileInfo, setEditedProfileInfo] = useState({ ...profileInfo });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const docRef = doc(db, "donors", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileInfo(data);
        setEditedProfileInfo(data);
        if (data.imageUrl) setSelectedImage(data.imageUrl);
      }
    } catch (err) {
      console.error("❌ Failed to load profile:", err);
    }
  };

  const handleEditInfo = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfileInfo({ ...profileInfo });
  };

  const handleChange = (field, value) => {
    setEditedProfileInfo((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission Required", "Enable gallery access to upload image.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      const imageUrl = await uploadImageToCloudinary(uri);
      if (imageUrl) {
        setSelectedImage(imageUrl);
        await updateDoc(doc(db, "donors", userId), { imageUrl });
        Alert.alert("Success", "Profile picture updated!");
      }
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const mimeType = blob.type;

      const base64 = await readBlobAsBase64(blob);

      const payload = new URLSearchParams({
        file: `data:${mimeType};base64,${base64}`,
        upload_preset: "ml_default",
      });

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dvgfilxns/image/upload",
        payload,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      return res.data.secure_url;
    } catch (err) {
      console.error("❌ Cloudinary upload failed:", err);
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
      await updateDoc(doc(db, "donors", userId), editedProfileInfo);
      setProfileInfo(editedProfileInfo);
      setIsEditing(false);
      Alert.alert("Updated", "Profile updated successfully!");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={pickImage} style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.defaultImage}>
              <Text style={styles.imageText}>Select Image</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <TextInput
  style={styles.input}
  value={editedProfileInfo.fullName}
  onChangeText={(text) => handleChange("fullName", text)}
  placeholder="Full Name"
/>
<TextInput
  style={styles.input}
  value={editedProfileInfo.email}
  onChangeText={(text) => handleChange("email", text)}
  placeholder="Email"
/>
<TextInput
  style={styles.input}
  value={editedProfileInfo.address}
  onChangeText={(text) => handleChange("address", text)}
  placeholder="Address"
/>
<TextInput
  style={styles.input}
  value={editedProfileInfo.phoneNumber}
  onChangeText={(text) => handleChange("phoneNumber", text)}
  placeholder="Phone Number"
/>
<TextInput
  style={styles.input}
  value={editedProfileInfo.idCardNumber}
  onChangeText={(text) => handleChange("idCardNumber", text)}
  placeholder="CNIC"
/>

              <Button title="Save" onPress={handleSaveInfo} />
              <Button title="Cancel" onPress={handleCancelEdit} />
            </>
          ) : (
            <>
              <Text>Name: {profileInfo.fullName}</Text>
              <Text>Email: {profileInfo.email}</Text>
              <Text>Location: {profileInfo.address}</Text>
              <Text>Phone: {profileInfo.phoneNumber}</Text>
              <Text>CNIC: {profileInfo.idCardNumber}</Text>
              <Pressable onPress={handleEditInfo}>
                <Text>Edit Info</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={styles.myDonationBtn}
            onPress={() => navigation.navigate("DonorDonationsList")}
          >
            <Text style={styles.buttonText}>View My Donations</Text>
          </Pressable>
          <Pressable
            style={styles.myDonationBtn}
            onPress={() => navigation.navigate("DonorDonateMedicineScreen")}
          >
            <Text style={styles.buttonText}>Make a Donation</Text>
          </Pressable>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5" 
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#09B5B6",
  },
  defaultImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#777",
    fontWeight: "bold",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderColor: "#09B5B6",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
  },
  textField: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#09B5B6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  actionButtonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  myDonationBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#09B5B6",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveCancelButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelBtn: {
    flex: 0.50,
    backgroundColor: "blue",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtn: {
    flex: 0.50,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveCancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DonorProfile;
