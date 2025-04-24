import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  Alert,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Header from "../../components/DonorHeader";
import BottomNav from "../../components/DonorBottomNav";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { auth } from '../../firebase/firebaseConfig.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const db = getFirestore();

const DonorDonateMedicineScreen = ({ navigation, onRequestSubmit }) => {
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [details, setDetails] = useState("");
  const [reason, setReason] = useState("");
  const [image, setImage] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMedicineNameValid, setIsMedicineNameValid] = useState(true);
  const [isQuantityValid, setIsQuantityValid] = useState(true);
  const [isCategoryValid, setIsCategoryValid] = useState(true);
  const [isConditionValid, setIsConditionValid] = useState(true);
  const [isImageValid, setIsImageValid] = useState(true);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [isPrescriptionImageValid, setIsPrescriptionImageValid] = useState(true);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);
  const handlePrescriptionImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant permission to access the photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (result.canceled) {
      console.log("Prescription image selection canceled.");
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const prescriptionUri = result.assets[0].uri;
      console.log("Selected Prescription Image URI:", prescriptionUri);
      setPrescriptionImage(prescriptionUri);
      try {
        await AsyncStorage.setItem('prescriptionUri', prescriptionUri);
      } catch (error) {
        console.error("Error saving prescription URI:", error);
      }
    } else {
      console.error("Error picking prescription image:", result);
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant permission to access the photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (result.canceled) {
      console.log("Image selection was canceled.");
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log("Selected Image URI:", imageUri);
      setImage(imageUri);
      try {
        await AsyncStorage.setItem('imageUri', imageUri);
      } catch (error) {
        console.error("Error saving image URI:", error);
      }
    } else {
      console.error("Error picking an image:", result);
    }
  };

  const handleSubmit = async () => {
    console.log("🚀 Starting handleSubmit");

    setIsMedicineNameValid(!!medicineName);
    setIsQuantityValid(!!quantity);
    setIsCategoryValid(!!category);
    setIsConditionValid(!!condition);
    setIsImageValid(!!image);

    if (!medicineName || !quantity || !category || !condition || !image || !prescriptionImage) {
      console.warn("❌ Validation failed - missing fields");
      Alert.alert("Error", "Please fill all the required fields and select an image.");
      return;
    }

    try {
      console.log("✅ All fields valid. Proceeding...");

      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("❌ No authenticated user found.");
        Alert.alert("Authentication Error", "You must be logged in to submit a donation.");
        return;
      }

      const userUid = currentUser.uid;
      const sanitizedMedicineName = medicineName.replace(/[^a-zA-Z0-9]/g, "_");
      console.log("👤 Logged in user UID:", userUid);
      console.log("💊 Sanitized Medicine Name:", sanitizedMedicineName);

      const storedImageUri = await AsyncStorage.getItem('imageUri');
      if (!storedImageUri) {
        console.error("❌ Image URI not found in AsyncStorage.");
        Alert.alert("Error", "No image selected.");
        return;
      }
      console.log("🖼️ Retrieved stored image URI:", storedImageUri);

      const response = await fetch(storedImageUri);
      const blob = await response.blob();
      const mimeType = blob.type;
      console.log("📦 Blob fetched with type:", mimeType);

      // Wrapping FileReader in a Promise to handle async logic cleanly
      const base64data = await readBlobAsBase64(blob);
      console.log("🧬 Base64 data extracted. Length:", base64data.length);

      const cloudinaryPayload = new URLSearchParams({
        file: `data:${mimeType};base64,${base64data}`,
        upload_preset: "ml_default",
      });

      console.log("📤 Uploading to Cloudinary...");

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dvgfilxns/image/upload",
        cloudinaryPayload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("✅ Image uploaded to Cloudinary.");
      const imageUrl = cloudinaryResponse.data.secure_url;
      console.log("🌐 Uploaded Image URL:", imageUrl);
      // Upload Prescription Image
      const storedPrescriptionUri = await AsyncStorage.getItem('prescriptionUri');
      if (!storedPrescriptionUri) {
        console.error("❌ Prescription Image URI not found in AsyncStorage.");
        Alert.alert("Error", "No prescription image selected.");
        return;
      }
      console.log("🖼️ Retrieved stored prescription image URI:", storedPrescriptionUri);

      const prescriptionResponse = await fetch(storedPrescriptionUri);
      const prescriptionBlob = await prescriptionResponse.blob();
      const prescriptionMimeType = prescriptionBlob.type;

      const base64PrescriptionData = await readBlobAsBase64(prescriptionBlob);
      console.log("🧬 Base64 prescription data extracted. Length:", base64PrescriptionData.length);

      const cloudinaryPrescriptionPayload = new URLSearchParams({
        file: `data:${prescriptionMimeType};base64,${base64PrescriptionData}`,
        upload_preset: "ml_default",
      });

      console.log("📤 Uploading prescription to Cloudinary...");

      const cloudinaryPrescriptionResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dvgfilxns/image/upload",
        cloudinaryPrescriptionPayload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("✅ Prescription uploaded to Cloudinary.");
      const prescriptionImageUrl = cloudinaryPrescriptionResponse.data.secure_url;
      console.log("🌐 Uploaded Prescription Image URL:", prescriptionImageUrl);

      console.log("📝 Saving document to Firestore...");

      await addDoc(collection(db, "medicineDonations"), {
        medicineName,
        quantity,
        category,
        condition,
        details,
        reason,
        imageUrl, // Medicine Image URL
        prescriptionImageUrl, // NEW Prescription Image URL
        status: "Not Approved By Admin Yet",
        createdAt: serverTimestamp(),
        userId: userUid,
      });


      console.log("✅ Document added to Firestore.");

      Alert.alert("Request Submitted", "Your donation request has been sent.");

      // Reset form only after successful submission
      resetForm();

    } catch (error) {
      console.error("❌ Submission error:", error);
      Alert.alert("Submission Failed", "Something went wrong during image upload or saving.");
    }
  };

  // Helper function for FileReader async handling
  const readBlobAsBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Reset form fields
  const resetForm = async () => {
    setMedicineName("");
    setQuantity("");
    setCategory("");
    setCondition("");
    setDetails("");
    setReason("");
    setImage(null);
    setPrescriptionImage(null);
    await AsyncStorage.removeItem('imageUri');
    console.log("🧹 Form reset and imageUri removed.");
  };




  return (
    <View
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          <Header navigation={navigation} />
          <View style={styles.content}>
            <Text style={styles.header}>Request for Medicine Donation</Text>

            <TextInput
              placeholder="Medicine Name"
              style={[styles.input, !isMedicineNameValid && styles.invalidInput]}
              value={medicineName}
              onChangeText={setMedicineName}
            />
            <TextInput
              placeholder="Quantity"
              style={[styles.input, !isQuantityValid && styles.invalidInput]}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
            <TextInput
              placeholder="Category"
              style={[styles.input, !isCategoryValid && styles.invalidInput]}
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              placeholder="Condition (e.g. New, Expired)"
              style={[styles.input, !isConditionValid && styles.invalidInput]}
              value={condition}
              onChangeText={setCondition}
            />
            <TextInput
              placeholder="Details (optional)"
              style={[styles.input, styles.textArea]}
              value={details}
              onChangeText={setDetails}
              multiline
            />
            <TextInput
              placeholder="Reason for Donation (optional)"
              style={[styles.input, styles.textArea]}
              value={reason}
              onChangeText={setReason}
              multiline
            />

            {/* Display Selected Image */}
            {image && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
              </TouchableOpacity>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                <Text style={styles.imageButtonText}>
                  {image ? "Change Image" : "Upload Image"}
                </Text>
              </TouchableOpacity>




            </View>
            <TouchableOpacity style={styles.imageButton} onPress={handlePrescriptionImagePick}>
              <Text style={styles.imageButtonText}>
                {prescriptionImage ? "Change Prescription Image" : "Upload Prescription Image"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ display: "none" }} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      {!keyboardVisible && <BottomNav navigation={navigation} />}

      {/* Full Screen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: image }} style={styles.fullScreenImage} />
        </View>
      </Modal>
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
    backgroundColor: "#f8f8f8",
    height: "10rem",
    maxHeight: "10rem",
    minHeight: "5rem",
    overflow: "scroll",
    paddingBottom: 100,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  invalidInput: {
    borderColor: "red", // Red border for invalid inputs
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#09B5B6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#333",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    textAlign: "center",
    borderRadius: 10
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 25,
    backgroundColor: "black",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default DonorDonateMedicineScreen;
