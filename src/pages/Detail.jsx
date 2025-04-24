import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import { useFirebase } from "../context/firebase";

const BookDetailPage = () => {
  const params = useParams();
  const firebase = useFirebase();
  const [data, setData] = useState(null);
  const [url, setUrl] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    firebase.getBookById(params.bookId).then((value) => setData(value.data()));
  }, [firebase, params.bookId]);

  useEffect(() => {
    if (data) {
      firebase.getImageURL(data.imageURL).then((url) => setUrl(url));
    }
  }, [data, firebase]);

  const placeOrder = () => {
    if (!window.Razorpay) {
      alert("Payment gateway not loaded.");
      return;
    }

    const options = {
      key: "rzp_test_HMLlWbg8eIpxMh",
      amount: data.price * 100 * qty,
      currency: "INR",
      name: "BookiFy",
      description: `Purchase: ${data.name}`,
      image: "https://your-logo-url.com/logo.png",
      handler: async function (response) {
        await firebase.placeOrder(params.bookId, qty);
        alert(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      notes: {
        bookId: params.bookId,
        seller: data.displayName,
      },
      theme: {
        color: "#2d3748",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (data === null)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <h1 className="text-secondary">Loading...</h1>
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center g-5">
        {/* Image */}
        <div className="col-md-5">
          <div className="shadow-sm rounded overflow-hidden bg-light p-3 text-center">
            <img
              src={url}
              alt={data.name}
              className="img-fluid"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="col-md-7">
          <h2 className="fw-bold text-primary mb-2">{data.name}</h2>
          <h4 className="text-success mb-2">₹{data.price}</h4>
          <p className="text-muted">ISBN: <strong>{data.isbn}</strong></p>

          <hr />

          <h5 className="fw-bold mt-4">Seller Info</h5>
          <p className="mb-1">Name: <strong>{data.displayName}</strong></p>
          <p>Email: <strong>{data.userEmail}</strong></p>

          <Form className="mt-4">
            <Form.Group controlId="formQty">
              <Form.Label className="fw-semibold">Quantity</Form.Label>
              <Form.Control
                type="number"
                value={qty}
                min="1"
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </Form.Group>

            <Button
              onClick={placeOrder}
              variant="success"
              className="mt-3 w-100 py-2 fw-semibold"
              style={{ borderRadius: "10px", fontSize: "1rem" }}
            >
              💳 Place Order & Pay
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
