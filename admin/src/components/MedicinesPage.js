import { Table, Badge, Card, Row, Col, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // adjust path as needed

const MedicinesPage = () => {
  // Sample data (This would usually come from an API or database)
  const [medicines, setMedicines] = useState([]);
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "medicineDonations"));
        const meds = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedicines(meds);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Medicines Details</h2>

      {/* Medicines Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Condition</th>
            <th>Description</th>
            <th>Donor</th>
            <th>Ordered By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med, index) => (
            <tr key={index}>
              <td>{med.medicineName}</td>
              <td>{med.quantity}</td>
              <td>{med.condition}</td>
              <td>{med.details}</td>
              <td>{med.userId}</td> {/* or med.donor?.name */}
              <td>{med.orderedBy || "N/A"}</td>

              <td>
                <Badge
                  bg={
                    med.status === "Sold"
                      ? "success"
                      : med.status === "Ordered"
                        ? "primary"
                        : med.status === "Finished"
                          ? "danger"
                          : "info"
                  }
                >
                  {med.status}
                </Badge>
              </td>
              <td>
                <Button variant="info" size="sm">
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Or Card-based display (as an alternative layout) */}
      <h3 className="my-4">Medicines Overview</h3>
      <Row>
        {medicines.map((med, index) => (
          <Col md={3} key={index} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{med.medicineName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Condition: {med.condition}</Card.Subtitle>
                <Card.Text>
                  <strong>Quantity:</strong> {med.quantity} <br />
                  <strong>Description:</strong> {med.details} <br />
                  <strong>Donor:</strong> {med.userId} <br />
                  <strong>Ordered By:</strong> {med.orderedBy || "N/A"} <br />
                </Card.Text>
                <Badge
                  bg={
                    med.status === "Sold"
                      ? "success"
                      : med.status === "Ordered"
                        ? "primary"
                        : med.status === "Finished"
                          ? "danger"
                          : "info"
                  }
                >
                  {med.status}
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MedicinesPage;
