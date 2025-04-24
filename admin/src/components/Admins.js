import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, InputGroup, FormControl, Table } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { db, auth } from '../firebase/firebaseConfig'; // Adjust the path if needed
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Admins = () => {
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [existingAdmins, setExistingAdmins] = useState([]);

  const fetchAdmins = async () => {
    const querySnapshot = await getDocs(collection(db, "admins"));
    const admins = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setExistingAdmins(admins);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (newAdminName === '' || newAdminEmail === '' || newAdminPassword === '') {
      setError('Name, email, and password are required');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newAdminEmail, newAdminPassword);
      const user = userCredential.user;

      await addDoc(collection(db, "admins"), {
        uid: user.uid,
        name: newAdminName,
        email: newAdminEmail
      });

      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setError('');
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await deleteDoc(doc(db, "admins", adminId));
      fetchAdmins();
    } catch (err) {
      setError('Failed to delete admin: ' + err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col xs={12} md={6} lg={5}>
          <div className="mb-4">
            <h5 className="mb-3">Existing Admins</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingAdmins.length > 0 ? (
                  existingAdmins.map((admin, index) => (
                    <tr key={admin.id}>
                      <td>{index + 1}</td>
                      <td>{admin.name || 'N/A'}</td>
                      <td>{admin.email}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleRemoveAdmin(admin.id)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No admins found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>

        <Col xs={12} md={6} lg={7}>
          <div className="text-center mb-4">
            <h3 className="fw-bold">Manage Admins</h3>
            <p className="text-muted">Add new admins with name, email, and password</p>
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <Form>
            <Form.Group controlId="addAdminName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter admin name"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="addAdminEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter new admin email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="addAdminPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <FormControl
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Enter new admin password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                />
                <InputGroup.Text
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ cursor: 'pointer' }}
                >
                  {passwordVisible ? <EyeOff /> : <Eye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" className="w-100 py-2" onClick={handleAddAdmin}>
              Add Admin
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Admins;
