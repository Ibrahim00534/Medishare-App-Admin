
import React, { useState } from 'react';
import { useEffect } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Table,
  Modal,
} from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { auth, db, createUserWithEmailAndPassword } from "../firebase/firebaseConfig"; // Adjust path if needed
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const Riders = () => {
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderEmail, setNewRiderEmail] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderAddress, setNewRiderAddress] = useState('');
  const [newRiderCNIC, setNewRiderCNIC] = useState('');
  const [newRiderPassword, setNewRiderPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [donationId, setDonationId] = useState('');

  const [existingRiders, setExistingRiders] = useState([]);


  useEffect(() => {
    const fetchRiders = async () => {
      const querySnapshot = await getDocs(collection(db, "riders"));
      const ridersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExistingRiders(ridersList);
    };

    fetchRiders();
  }, []);

  const handleAddRider = async () => {
    console.log("Starting handleAddRider...");

    if (!newRiderName || !newRiderEmail || !newRiderPhone || !newRiderAddress || !newRiderCNIC || !newRiderPassword) {
      console.log("New Rider Details:", {
        newRiderName,
        newRiderEmail,
        newRiderPhone,
        newRiderAddress,
        newRiderCNIC,
        newRiderPassword
      });

      setError("All fields are required");
      return;
    }

    // ✅ Validate Phone Number (11 digits)
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(newRiderPhone)) {
      setError("Phone number must be 11 digits.");
      return;
    }

    // ✅ Validate CNIC Format (12345-1234567-1)
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(newRiderCNIC)) {
      setError("CNIC must be in the format 12345-1234567-1.");
      return;
    }

    // ✅ Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRiderEmail)) {
      setError("Invalid email address format.");
      return;
    }

    try {
      console.log("Checking if email exists in Firestore...");

      // ✅ Check if Email is Unique in Firestore
      const ridersRef = collection(db, "riders");
      const querySnapshot = await getDocs(ridersRef);
      const emailExists = querySnapshot.docs.some((doc) => doc.data().email === newRiderEmail);

      if (emailExists) {
        setError("This email is already registered.");
        return;
      }

      console.log("Creating user in Firebase Authentication...");

      // ✅ Step 1: Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, newRiderEmail, newRiderPassword);
      const user = userCredential.user;

      console.log("User created:", user.uid);

      // ✅ Step 2: Add Rider Data to Firestore
      const docRef = await addDoc(collection(db, "riders"), {
        uid: user.uid, // Store user ID for reference
        name: newRiderName,
        email: newRiderEmail,
        phone: newRiderPhone,
        address: newRiderAddress,
        cnic: newRiderCNIC,
        status: "Active",
        assignedDonations: [],
      });

      console.log("Rider added with ID:", docRef.id);

      setExistingRiders([...existingRiders, {
        id: docRef.id,
        uid: user.uid,
        name: newRiderName,
        email: newRiderEmail,
        phone: newRiderPhone,
        address: newRiderAddress,
        cnic: newRiderCNIC,
        status: "Active",
        assignedDonations: [],
      }]);

      // ✅ Clear Input Fields
      setNewRiderName('');
      setNewRiderEmail('');
      setNewRiderPhone('');
      setNewRiderAddress('');
      setNewRiderCNIC('');
      setNewRiderPassword('');
      setError('');
    } catch (error) {
      console.error("Error adding rider:", error);
      setError("Failed to add rider. Try again.");
    }
  };

  // const handleUnassignDonation = async (donationToRemove) => {
  //   const confirm = window.confirm(`Are you sure you want to unassign donation ID "${donationToRemove}" from this rider?`);

  //   if (!confirm) return;

  //   try {
  //     const updatedDonations = selectedRider.assignedDonations.filter(
  //       (donationId) => donationId !== donationToRemove
  //     );

  //     const riderRef = doc(db, "riders", selectedRider.id);
  //     await updateDoc(riderRef, {
  //       assignedDonations: updatedDonations,
  //     });

  //     const updatedRiders = existingRiders.map((rider) =>
  //       rider.id === selectedRider.id
  //         ? { ...rider, assignedDonations: updatedDonations }
  //         : rider
  //     );

  //     setExistingRiders(updatedRiders);
  //     setSelectedRider({ ...selectedRider, assignedDonations: updatedDonations });

  //     console.log("Donation unassigned successfully!");
  //   } catch (error) {
  //     console.error("Error unassigning donation: ", error);
  //   }
  // };

  const handleUnassignDonation = async (donationToRemove) => {
    const confirm = window.confirm(`Are you sure you want to unassign donation ID "${donationToRemove}" from this rider?`);

    if (!confirm) return;

    try {
      const updatedDonations = selectedRider.assignedDonations.filter(
        (donationId) => donationId !== donationToRemove
      );

      const newNotification = {
        message: `Donation ID "${donationToRemove}" has been unassigned from you.`,
        timestamp: new Date(),
        type: "unassignment"
      };

      const riderRef = doc(db, "riders", selectedRider.id);
      await updateDoc(riderRef, {
        assignedDonations: updatedDonations,
        notifications: [...(selectedRider.notifications || []), newNotification]
      });

      const updatedRiders = existingRiders.map((rider) =>
        rider.id === selectedRider.id
          ? {
            ...rider,
            assignedDonations: updatedDonations,
            notifications: [...(rider.notifications || []), newNotification]
          }
          : rider
      );

      setExistingRiders(updatedRiders);
      setSelectedRider({
        ...selectedRider,
        assignedDonations: updatedDonations,
        notifications: [...(selectedRider.notifications || []), newNotification]
      });

      console.log("Donation unassigned and notification sent!");
    } catch (error) {
      console.error("Error unassigning donation: ", error);
    }
  };

  const handleRemoveRider = async (riderId, riderUid) => {
    try {
      // Step 1: Delete rider from Firestore
      await deleteDoc(doc(db, "riders", riderId));

      // Step 2: Call backend API to remove the user from Firebase Authentication
      await fetch("/remove-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: riderUid }),
      });

      // Update local state
      setExistingRiders(existingRiders.filter((rider) => rider.id !== riderId));

      console.log("Rider deleted successfully!");
    } catch (error) {
      console.error("Error deleting rider:", error);
    }
  };


  const handleOpenAssignModal = (rider) => {
    setSelectedRider(rider);
    setShowAssignModal(true);
  };


  // const handleAssignDonation = async () => {
  //   if (!donationId) {
  //     alert("Please enter a donation ID");
  //     return;
  //   }

  //   try {
  //     const riderRef = doc(db, "riders", selectedRider.id);
  //     const updatedDonations = [...selectedRider.assignedDonations, donationId];

  //     await updateDoc(riderRef, {
  //       assignedDonations: updatedDonations,
  //     });

  //     setExistingRiders(existingRiders.map(rider =>
  //       rider.id === selectedRider.id ? { ...rider, assignedDonations: updatedDonations } : rider
  //     ));

  //     setShowAssignModal(false);
  //     setDonationId('');
  //     console.log("Donation assigned successfully!");
  //   } catch (error) {
  //     console.error("Error assigning donation: ", error);
  //   }
  // };
  const handleAssignDonation = async () => {
    if (!donationId) {
      alert("Please enter a donation ID");
      return;
    }

    try {
      const riderRef = doc(db, "riders", selectedRider.id);
      const updatedDonations = [...selectedRider.assignedDonations, donationId];

      // Create the notification object
      const newNotification = {
        message: `You have been assigned donation ID "${donationId}"`,
        timestamp: new Date(),
        type: "assignment"
      };

      await updateDoc(riderRef, {
        assignedDonations: updatedDonations,
        notifications: [...(selectedRider.notifications || []), newNotification]
      });

      setExistingRiders(existingRiders.map(rider =>
        rider.id === selectedRider.id
          ? {
            ...rider,
            assignedDonations: updatedDonations,
            notifications: [...(rider.notifications || []), newNotification]
          }
          : rider
      ));

      setSelectedRider({
        ...selectedRider,
        assignedDonations: updatedDonations,
        notifications: [...(selectedRider.notifications || []), newNotification]
      });

      setShowAssignModal(false);
      setDonationId('');
      console.log("Donation assigned and notification sent!");
    } catch (error) {
      console.error("Error assigning donation: ", error);
    }
  };


  const viewRiderInfo = (rider) => {
    setSelectedRider(rider);
    setShowInfoModal(true);
  };

  return (
    <Container>
      <Row>
        <Col xs={8} md={6} lg={7}>
          <h5>Existing Riders</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Status</th>
                <th>Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {existingRiders.map((rider, index) => (
                <tr key={rider.id}>
                  <td>{index + 1}</td>
                  <td>{rider.email}</td>
                  <td>{rider.status}</td>
                  <td>
                    <Button variant="secondary" size="sm" onClick={() => viewRiderInfo(rider)}>
                      More Info
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveRider(rider.id)}>
                      Remove
                    </Button>
                    {' '}
                    <Button variant="primary" size="sm" onClick={() => handleOpenAssignModal(rider)} disabled={rider.status === 'Inactive'}>
                      Assign
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col xs={12} md={6} lg={7}>
          <div className="text-center mb-4">
            <h3 className="fw-bold">Add New Rider</h3>
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <Form>
            <Form.Group controlId="addRiderName" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={newRiderName}
                onChange={(e) => setNewRiderName(e.target.value)}
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="addRiderEmail" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={newRiderEmail}
                onChange={(e) => setNewRiderEmail(e.target.value)}
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="addRiderPhoneNumber" className="mb-3">
              <Form.Control
                type="number"
                placeholder="Enter Phone Number"
                value={newRiderPhone}
                onChange={(e) => setNewRiderPhone(e.target.value)}
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="addRiderAddress" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Address"
                value={newRiderAddress}
                onChange={(e) => setNewRiderAddress(e.target.value)}
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group controlId="addRiderCNIC" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter CNIC (12345-1234567-1)"
                value={newRiderCNIC}
                onChange={(e) => setNewRiderCNIC(e.target.value)}
                className="shadow-sm"
              />
            </Form.Group>

            <Form.Group controlId="addRiderPassword" className="mb-3">
              <InputGroup>
                <FormControl
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={newRiderPassword}
                  onChange={(e) => setNewRiderPassword(e.target.value)}
                  className="shadow-sm"
                />
                <InputGroup.Text
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ cursor: 'pointer' }}
                >
                  {passwordVisible ? <EyeOff /> : <Eye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" className="w-100 py-2" onClick={handleAddRider}>
              Add Rider
            </Button>
          </Form>
        </Col>
      </Row>

      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rider Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRider && (
            <ul>
              <li><strong>Name:</strong> {selectedRider.name}</li>
              <li><strong>Email:</strong> {selectedRider.email}</li>
              <li><strong>Phone:</strong> {selectedRider.phone}</li>
              <li><strong>Address:</strong> {selectedRider.address}</li>
              <li><strong>CNIC:</strong> {selectedRider.cnic}</li>
              <li><strong>Status:</strong> {selectedRider.status}</li>
              <li>
                <strong>Assigned Donations:</strong>
                {selectedRider.assignedDonations.length > 0 ? (
                  <ul className="mt-2">
                    {selectedRider.assignedDonations.map((donation) => (
                      <li key={donation} className="d-flex justify-content-between align-items-center">
                        <span>{donation}</span>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleUnassignDonation(donation)}
                        >
                          Unassign
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="ms-2">None</span>
                )}
              </li>

            </ul>
          )}
        </Modal.Body>
      </Modal>
      {/* Assign Donation Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Donation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter Order ID"
            value={donationId}
            onChange={(e) => setDonationId(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAssignDonation}>Assign</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Riders;