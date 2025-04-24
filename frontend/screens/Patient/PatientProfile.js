// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   Button,
// //   Image,
// //   Pressable,
// //   Alert,
// //   StyleSheet,
// // } from "react-native";
// // import * as ImagePicker from "expo-image-picker";
// // import { Picker } from "@react-native-picker/picker";
// // import Header from "../../components/Header";
// // import BottomNav from "../../components/BottomNav";

// // const PatientProfile = ({ navigation }) => {
// //   const [profileInfo, setProfileInfo] = useState({
// //     name: "Test User",
// //     email: "user.one@example.com",
// //     location: "Islamabad, Pakistan",
// //     phone: "0317-6543210",
// //     dob: { day: 1, month: 0, year: 1995 }, // Default DOB
// //   });
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editedProfileInfo, setEditedProfileInfo] = useState({
// //     ...profileInfo,
// //   });
// //   const [selectedImage, setSelectedImage] = useState(null);

// //   const handleEditInfo = () => {
// //     setIsEditing(true);
// //   };

// //   const handleSaveInfo = () => {
// //     setProfileInfo(editedProfileInfo);
// //     setIsEditing(false);
// //     Alert.alert("Success", "Profile information updated successfully!");
// //   };

// //   const handleCancelEdit = () => {
// //     setIsEditing(false);
// //     setEditedProfileInfo({ ...profileInfo });
// //   };

// //   const handleChange = (field, value) => {
// //     setEditedProfileInfo((prevInfo) => ({
// //       ...prevInfo,
// //       [field]: value,
// //     }));
// //   };

// //   const pickImage = async () => {
// //     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

// //     if (!permission.granted) {
// //       Alert.alert(
// //         "Permission Required",
// //         "Please grant permission to access your gallery."
// //       );
// //       return;
// //     }

// //     let result = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       allowsEditing: true,
// //       aspect: [1, 1],
// //       quality: 1,
// //     });

// //     if (!result.canceled && result.assets && result.assets[0].uri) {
// //       setSelectedImage(result.assets[0].uri);
// //     } else {
// //       console.log("Image selection canceled or URI not available.");
// //     }
// //   };

// //   const removeImage = () => {
// //     setSelectedImage(null);
// //   };

// //   const years = Array.from({ length: 76 }, (_, i) => 1950 + i);
// //   const days = Array.from({ length: 31 }, (_, i) => i + 1);
// //   const months = [
// //     { label: "January", value: 0 },
// //     { label: "February", value: 1 },
// //     { label: "March", value: 2 },
// //     { label: "April", value: 3 },
// //     { label: "May", value: 4 },
// //     { label: "June", value: 5 },
// //     { label: "July", value: 6 },
// //     { label: "August", value: 7 },
// //     { label: "September", value: 8 },
// //     { label: "October", value: 9 },
// //     { label: "November", value: 10 },
// //     { label: "December", value: 11 },
// //   ];

// //   return (
// //     <View style={styles.container}>
// //       <Header navigation={navigation} />
// //       <View style={styles.content}>
// //         <Pressable onPress={pickImage} style={styles.imageContainer}>
// //           {selectedImage ? (
// //             <Image
// //               source={{ uri: selectedImage }}
// //               style={styles.profileImage}
// //             />
// //           ) : (
// //             <View style={styles.defaultImage}>
// //               <Text style={styles.imageText}>Select Image</Text>
// //             </View>
// //           )}
// //         </Pressable>

// //         {selectedImage && (
// //           <View style={styles.imageButtonsContainer}>
// //             <Button title="Remove" onPress={removeImage} />
// //             <Button title="Update" onPress={pickImage} />
// //           </View>
// //         )}

// //         <View style={styles.infoContainer}>
// //           {isEditing ? (
// //             <>
// //               <View style={styles.infoBox}>
// //                 <Text>📝</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   value={editedProfileInfo.name}
// //                   onChangeText={(text) => handleChange("name", text)}
// //                   placeholder="Name"
// //                 />
// //               </View>
// //               <View style={styles.infoBox}>
// //                 <Text>📧</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   value={editedProfileInfo.email}
// //                   onChangeText={(text) => handleChange("email", text)}
// //                   placeholder="Email"
// //                   keyboardType="email-address"
// //                 />
// //               </View>
// //               <View style={styles.infoBox}>
// //                 <Text>📍</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   value={editedProfileInfo.location}
// //                   onChangeText={(text) => handleChange("location", text)}
// //                   placeholder="Location"
// //                 />
// //               </View>
// //               <View style={styles.infoBox}>
// //                 <Text>📞</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   value={editedProfileInfo.phone}
// //                   onChangeText={(text) => handleChange("phone", text)}
// //                   placeholder="Phone Number"
// //                   keyboardType="phone-pad"
// //                 />
// //               </View>
// //               <View style={styles.infoBox}>
// //                 <Text>🎂</Text>
// //                 <View style={styles.datePickerContainer}>
// //                   <Picker
// //                     selectedValue={editedProfileInfo.dob.day}
// //                     style={styles.picker}
// //                     onValueChange={(itemValue) =>
// //                       handleChange("dob", {
// //                         ...editedProfileInfo.dob,
// //                         day: itemValue,
// //                       })
// //                     }
// //                   >
// //                     {days.map((day) => (
// //                       <Picker.Item
// //                         key={day}
// //                         label={day.toString()}
// //                         value={day}
// //                       />
// //                     ))}
// //                   </Picker>
// //                   <Picker
// //                     selectedValue={editedProfileInfo.dob.month}
// //                     style={styles.picker}
// //                     onValueChange={(itemValue) =>
// //                       handleChange("dob", {
// //                         ...editedProfileInfo.dob,
// //                         month: itemValue,
// //                       })
// //                     }
// //                   >
// //                     {months.map((month) => (
// //                       <Picker.Item
// //                         key={month.value}
// //                         label={month.label}
// //                         value={month.value}
// //                       />
// //                     ))}
// //                   </Picker>
// //                   <Picker
// //                     selectedValue={editedProfileInfo.dob.year}
// //                     style={styles.picker}
// //                     onValueChange={(itemValue) =>
// //                       handleChange("dob", {
// //                         ...editedProfileInfo.dob,
// //                         year: itemValue,
// //                       })
// //                     }
// //                   >
// //                     {years.map((year) => (
// //                       <Picker.Item
// //                         key={year}
// //                         label={year.toString()}
// //                         value={year}
// //                       />
// //                     ))}
// //                   </Picker>
// //                 </View>
// //               </View>

// //               <View style={styles.buttonContainer}>
// //                 <Button title="Save" onPress={handleSaveInfo} />
// //                 <Button title="Cancel" onPress={handleCancelEdit} />
// //               </View>
// //             </>
// //           ) : (
// //             <>
// //               <View style={styles.infoBox}>
// //                 <Text style={{fontSize:18}}>📝</Text>
// //                 <Text style={styles.text}>{profileInfo.name}</Text>
// //               </View>
// //               <View style={styles.infoBox}>
// //                 <Text style={{fontSize:18}}>📧</Text>
// //                 <Text style={styles.text}>{profileInfo.email}</Text>
// //               </View>
// //               <View style={styles.infoBox}>
// //                 <Text style={{fontSize:18}}>📍</Text>
// //                 <Text style={styles.text}>{profileInfo.location}</Text>
// //               </View>
// //               <View style={styles.infoBox}>
// //                 <Text style={{fontSize:18}}>📞</Text>
// //                 <Text style={styles.text}>{profileInfo.phone}</Text>
// //               </View>
// //               <View style={styles.infoBox}>
// //                 <Text style={{fontSize:18}}>🎂</Text>
// //                 <Text style={styles.text}>
// //                   {`${profileInfo.dob.day}-${
// //                     months[profileInfo.dob.month].label
// //                   }-${profileInfo.dob.year}`}
// //                 </Text>
// //               </View>

// //               <Pressable onPress={handleEditInfo} style={styles.editButton}>
// //                 <Text style={styles.editText}>Edit Info...</Text>
// //               </Pressable>
// //             </>
// //           )}
// //         </View>

// //         <View style={styles.actionButtonsContainer}>
// //         <Pressable
// //   style={styles.myDonationBtn}
// //   onPress={() => navigation.navigate("PatientDonationsList")}
// // >
// //   <Text style={styles.buttonText}>My Donations</Text>
// // </Pressable>

// // <Pressable
// //   style={styles.myRequestsBtn}
// //   onPress={() => navigation.navigate("PatientMyRequestsScreen")}
// // >
// //   <Text style={styles.buttonText}>My Requests</Text>
// // </Pressable>

// //         </View>
// //       </View>
// //       <BottomNav navigation={navigation} />
// //     </View>
// //   );
// // };

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Image,
//   Pressable,
//   Alert,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Picker } from "@react-native-picker/picker";
// import Header from "../../components/Header";
// import BottomNav from "../../components/BottomNav";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../../firebase/firebaseConfig";
// import { getAuth } from "firebase/auth";

// import axios from "axios";
// const PatientProfile = ({ navigation }) => {
//   const [profileInfo, setProfileInfo] = useState(null);
//   const [editedProfileInfo, setEditedProfileInfo] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const auth = getAuth();
//   const currentUser = auth.currentUser;
//   const userId = currentUser?.uid;
//   useEffect(() => {
//     if (userId) fetchUserProfile();
//   }, [userId]);

//   const fetchUserProfile = async () => {
//     try {
//       const docRef = doc(db, "patients", userId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setProfileInfo(data);
//         setEditedProfileInfo(data);
//         if (data.imageUrl) setSelectedImage(data.imageUrl);
//       }
//     } catch (err) {
//       console.error("❌ Failed to load profile:", err);
//     }
//   };

//   const handleChange = (field, value) => {
//     setEditedProfileInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleEditInfo = () => setIsEditing(true);

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setEditedProfileInfo({ ...profileInfo });
//   };

//   const handleSaveInfo = async () => {
//     try {
//       await updateDoc(doc(db, "patients", userId), editedProfileInfo);
//       setProfileInfo(editedProfileInfo);
//       setIsEditing(false);
//       Alert.alert("✅ Success", "Profile updated!");
//     } catch (err) {
//       console.error("❌ Failed to update profile:", err);
//       Alert.alert("Update Failed", "Could not save profile.");
//     }
//   };

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       return Alert.alert("Permission Required", "Enable gallery access.");
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled && result.assets?.[0]?.uri) {
//       const uri = result.assets[0].uri;
//       const imageUrl = await uploadImageToCloudinary(uri);
//       if (imageUrl) {
//         setSelectedImage(imageUrl);
//         setEditedProfileInfo((prev) => ({ ...prev, imageUrl }));
//         await updateDoc(doc(db, "patients", userId), { imageUrl });
//         Alert.alert("✅", "Image uploaded to Cloudinary!");
//       }
//     }
//   };

//   const uploadImageToCloudinary = async (uri) => {
//     try {
//       const response = await fetch(uri);
//       const blob = await response.blob();
//       const mimeType = blob.type;
//       const base64 = await readBlobAsBase64(blob);

//       const payload = new URLSearchParams({
//         file: `data:${mimeType};base64,${base64}`,
//         upload_preset: "ml_default",
//       });

//       const res = await axios.post(
//         "https://api.cloudinary.com/v1_1/dvgfilxns/image/upload",
//         payload,
//         { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//       );

//       return res.data.secure_url;
//     } catch (err) {
//       console.error("❌ Cloudinary upload failed:", err);
//       Alert.alert("Upload Failed", "Could not upload image.");
//       return null;
//     }
//   };

//   const readBlobAsBase64 = (blob) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result.split(",")[1];
//         resolve(base64String);
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   const years = Array.from({ length: 76 }, (_, i) => 1950 + i);
//   const days = Array.from({ length: 31 }, (_, i) => i + 1);
//   const months = [
//     { label: "January", value: 0 },
//     { label: "February", value: 1 },
//     { label: "March", value: 2 },
//     { label: "April", value: 3 },
//     { label: "May", value: 4 },
//     { label: "June", value: 5 },
//     { label: "July", value: 6 },
//     { label: "August", value: 7 },
//     { label: "September", value: 8 },
//     { label: "October", value: 9 },
//     { label: "November", value: 10 },
//     { label: "December", value: 11 },
//   ];

//   if (!profileInfo) return <Text>Loading...</Text>;

//   return (<>
//     <ScrollView style={styles.container}>
//       <Header navigation={navigation} />
//       <View style={styles.content}>
//         <Pressable onPress={pickImage} style={styles.imageContainer}>
//           {selectedImage ? (
//             <Image source={{ uri: selectedImage }} style={styles.profileImage} />
//           ) : (
//             <View style={styles.defaultImage}>
//               <Text style={styles.imageText}>Select Image</Text>
//             </View>
//           )}
//         </Pressable>

//         {isEditing ? (
//           <>
//             <TextInput
//               style={styles.input}
//               value={editedProfileInfo.name}
//               onChangeText={(text) => handleChange("name", text)}
//               placeholder="Name"
//             />
//             <TextInput
//               style={styles.input}
//               value={editedProfileInfo.email}
//               onChangeText={(text) => handleChange("email", text)}
//               placeholder="Email"
//               keyboardType="email-address"
//             />
//             <TextInput
//               style={styles.input}
//               value={editedProfileInfo.phone}
//               onChangeText={(text) => handleChange("phone", text)}
//               placeholder="Phone"
//               keyboardType="phone-pad"
//             />
//             <TextInput
//               style={styles.input}
//               value={editedProfileInfo.location}
//               onChangeText={(text) => handleChange("location", text)}
//               placeholder="Location"
//             />

//             {/* DOB Picker */}
//             <View style={styles.datePickerContainer}>
//               <Picker
//                 selectedValue={editedProfileInfo.dob?.day}
//                 style={styles.picker}
//                 onValueChange={(day) =>
//                   handleChange("dob", { ...editedProfileInfo.dob, day })
//                 }
//               >
//                 {days.map((d) => (
//                   <Picker.Item key={d} label={d.toString()} value={d} />
//                 ))}
//               </Picker>
//               <Picker
//                 selectedValue={editedProfileInfo.dob?.month}
//                 style={styles.picker}
//                 onValueChange={(month) =>
//                   handleChange("dob", { ...editedProfileInfo.dob, month })
//                 }
//               >
//                 {months.map((m) => (
//                   <Picker.Item key={m.value} label={m.label} value={m.value} />
//                 ))}
//               </Picker>
//               <Picker
//                 selectedValue={editedProfileInfo.dob?.year}
//                 style={styles.picker}
//                 onValueChange={(year) =>
//                   handleChange("dob", { ...editedProfileInfo.dob, year })
//                 }
//               >
//                 {years.map((y) => (
//                   <Picker.Item key={y} label={y.toString()} value={y} />
//                 ))}
//               </Picker>
//             </View>

//             <Button title="Save" onPress={handleSaveInfo} />
//             <Button title="Cancel" onPress={handleCancelEdit} />
//           </>
//         ) : (
//           <>
//             <Text style={styles.infoText}>👤 {profileInfo.fullName}</Text>
//             <Text style={styles.infoText}>📧 {profileInfo.email}</Text>
//             <Text style={styles.infoText}>📍 {profileInfo.address}</Text>
//             <Text style={styles.infoText}>📞 {profileInfo.phoneNumber}</Text>
//             <Text style={styles.infoText}>
//               🎂 {profileInfo.dob?.day}/{profileInfo.dob?.month + 1}/{profileInfo.dob?.year}
//             </Text>

//             <Button title="Edit Profile" onPress={handleEditInfo} />
//           </>
//         )}
//       </View>
//     </ScrollView>
//     <BottomNav navigation={navigation} />
//   </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   imageContainer: {
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#ccc",
//   },
//   defaultImage: {
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     backgroundColor: "#ddd",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   imageText: {
//     color: "#666",
//     fontSize: 14,
//   },
//   imageButtonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "60%",
//     marginVertical: 10,
//   },
//   infoContainer: {
//     width: "80%",
//     alignItems: "center",
//   },
//   infoBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     width: "100%",
//     marginVertical: 5,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     borderColor: "#09B5B6",
//   },
//   text: {
//     fontSize: 16,
//     color: "#333",
//     marginLeft: 10,
//   },
//   editButton: {
//     marginTop: 10,
//   },
//   editText: {
//     color: "darkblue",
//     fontSize: 18,
//     textDecorationLine: "underline",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//     marginTop: 15,
//   },
//   actionButtonsContainer: {
//     flexDirection: "column",
//     gap: 10,
//     marginTop: 20,
//     width: "50%",
//   },
//   datePickerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//     width: "100%",
//   },
//   picker: {
//     height: 30,
//     width: 120,
//   },
//   actionButtonsContainer: {
//     flexDirection: "column",
//     gap: 15,
//     marginTop: 30,
//     width: "70%",
//   },
//   myDonationBtn: {
//     backgroundColor: "#09B5B6",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   myRequestsBtn: {
//     backgroundColor: "#09B5B6",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
// });

// export default PatientProfile;
// keep your existing imports...


import React, { useEffect, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import axios from "axios";

const PatientProfile = ({ navigation }) => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [editedProfileInfo, setEditedProfileInfo] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const docRef = doc(db, "patients", userId);
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

  const handleChange = (field, value) => {
    setEditedProfileInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditInfo = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfileInfo({ ...profileInfo });
  };

  const handleSaveInfo = async () => {
    try {
      await updateDoc(doc(db, "patients", userId), editedProfileInfo);
      setProfileInfo(editedProfileInfo);
      setIsEditing(false);
      Alert.alert("✅ Success", "Profile updated!");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      Alert.alert("Update Failed", "Could not save profile.");
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission Required", "Enable gallery access.");
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
        setEditedProfileInfo((prev) => ({ ...prev, imageUrl }));
        await updateDoc(doc(db, "patients", userId), { imageUrl });
        Alert.alert("✅", "Image uploaded to Cloudinary!");
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

  if (!profileInfo) return <Text style={{ textAlign: "center", marginTop: 50 }}>Loading Profile...</Text>;

  return (
    <>
      <ScrollView style={styles.container}>
        <Header navigation={navigation} />
        <View style={styles.content}>
          <Pressable onPress={pickImage} style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultImage}>
                <Text style={styles.imageText}>Select Image</Text>
              </View>
            )}
          </Pressable>

          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={editedProfileInfo.fullName}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Full Name"
              />
              <TextInput
                style={styles.input}
                value={editedProfileInfo.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={editedProfileInfo.phoneNumber}
                onChangeText={(text) => handleChange("phone", text)}
                placeholder="Phone"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                value={editedProfileInfo.address}
                onChangeText={(text) => handleChange("location", text)}
                placeholder="Location"
              />

              {/* DOB Pickers */}
              <View style={styles.datePickerContainer}>
                <Picker
                  selectedValue={editedProfileInfo.dob?.day}
                  style={styles.picker}
                  onValueChange={(day) =>
                    handleChange("dob", { ...editedProfileInfo.dob, day })
                  }
                >
                  {days.map((d) => (
                    <Picker.Item key={d} label={d.toString()} value={d} />
                  ))}
                </Picker>
                <Picker
                  selectedValue={editedProfileInfo.dob?.month}
                  style={styles.picker}
                  onValueChange={(month) =>
                    handleChange("dob", { ...editedProfileInfo.dob, month })
                  }
                >
                  {months.map((m) => (
                    <Picker.Item key={m.value} label={m.label} value={m.value} />
                  ))}
                </Picker>
                <Picker
                  selectedValue={editedProfileInfo.dob?.year}
                  style={styles.picker}
                  onValueChange={(year) =>
                    handleChange("dob", { ...editedProfileInfo.dob, year })
                  }
                >
                  {years.map((y) => (
                    <Picker.Item key={y} label={y.toString()} value={y} />
                  ))}
                </Picker>
              </View>


              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSaveInfo} />
                <Button title="Cancel" onPress={handleCancelEdit} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoBox}>
                <Text style={{ fontSize: 18 }}>📝</Text>
                <Text style={styles.text}>{profileInfo.fullName}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={{ fontSize: 18 }}>📧</Text>
                <Text style={styles.text}>{profileInfo.email}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={{ fontSize: 18 }}>📍</Text>
                <Text style={styles.text}>{profileInfo.address}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={{ fontSize: 18 }}>📞</Text>
                <Text style={styles.text}>{profileInfo.phoneNumber}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={{ fontSize: 18 }}>🎂</Text>
                <Text style={styles.text}>
                  {`${profileInfo.dob.day}-${months[profileInfo.dob.month].label
                    }-${profileInfo.dob.year}`}
                </Text>
              </View>

              <Pressable onPress={handleEditInfo} style={styles.editButton}>
                <Text style={styles.editText}>Edit Info...</Text>
              </Pressable>
            </>
          )}


          <View style={styles.actionButtonsContainer}>
            <Pressable
              style={styles.myDonationBtn}
              onPress={() => navigation.navigate("PatientMedicineList")}
            >
              <Text style={styles.buttonText}>Medicines</Text>
            </Pressable>

            <Pressable
              style={styles.myRequestsBtn}
              onPress={() => navigation.navigate("PatientMyRequestsScreen")}
            >
              <Text style={styles.buttonText}>My Requests</Text>
            </Pressable>

          </View>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} />
    </>
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
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default PatientProfile;
