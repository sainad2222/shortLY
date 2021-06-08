import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./index.css";

function App() {
  const [term, setTerm] = useState("");
  const [toggle, setToggle] = useState(1);
  const [slug, setSlug] = useState("");
  const [short, setShort] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    var req;
    if (slug !== "") {
      req = {
        url: term,
        slug: slug,
      };
    } else {
      req = {
        url: term,
      };
    }
    try {
      const res = await axios.post(process.env.REACT_APP_SERVER, req);
      console.log(res.data);
      setTerm("");
      setSlug("");
      setShort(res.data.short_url);
      setError("");
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
      setShort("");
    }
  };

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSlugChange = (event) => {
    setSlug(event.target.value);
  };

  const handleToggle = (event) => {
    setToggle(!toggle);
  };

  const renderShort = () => {
    if (short !== "") {
      return (
        <div className="message">
          <h4>Short link: <a href={short}>{short}</a></h4>
        </div>
      );
    }
  };

  const renderError = () => {
    if (error !== "") {
      return (
        <div className="message">
          <h4>Error: <span className="error">{error}</span></h4>
        </div>
      );
    }
  };

  const renderSlug = () => {
    if (toggle) {
      return (
        <div>
          <Button variant="success" onClick={handleToggle} active>
            Random
          </Button>{" "}
          <Button variant="info" onClick={handleToggle}>
            Custom
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button variant="success" onClick={handleToggle}>
            Random
          </Button>{" "}
          <Button variant="info" onClick={handleToggle} active>
            Custom
          </Button>
          <Form.Control
            className="input"
            value={slug}
            onChange={handleSlugChange}
            placeholder="Enter custom short name for your url"
          />
        </div>
      );
    }
  };

  return (
    <div className="container">
      <Form className="form" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="label">URL</Form.Label>
          <Form.Control
            className="input"
            value={term}
            onChange={handleChange}
            placeholder="Enter Url"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="label">Short Name</Form.Label>
          {renderSlug()}
        </Form.Group>
        <Button variant="primary" type="submit" className="shortify">
          Shortify
        </Button>
      </Form>
      {renderShort()}
      {renderError()}
    </div>
  );
}

export default App;
