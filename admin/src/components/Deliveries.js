import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';  // Path to Firebase configuration file

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch data from Firestore
    const fetchDeliveries = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'orders')); // Fetch orders from Firestore
        const deliveriesData = snapshot.docs.map((doc) => doc.data());
        setDeliveries(deliveriesData);
        console.log(deliveriesData); // Check if data is being fetched

      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDelivery(null);
  };

  // Function to format date strings
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Delivered To</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.ulid}>
              <td>{delivery.id}</td>
              <td>{delivery.deliveryInfo.name}</td>
              <td>{delivery.deliveryInfo.address}</td>
              <td>{delivery.deliveryInfo.contactInfo}</td>
              <td>
                <Button onClick={() => handleViewDelivery(delivery)}>View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for delivery details */}
      {selectedDelivery && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delivery Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
  {/* Section 1: Delivery Summary */}
  <h5>🗓️ Delivery Summary</h5>
  <p><strong>Delivered At:</strong> {formatDate(selectedDelivery.deliveredAt?.seconds * 1000)}</p>
  <p><strong>Delivery Status:</strong> {selectedDelivery.deliveryStatus}</p>
  <p><strong>Delivery Method:</strong> {selectedDelivery.deliveryMethod}</p>

  {/* Section 2: Receiver Information */}
  <h5>📦 Receiver Information</h5>
  <p><strong>Name:</strong> {selectedDelivery.deliveryInfo?.name}</p>
  <p><strong>Address:</strong> {selectedDelivery.deliveryInfo?.address}</p>
  <p><strong>Contact Info:</strong> {selectedDelivery.deliveryInfo?.contactInfo}</p>
  <p><strong>ID Card:</strong> {selectedDelivery.deliveryInfo?.idCard}</p>

  {/* Section 3: Donor & Medicine Info */}
  <h5>💊 Donor & Medicine Details</h5>
  <p><strong>Donor Name:</strong> {selectedDelivery.donorName}</p>
  <p><strong>Medicine ID:</strong> {selectedDelivery.medicineId}</p>
  <p><strong>Medicine Name:</strong> {selectedDelivery.medicineName}</p>
  <p><strong>Quantity:</strong> {selectedDelivery.quantity}</p>

  {/* Section 4: Patient Details */}
  <h5>🧑‍⚕️ Patient Information</h5>
  <p><strong>Name:</strong> {selectedDelivery.patientName}</p>
  <p><strong>Email:</strong> {selectedDelivery.patientEmail}</p>
  <p><strong>Mobile:</strong> {selectedDelivery.patientMobile}</p>
  <p><strong>Address:</strong> {selectedDelivery.patientAddress}</p>
  <p><strong>Priority:</strong> {selectedDelivery.priority}</p>

  {/* Section 5: Order & Request Info */}
  <h5>📅 Order Info</h5>
  <p><strong>Order Created At:</strong> {formatDate(selectedDelivery.orderCreatedAt?.seconds * 1000)}</p>
  <p><strong>Requested At:</strong> {formatDate(selectedDelivery.requestedAt?.seconds * 1000)}</p>
  <p><strong>Requested By (User ID):</strong> {selectedDelivery.requestedBy}</p>

  {/* Section 6: Rider Feedback */}
  <h5>⭐ Rider Review</h5>
  <p><strong>Comment:</strong> {selectedDelivery.riderReview?.comment}</p>
  <p><strong>Rating:</strong> {selectedDelivery.riderReview?.rating}</p>
  <p><strong>Status:</strong> {selectedDelivery.status}</p>

  {/* Section 7: Verification */}
  <h5>✔️ Verification Checks</h5>
  <p><strong>All Checks Done:</strong> {selectedDelivery.verificationChecks?.allChecksDone ? 'Yes' : 'No'}</p>
  <p><strong>CNIC Verified:</strong> {selectedDelivery.verificationChecks?.cnicVerified ? 'Yes' : 'No'}</p>
  <p><strong>Prescription Checked:</strong> {selectedDelivery.verificationChecks?.prescriptionChecked ? 'Yes' : 'No'}</p>
</Modal.Body>


          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            {/* Additional action buttons can be added here */}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Deliveries;
