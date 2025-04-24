import React, { useState, useEffect } from "react";
import { firebaseAuth } from "../context/firebase"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";

const MyNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">📚 BookiFy</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/book/list">Sell Books</Nav.Link>
          <Nav.Link href="/book/orders">Orders</Nav.Link>
          {user ? (
            <Button onClick={handleLogout} variant="outline-danger">Logout</Button>
          ) : (
            <Nav.Link href="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
