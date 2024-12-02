import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function Visualize() {
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  });
  const [fileType, setFileType] = useState("pdf"); // Default file type
  const navigate = useNavigate();

  const handleAutoGenerate = () => {
    setAutoGenerate(true);
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  const handleManualSelect = () => {
    setAutoGenerate(false);
    setSelectedDate("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { ...formData, date: selectedDate, fileType };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/visualize/userdata",
        dataToSend,
        { responseType: "blob" } // Important to receive the file as Blob
      );

      if (fileType === "pdf") {
        // Create a download link for the PDF
        const pdfBlob = response.data;
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = "generated-report.pdf";  // Filename for the PDF
        link.click();  // Trigger the download
      }

      alert("Data submitted successfully!");
      navigate("/upload", {
        state: { fileType, fileData: response.data },  // Send PDF data to the next page if needed
      });
    } catch (error) {
      console.error(error);
      alert("Error submitting data.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Visualize</h2>

      <div className="d-flex mb-3">
        <button
          className={`btn ${autoGenerate ? "btn-primary" : "btn-outline-primary"} me-2`}
          onClick={handleAutoGenerate}
        >
          Auto Generate Date
        </button>
        <button
          className={`btn ${!autoGenerate ? "btn-primary" : "btn-outline-primary"}`}
          onClick={handleManualSelect}
        >
          Select Date Manually
        </button>
      </div>

      {!autoGenerate && (
        <div className="d-inline">
          <input
            type="date"
            className="form-control d-inline w-auto"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      )}

      {autoGenerate && (
        <div>
          <p>Auto-Generated Date: {selectedDate}</p>
        </div>
      )}

      <hr />

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleInputChange}
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleInputChange}
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleInputChange}
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <select
            className="form-select"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            
          >
            <option value="">Select Location</option>
            <option value="Erode">Erode</option>
            <option value="Salem">Salem</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Tirupur">Tirupur</option>
            <option value="Ooty">Ooty</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="fileType" className="form-label">
            File Type
          </label>
          <select
            className="form-select"
            id="fileType"
            value={fileType}
            onChange={handleFileTypeChange}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">
          Generate
        </button>
      </form>
    </div>
  );
}
