import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { db, setDoc, doc } from "../../firebase/firebaseConfig";

const PatientAdditionalInfoScreen = ({ navigation, route }) => {
  const [idCardNumber, setIdCardNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userId } = route.params; // Get userId from navigation params


  const handleFinish = async () => {
    const idCardRegex = /^\d{5}-\d{7}-\d{1}$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!idCardNumber || !phoneNumber || !address) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
    if (!idCardRegex.test(idCardNumber)) {
      Alert.alert('Validation Error', 'Invalid ID card format (e.g., 37405-1234567-7).');
      return;
    }
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Validation Error', 'Invalid phone number.');
      return;
    }

    try {
      await setDoc(doc(db, "patients", userId), {
        idCardNumber,
        phoneNumber,
        address
      }, { merge: true });

      Alert.alert('Success', 'Patient info submitted successfully!');
      navigation.navigate('PatientDashboardScreen');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };


  const handleSelectLocation = () => {
    setIsModalVisible(true);
  };

  const setMapAddress = (selectedAddress) => {
    setAddress(selectedAddress);
    setIsModalVisible(false);
  };

  const useMapForAddress = () => {
    navigation.navigate('MapScreen', {
      latitude: 33.6844, // Set initial latitude (default)
      longitude: 73.0479, // Set initial longitude (default)
      adres: setMapAddress,
    });
    setIsModalVisible(false);
  };

  const handleUseCurrentLocation = async () => {
    navigation.navigate('MapScreen', {
      latitude: 33.6844,
      longitude: 73.0479,
      adres: setMapAddress,
    });
    setIsModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Patient Additional Information</Text>
        <TextInput
          style={styles.input}
          placeholder="ID Card Number (e.g. 37405-1234567-7)"
          value={idCardNumber}
          onChangeText={setIdCardNumber}
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Address or use map"
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <TouchableOpacity style={styles.mapButton} onPress={handleSelectLocation}>
          <Text style={styles.mapButtonText}>Select Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFinish}>
          <Text style={styles.buttonText}>FINISH</Text>
        </TouchableOpacity>

        {/* Modal for Location Selection */}
        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Location Input Method</Text>
              <TouchableOpacity onPress={handleUseCurrentLocation} style={styles.modalButton}>
                <Entypo name="location-pin" size={24} color="black" />
                <Text style={styles.modalButtonText}>Use my current location</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={useMapForAddress} style={styles.modalButton}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="black" />
                <Text style={styles.modalButtonText}>Select from Map</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#005A5A',
    marginBottom: 30,
    fontSize: 35,
    fontFamily: 'Katibeh-Regular',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderColor: '#005A5A',
    backgroundColor: '#f8f8f8',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#001F42',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 23,
    fontFamily: 'Katibeh-Regular',
  },
  mapButton: {
    backgroundColor: '#09B5B6',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'blue',
  },
});

export default PatientAdditionalInfoScreen;
