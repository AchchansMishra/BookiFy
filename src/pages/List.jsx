import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useFirebase } from "../context/firebase";
import { Toast } from "react-bootstrap"; 

const ListingPage = () => {
  const firebase = useFirebase();
  const [name, setName] = useState("");
  const [isbnNumber, setIsbnNumber] = useState("");
  const [price, setPrice] = useState("");
  const [coverPic, setCoverPic] = useState(null);
  const [coverPicPreview, setCoverPicPreview] = useState(null); 
  const [bookType, setBookType] = useState(""); 
  const [bookCondition, setBookCondition] = useState(""); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formErrors = {};
    if (!name) formErrors.name = "Book name is required";
    if (!isbnNumber || !/^\d{13}$/.test(isbnNumber)) formErrors.isbnNumber = "Please enter a valid 13-digit ISBN number";
    if (!price || price <= 0) formErrors.price = "Please enter a valid price";
    if (!bookType) formErrors.bookType = "Please select a book type";
    if (!bookCondition) formErrors.bookCondition = "Please select the condition of the book";
    if (!coverPic) formErrors.coverPic = "Please upload a cover image";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await firebase.createSellListing(name, isbnNumber, price, coverPic, bookType, bookCondition);
      setToastMessage("Book listed successfully!");
      setToastVariant("success");
      setShowToast(true);
      setName("");
      setIsbnNumber("");
      setPrice("");
      setCoverPic(null);
      setCoverPicPreview(null);
      setBookType("");
      setBookCondition("");
    } catch (error) {
      setToastMessage("Something went wrong. Please try again.");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  
  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPic(file);
        setCoverPicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPic(null);
      setCoverPicPreview(null);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8f9fa, #e3f2fd)",
        padding: "40px 20px",
      }}
    >
      <Card
        className="shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "550px",
          borderRadius: "20px",
          backgroundColor: "#ffffffcc", 
          backdropFilter: "blur(10px)",
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-4 text-primary fw-bold">
            📖 List Your Book
          </h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="bookName">
              <Form.Label className="fw-semibold">Book Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter book name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!errors.name}
                required
                className="input-styles"
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="isbn">
              <Form.Label className="fw-semibold">ISBN Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ISBN number"
                value={isbnNumber}
                onChange={(e) => setIsbnNumber(e.target.value)}
                isInvalid={!!errors.isbnNumber}
                required
                className="input-styles"
              />
              <Form.Control.Feedback type="invalid">{errors.isbnNumber}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label className="fw-semibold">Price (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                isInvalid={!!errors.price}
                required
                className="input-styles"
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="bookType">
              <Form.Label className="fw-semibold">Book Type</Form.Label>
              <Form.Control
                as="select"
                value={bookType}
                onChange={(e) => setBookType(e.target.value)}
                isInvalid={!!errors.bookType}
                required
                className="input-styles"
              >
                <option value="">Select Type</option>
                <option value="Hardcover">Hardcover</option>
                <option value="Paperback">Paperback</option>
                <option value="Ebook">Ebook</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.bookType}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="bookCondition">
              <Form.Label className="fw-semibold">Book Condition</Form.Label>
              <Form.Control
                as="select"
                value={bookCondition}
                onChange={(e) => setBookCondition(e.target.value)}
                isInvalid={!!errors.bookCondition}
                required
                className="input-styles"
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Acceptable">Used - Acceptable</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.bookCondition}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="coverPic">
              <Form.Label className="fw-semibold">Cover Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleCoverPicChange}
                accept="image/*"
                isInvalid={!!errors.coverPic}
                required
                className="input-styles"
              />
              <Form.Control.Feedback type="invalid">{errors.coverPic}</Form.Control.Feedback>
              {coverPicPreview && (
                <div className="mt-3 text-center">
                  <img
                    src={coverPicPreview}
                    alt="Cover Preview"
                    style={{
                      width: "150px",
                      height: "auto",
                      borderRadius: "8px",
                      border: "2px solid #ccc",
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-grid">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="submit-button"
              >
                Submit Listing
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Toast for success/error messages */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        bg={toastVariant}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999,
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default ListingPage;
