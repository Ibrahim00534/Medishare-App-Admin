import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from 'react-native';
import Header from '../../components/Header'; // Adjust the path if needed
import BottomNav from '../../components/BottomNav'; // Adjust the path if needed
import { db } from '../../firebase/firebaseConfig'; // your firestore instance
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../firebase/firebaseConfig"; // Adjust the path if needed

const RequestMedicineScreen = ({ navigation, route }) => {
  const { medicine } = route.params;
  const [quantity, setQuantity] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery');
  const [priority, setPriority] = useState('General');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientMobile, setPatientMobile] = useState('');
  // Handle keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const increaseQuantity = () => {
    if (quantity < 30) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const toggleDeliveryMethod = (method) => {
    setDeliveryMethod(method);
  };
  const auth = getAuth(firebaseApp);
  // Call this on request button press
  const handleRequest = async () => {
    const user = auth.currentUser;
    try {
      await addDoc(collection(db, 'PatientRequests'), {
        medicineId: medicine.id || null,
        medicineName: medicine.medicineName,
        donorName: medicine.donorName,
        quantity,
        deliveryMethod,
        patientName,
        patientEmail,
        patientAddress,
        patientMobile,
        priority,
        status: 'Pending',
        requestedAt: serverTimestamp(),
        requestedBy: user.uid
      });
      alert('Request submitted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request.');
    }
  };


  return (
    <View style={styles.container}>
      {/* Add Header Component */}
      <Header navigation={navigation} />

      <View style={styles.content}>
        <View style={styles.medicineDetails}>
          {/* Dummy Image for Medicine */}
          <Image
            source={{ uri: medicine.imageUrl }}
            style={styles.medicineImage}
          />

          <View style={styles.detailsTextContainer}>
            <Text style={{ fontWeight: 'bold' }}>Name: {medicine.medicineName}</Text>
            <Text style={{ fontWeight: 'bold' }}>Donor: {medicine.donorName}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityNumber}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.patientDetails}>
          <Text>Patient Details</Text>
          <TextInput
            placeholder="Name"
            style={styles.input}
            value={patientName}
            onChangeText={setPatientName}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={patientEmail}
            onChangeText={setPatientEmail}
          />
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={patientAddress}
            onChangeText={setPatientAddress}
          />
          <TextInput
            placeholder="Mobile No"
            style={styles.input}
            value={patientMobile}
            onChangeText={setPatientMobile}
            keyboardType="phone-pad"
          />

        </View>
        <View style={styles.priorityContainer}>
          <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Priority </Text>
          {['Critical', 'General', 'Cronical'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setPriority(item)}
              style={[
                styles.priorityOption,
                priority === item && styles.selectedOption,
              ]}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.deliveryOptions}>
          <TouchableOpacity
            style={[styles.option, deliveryMethod === 'Delivery' && styles.selectedOption]}
            onPress={() => toggleDeliveryMethod('Delivery')}
          >
            <Text>Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, deliveryMethod === 'Pickup' && styles.selectedOption]}
            onPress={() => toggleDeliveryMethod('Pickup')}
          >
            <Text>Pickup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.requestButton} onPress={() => handleRequest()}>
            <Text style={styles.buttonText}>Request Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add BottomNav Component */}
      {!isKeyboardVisible && <BottomNav navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  medicineDetails: {
    flexDirection: 'row', // Align the image and text side by side
    alignItems: 'center', // Center vertically
    marginBottom: 20,
  },
  medicineImage: {
    width: 100,
    height: 100,
    marginRight: 15, // Space between image and text
    borderRadius: 10, // Optional: round the image corners
  },
  detailsTextContainer: {
    flex: 1, // Make this take the remaining space
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 20,
  },
  quantityNumber: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  patientDetails: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  deliveryOptions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  option: {
    padding: 10,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#09B5B6',
    borderColor: '#07A1A2',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  requestButton: {
    backgroundColor: '#09B5B6',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  priorityContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  priorityOption: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },

});

export default RequestMedicineScreen;
