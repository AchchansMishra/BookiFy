import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import BookCard from "../components/Card";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (firebase.isLoggedIn && firebase.user) {
      firebase.fetchMyBooks(firebase.user.uid)
        ?.then((books) => setBooks(books?.docs || []));
    }
  }, [firebase]);

  if (!firebase.isLoggedIn) return <h1 className="text-center mt-5 text-danger">Please log in to view your orders</h1>;

  const handleViewOrderDetails = (bookId) => {
    navigate(`/books/orders/${bookId}`); 
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 text-primary">📦 My Orders</h2>
      <Row className="g-4">
        {books.length > 0 ? (
          books.map((book) => (
            <Col md={6} lg={4} key={book.id}>
              <BookCard 
                link={`/books/orders/${book.id}`} 
                id={book.id} 
                {...book.data()} 
                onClick={() => handleViewOrderDetails(book.id)} 
              />
            </Col>
          ))
        ) : (
          <p className="text-center">You have no orders yet.</p>
        )}
      </Row>
    </Container>
  );
};

export default OrdersPage;
