import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import BookCard from "../components/Card";
import SearchBar from "../components/SearchBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const HomePage = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    firebase.listAllBooks().then((books) => setBooks(books.docs));
  }, [firebase]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredBooks = books.filter((book) =>
    book.data().name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="homepage-wrapper text-white"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1512820790803-83ca734da794')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "60px",
        paddingBottom: "60px",
        position: "relative",
      }}
    >
      <div
        className="overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 0,
        }}
      ></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-light">Explore Our Books</h1>
          <p className="lead text-light">Find your next great read</p>
        </div>

        <div className="d-flex justify-content-center mb-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for books..."
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "25px",
              padding: "12px 20px",
              border: "none",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Col key={book.id}>
                <BookCard
                  link={`/book/view/${book.id}`}
                  showBuyNow={true}
                  {...book.data()}
                  style={{
                    minHeight: "460px",
                  }}
                />
              </Col>
            ))
          ) : (
            <div className="col-12 text-center">
              <h4 className="text-light">No books found for your search.</h4>
            </div>
          )}
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
