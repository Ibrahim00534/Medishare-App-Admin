import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const statusOptions = [
    'Not Approved By Admin Yet',
    'Approved',
    'Rejected',
    'Ordered',
    'Sold',
    'Delivered',
    'Finished',
  ];

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'medicineDonations'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDonations(data);
      } catch (error) {
        console.error('❌ Error fetching donations:', error);
      }
    };

    fetchDonations();
  }, []);

  const handleStatusChange = async (donationId, userId, newStatus) => {
    try {
      const donationRef = doc(db, 'medicineDonations', donationId);
      await updateDoc(donationRef, { status: newStatus });

      const userRef = doc(db, 'donors', userId);
      const notification = {
        message: `Your donation status has been updated to: ${newStatus}`,
        timestamp: new Date().toISOString(),
        donationID: donationId
      };
      await updateDoc(userRef, {
        notifications: arrayUnion(notification)
      });

      setDonations(prev =>
        prev.map(d => (d.id === donationId ? { ...d, status: newStatus } : d))
      );
    } catch (error) {
      console.error('❌ Error updating status:', error);
    }
  };

  const handleMoreInfo = (donation) => {
    setSelectedDonation(donation);
  };

  const closeModal = () => {
    setSelectedDonation(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Medicine Donations</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Image</th>
              <th>Prescription</th>
              <th>Donor ID</th>
              <th>Medicine</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Status</th>
              <th>Change Status</th>
              <th> Info</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(donation => (
              <tr key={donation.id}>
                <td>
                  <img
                    src={donation.imageUrl || 'https://via.placeholder.com/80x80.png?text=No+Image'}
                    alt="med"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                  />
                </td>
                <td>
                  <img
                    src={donation.prescriptionImageUrl || 'https://via.placeholder.com/80x80.png?text=No+Image'}
                    alt="med"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                  />
                </td>
                <td>{donation.userId || 'N/A'}</td>
                <td>{donation.medicineName || 'N/A'}</td>
                <td>{donation.quantity || 'N/A'}</td>
                <td>
                  {donation.createdAt?.seconds
                    ? new Date(donation.createdAt.seconds * 1000).toLocaleString()
                    : 'N/A'}
                </td>
                <td>
                  <span className="badge bg-info text-dark">{donation.status || 'Pending'}</span>
                </td>
                <td>
                  <select
                    value={donation.status}
                    className="form-select"
                    onChange={(e) =>
                      handleStatusChange(donation.id, donation.userId, e.target.value)
                    }
                  >
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleMoreInfo(donation)}
                  >
                    More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* More Info Modal */}
      {selectedDonation && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Donation Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <img
                  src={selectedDonation.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt="donation"
                  className="img-fluid mb-3"
                />
                <img
                  src={selectedDonation.prescriptionImageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt="donation"
                  className="img-fluid mb-3"
                />
                <ul className="list-group">
                  <li className="list-group-item"><strong>Medicine Name:</strong> {selectedDonation.medicineName}</li>
                  <li className="list-group-item"><strong>Quantity:</strong> {selectedDonation.quantity}</li>
                  <li className="list-group-item"><strong>Category:</strong> {selectedDonation.category}</li>
                  <li className="list-group-item"><strong>Condition:</strong> {selectedDonation.condition}</li>
                  <li className="list-group-item"><strong>Details:</strong> {selectedDonation.details}</li>
                  <li className="list-group-item"><strong>Reason:</strong> {selectedDonation.reason}</li>
                  <li className="list-group-item"><strong>Status:</strong> {selectedDonation.status}</li>
                  <li className="list-group-item"><strong>Created At:</strong> {selectedDonation.createdAt?.seconds ? new Date(selectedDonation.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</li>
                  <li className="list-group-item"><strong>User ID:</strong> {selectedDonation.userId}</li>
                  <li className="list-group-item"><strong>Donation ID:</strong> {selectedDonation.id}</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;
