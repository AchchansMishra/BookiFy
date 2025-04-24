import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useFirebase } from "../context/firebase";
import { useNavigate } from "react-router-dom";

const placeholderImg = "https://via.placeholder.com/300x200.png?text=No+Image";

const BookCard = (props) => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (props.imageURL) {
      firebase.getImageURL(props.imageURL)
        .then(setUrl)
        .catch(() => setUrl(placeholderImg));
    } else {
      setUrl(placeholderImg);
    }
  }, [props.imageURL, firebase]);

  const handleClick = () => {
    if (props.link) {
      navigate(props.link);
    } else if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <Card
      className="book-card shadow-sm mb-4 border-0"
      style={{
        width: "100%",
        maxWidth: "320px",
        height: "400px",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      <div
        style={{
          height: "200px",
          backgroundColor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <img
          src={url}
          alt={props.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: "8px",
          }}
        />
      </div>

      <Card.Body
        className="d-flex flex-column justify-content-between"
        style={{ padding: "16px" }}
      >
        <div>
          <Card.Title className="fw-bold text-dark mb-2" style={{ fontSize: "1.1rem" }}>
            {props.name}
          </Card.Title>
          <Card.Text className="text-secondary mb-3" style={{ fontSize: "0.9rem" }}>
            Sold by: <strong>{props.displayName || "Seller"}</strong><br />
            Price: <strong className="text-success">₹{props.price}</strong>
          </Card.Text>
        </div>

        <Button
  variant="outline-primary"
  onClick={handleClick}
  className="w-100 fw-semibold"
  style={{
    borderRadius: "8px",
    fontSize: "0.95rem",
    padding: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#0d6efd";
    e.target.style.color = "#fff";
    e.target.style.borderColor = "#0d6efd";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#0d6efd";
    e.target.style.borderColor = "#0d6efd";
  }}
>
  🔍 View Details
</Button>

      </Card.Body>
    </Card>
  );
};

export default BookCard;
