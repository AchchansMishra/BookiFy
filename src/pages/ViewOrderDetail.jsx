import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { Container, Card, Row, Col } from "react-bootstrap";

const ViewOrderDetails = () => {
  const params = useParams();
  const firebase = useFirebase();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    firebase.getOrders(params.bookId).then((orders) => setOrders(orders.docs));
  }, [firebase, params.bookId]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary text-center">📘 Order Details</h2>
      <Row className="g-4">
        {orders.length > 0 ? (
          orders.map((order) => {
            const data = order.data();
            return (
              <Col md={6} lg={4} key={order.id}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">Buyer's Name: {data.displayName}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Qty: {data.qty}</Card.Subtitle>
                    <Card.Text>
                      <strong>Email:</strong> {data.userEmail}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <p className="text-center">No orders found for this book.</p>
        )}
      </Row>
    </Container>
  );
};

export default ViewOrderDetails;
