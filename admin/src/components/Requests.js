import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  addDoc
} from 'firebase/firestore';
import { firebaseApp } from '../firebase/firebaseConfig';
import { Timestamp } from 'firebase/firestore';

const Requests = () => {
  const db = getFirestore(firebaseApp);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const priorityOrder = {
    Critical: 1,
    Chronic: 2,
    General: 3,
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'PatientRequests'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  // const handleAction = async (request, newStatus) => {
  //   try {
  //     // 1. Update status in PatientRequests
  //     const requestRef = doc(db, 'PatientRequests', request.id);
  //     await updateDoc(requestRef, { status: newStatus });

  //     // 2. Prepare notification message with medicine name
  //     const message =
  //       newStatus === 'Approved'
  //         ? `Your request for ${request.medicineName} has been approved.`
  //         : `Your request for ${request.medicineName} has been rejected.`;

  //     const notification = {
  //       requestId: request.id,
  //       medicineName: request.medicineName,
  //       status: newStatus,
  //       message,
  //       time: Timestamp.now(),
  //     };

  //     // 3. Add to patient's notifications
  //     const patientRef = doc(db, 'patients', request.requestedBy);
  //     await updateDoc(patientRef, {
  //       notifications: arrayUnion(notification),
  //     });

  //     // 4. Optimistically update UI
  //     setRequests((prev) =>
  //       prev.map((r) =>
  //         r.id === request.id ? { ...r, status: newStatus } : r
  //       )
  //     );
  //   } catch (error) {
  //     console.error(`Error updating request:`, error);
  //     alert('Failed to update request.');
  //   }
  // };

  const handleAction = async (request, newStatus) => {
    try {
      const requestRef = doc(db, 'PatientRequests', request.id);
      await updateDoc(requestRef, { status: newStatus });
  
      const message =
        newStatus === 'Approved'
          ? `Your request for ${request.medicineName} has been approved.`
          : `Your request for ${request.medicineName} has been rejected.`;
  
      const notification = {
        requestId: request.id,
        medicineName: request.medicineName,
        status: newStatus,
        message,
        time: Timestamp.now(),
      };
  
      const patientRef = doc(db, 'patients', request.requestedBy);
      await updateDoc(patientRef, {
        notifications: arrayUnion(notification),
      });
  
      // ✅ If approved, save to 'orders' collection
      if (newStatus === 'Approved') {
        const ordersRef = collection(db, 'orders');
        await addDoc(ordersRef, {
          ...request,
          status: 'Approved',
          orderCreatedAt: Timestamp.now(),
        });
      }
  
      // Optimistically update UI
      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id ? { ...r, status: newStatus } : r
        )
      );
    } catch (error) {
      console.error(`Error updating request:`, error);
      alert('Failed to update request.');
    }
  };
  
  const sortedRequests = [...requests]
    .sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99))
    .filter((request) => filter === 'All' || request.priority === filter);

  return (
    <div className="container mt-4">
      <h2>Medicine Requests</h2>

      <div className="mb-3">
        <label htmlFor="priorityFilter" className="form-label">Filter by Priority</label>
        <select
          id="priorityFilter"
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Critical">Critical</option>
          <option value="Chronic">Chronic</option>
          <option value="General">General</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Medicine</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRequests.map((request, index) => (
              <tr key={request.id || index}>
                <td>{request.id}</td>
                <td>{request.patientName}</td>
                <td>{request.medicineName}</td>
                <td>
                  <span
                    className={`badge ${request.status === 'Pending'
                        ? 'bg-warning'
                        : request.status === 'Approved'
                          ? 'bg-success'
                          : 'bg-danger'
                      }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td>
                  <span className="badge bg-info">{request.priority}</span>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleAction(request, 'Approved')}
                    disabled={request.status !== 'Pending'}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleAction(request, 'Rejected')}
                    disabled={request.status !== 'Pending'}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedRequest(request)}
                  >
                    More Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal (same as before) */}
      {selectedRequest && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Patient Name:</strong> {selectedRequest.patientName}</p>
                <p><strong>Patient Email:</strong> {selectedRequest.patientEmail}</p>
                <p><strong>Patient Mobile:</strong> {selectedRequest.patientMobile}</p>
                <p><strong>Patient Address:</strong> {selectedRequest.patientAddress}</p>
                <p><strong>Medicine Name:</strong> {selectedRequest.medicineName}</p>
                <p><strong>Medicine ID:</strong> {selectedRequest.medicineId}</p>
                <p><strong>Quantity:</strong> {selectedRequest.quantity}</p>
                <p><strong>Delivery Method:</strong> {selectedRequest.deliveryMethod}</p>
                <p><strong>Donor Name:</strong> {selectedRequest.donorName}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Priority:</strong> {selectedRequest.priority}</p>
                <p><strong>Requested By:</strong> {selectedRequest.requestedBy}</p>
                <p><strong>Requested At:</strong> {new Date(selectedRequest.requestedAt?.seconds * 1000).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
