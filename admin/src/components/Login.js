import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { Eye, EyeOff } from "react-feather";
import background from "../assets/9057765.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig"; // adjust path as needed

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle between login and forgot password forms

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isForgotPassword) {
      // Firebase login
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem("auth-token", token);
        onLogin(); // call parent login handler
      } catch (err) {
        setError("Invalid email or password");
      }
    } else {
      // Forgot password logic (basic)
      if (email === "") {
        setError("Please enter your email");
      } else {
        setError("");
        // Firebase can also send a password reset email
        // await sendPasswordResetEmail(auth, email); (optional)
        alert(`Password reset email sent to ${email}`);
        setIsForgotPassword(false);
      }
    }
  };


  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Row className="w-100">
          <Col
            xs={12}
            md={8}
            lg={6}
            xl={4}
            className="mx-auto"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "1px solid white",
              padding: "30px",
              borderRadius: "8px",
            }}
          >
            <div className="text-center mb-4">
              <h3 className="fw-bold text-white">
                {isForgotPassword ? "Forgot Password" : "Admin Login"}
              </h3>
              <p className="text-white">
                {isForgotPassword
                  ? "Enter your email to reset your password"
                  : "Enter your credentials to access the admin panel"}
              </p>
            </div>
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="text-white">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm"
                />
              </Form.Group>
              {!isForgotPassword && (
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label className="text-white">Password</Form.Label>
                  <InputGroup>
                    <FormControl
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="shadow-sm"
                    />
                    <InputGroup.Text
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      style={{ cursor: "pointer" }}
                    >
                      {passwordVisible ? <EyeOff /> : <Eye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              )}
              <Button variant="primary" type="submit" className="w-100 py-2 mb-3">
                {isForgotPassword ? "Reset Password" : "Login"}
              </Button>
              {!isForgotPassword ? (
                <div className="text-center">
                  <a
                    href="#"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-decoration-none text-white"
                  >
                    Forgot Password?
                  </a>
                </div>
              ) : (
                <div className="text-center">
                  <a
                    href="#"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-decoration-none text-white"
                  >
                    Back to Login
                  </a>
                </div>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
