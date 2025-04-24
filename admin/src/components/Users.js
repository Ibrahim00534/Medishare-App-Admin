import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Modal, Image } from 'react-bootstrap';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to control confirmation modal
  const [userToTerminate, setUserToTerminate] = useState(null); // Store user to terminate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const patientsSnapshot = await getDocs(collection(db, 'patients'));
        const donorsSnapshot = await getDocs(collection(db, 'donors'));

        const patientUsers = patientsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            name: data.fullName,
            userType: 'patient',
            requests: data.notifications?.length || 0,
            donations: 0,
            status: data.status || 'Active',
          };
        });

        const donorUsers = donorsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            name: data.fullName,
            userType: 'donor',
            requests: 0,
            donations: data.notifications?.length || 0,
            status: data.status || 'Active',
          };
        });

        setUsers([...patientUsers, ...donorUsers]);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSuspendUser = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const collectionName = user.userType === 'patient' ? 'patients' : 'donors';
    const newStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';

    try {
      const userRef = doc(db, collectionName, id);
      await updateDoc(userRef, { status: newStatus });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === id ? { ...u, status: newStatus } : u
        )
      );

      if (selectedUser?.id === id) {
        setSelectedUser((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleTerminateUser = (user) => {
    setUserToTerminate(user);
    setShowConfirmModal(true);
  };

  const confirmTermination = async () => {
    const user = userToTerminate;
    if (!user) return;

    const collectionName = user.userType === 'patient' ? 'patients' : 'donors';

    try {
      await deleteDoc(doc(db, collectionName, user.id));
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      setShowConfirmModal(false); // Close confirmation modal
      if (selectedUser?.id === user.id) {
        setShowModal(false); // Close info modal if the terminated user was selected
      }
    } catch (error) {
      console.error('Error terminating user:', error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMoreInfo = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="container">
      <h2>Users</h2>
      <Form className="mb-3">
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form.Group>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Requests</th>
            <th>Donations</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr
                key={user.id}
                style={{ color: user.requests > 10 ? 'red' : 'inherit' }}
              >
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.requests}</td>
                <td>{user.donations}</td>
                <td>{user.status}</td>
                <td>
                  <Button variant="info" className="me-2" onClick={() => handleMoreInfo(user)}>
                    More Info
                  </Button>
                  <Button
                    variant={user.status === 'Suspended' ? 'success' : 'warning'}
                    className="me-2"
                    onClick={() => toggleSuspendUser(user.id)}
                  >
                    {user.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                  </Button>
                  <Button variant="danger" onClick={() => handleTerminateUser(user)}>
                    Terminate
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for user info */}
      {selectedUser && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser.imageUrl && (
              <div className="text-center mb-3">
                <Image src={selectedUser.imageUrl} roundedCircle height={100} />
              </div>
            )}
            <p><strong>Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Address:</strong> {selectedUser.address}</p>
            <p><strong>Phone:</strong> {selectedUser.phoneNumber || selectedUser.phone}</p>
            <p><strong>ID Card:</strong> {selectedUser.idCardNumber}</p>
            <p><strong>User Type:</strong> {selectedUser.userType}</p>
            {selectedUser.dob && (
              <p><strong>DOB:</strong> {`${selectedUser.dob.day}/${selectedUser.dob.month}/${selectedUser.dob.year}`}</p>
            )}
            <p><strong>Status:</strong> {selectedUser.status}</p>
            {selectedUser.notifications?.length > 0 && (
              <>
                <strong>Notifications:</strong>
                <ul>
                  {selectedUser.notifications.map((n, idx) => (
                    <li key={idx}>
                      {n.medicineName && <strong>{n.medicineName}: </strong>}
                      {n.message}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={selectedUser.status === 'Suspended' ? 'success' : 'warning'}
              onClick={() => toggleSuspendUser(selectedUser.id)}
            >
              {selectedUser.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
            </Button>
            <Button variant="danger" onClick={() => handleTerminateUser(selectedUser)}>
              Terminate
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Confirmation Modal for termination */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Termination</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to terminate (permanently delete) this user? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmTermination}>
            Confirm Termination
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
