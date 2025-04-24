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
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";

const PatientDonateMedicineScreen = ({ navigation, onRequestSubmit }) => {
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [details, setDetails] = useState("");
  const [reason, setReason] = useState("");
  const [prescriptionImage, setPrescriptionImage] = useState(null); // Prescription image
  const [medicineImage, setMedicineImage] = useState(null); // Medicine image
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [isMedicineNameValid, setIsMedicineNameValid] = useState(true);
  const [isQuantityValid, setIsQuantityValid] = useState(true);
  const [isCategoryValid, setIsCategoryValid] = useState(true);
  const [isConditionValid, setIsConditionValid] = useState(true);
  const [isPrescriptionImageValid, setIsPrescriptionImageValid] =
    useState(true);
  const [isMedicineImageValid, setIsMedicineImageValid] = useState(true);

  const handleImagePick = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant permission to access the photo library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleSubmit = () => {
    setIsMedicineNameValid(!!medicineName);
    setIsQuantityValid(!!quantity);
    setIsCategoryValid(!!category);
    setIsConditionValid(!!condition);
    setIsPrescriptionImageValid(!!prescriptionImage);
    setIsMedicineImageValid(!!medicineImage);

    if (
      !medicineName ||
      !quantity ||
      !category ||
      !condition ||
      !prescriptionImage ||
      !medicineImage
    ) {
      Alert.alert(
        "Error",
        "Please fill all required fields and upload both images."
      );
      return;
    }

    Alert.alert("Request Submitted", "Your donation request has been sent");
    setMedicineName("");
    setQuantity("");
    setCategory("");
    setCondition("");
    setDetails("");
    setReason("");
    setPrescriptionImage(null);
    setMedicineImage(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Header navigation={navigation} />
          <View style={styles.content}>
            <Text style={styles.header}>Request for Medicine Donation</Text>

            <TextInput
              placeholder="Medicine Name"
              style={[
                styles.input,
                !isMedicineNameValid && styles.invalidInput,
              ]}
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

            {/* Prescription Image */}
            <Text style={styles.label}>Upload Prescription Image</Text>
            {prescriptionImage && (
              <Image
                source={{ uri: prescriptionImage }}
                style={styles.imagePreview}
              />
            )}
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => handleImagePick(setPrescriptionImage)}
            >
              <Text style={styles.imageButtonText}>
                {prescriptionImage ? "Change Image" : "Upload Image"}
              </Text>
            </TouchableOpacity>

            {/* Medicine Image */}
            <Text style={styles.label}>Upload Medicine Image</Text>
            {medicineImage && (
              <Image
                source={{ uri: medicineImage }}
                style={styles.imagePreview}
              />
            )}
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => handleImagePick(setMedicineImage)}
            >
              <Text style={styles.imageButtonText}>
                {medicineImage ? "Change Image" : "Upload Image"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      {!keyboardVisible && <BottomNav navigation={navigation} />}
    </KeyboardAvoidingView>
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
    minHeight:1000
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
    borderColor: "red",
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
    marginTop: 20,
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
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default PatientDonateMedicineScreen;
