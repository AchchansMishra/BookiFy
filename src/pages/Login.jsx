import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useFirebase } from "../context/firebase";

const LoginPage = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate("/");
    }
  }, [firebase, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in user...");
      const result = await firebase.signinUserWithEmailAndPassword(email, password);
      console.log("Login successful", result);
    } catch (error) {
      console.error("Login error", error);
      alert("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <Card className="p-4 shadow w-100" style={{ maxWidth: "500px", borderRadius: "1rem" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4 text-primary fs-4">🔐 Login</Card.Title>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
              />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button variant="success" type="submit" size="lg">
                Login
              </Button>
            </div>
          </Form>

          <div className="text-center mb-3">
            <span className="text-muted">OR</span>
          </div>

          <div className="d-grid">
            <Button onClick={firebase.signinWithGoogle} variant="danger" size="lg">
              Sign in with Google
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;
