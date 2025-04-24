import React, { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Handle the reset password logic
    console.log("Password reset link sent to:", email);
    navigate("/login"); // After submitting the form, navigate back to login page
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <div className="text-center mb-4">
              <h3>Forgot Password</h3>
              <p>Enter your email to reset your password</p>
            </div>
            <Form onSubmit={handleResetPassword}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 py-2 mb-3">
                Reset Password
              </Button>
            </Form>
            <div className="text-center">
              <Link to="/login" className="text-decoration-none">
                Back to Login
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
