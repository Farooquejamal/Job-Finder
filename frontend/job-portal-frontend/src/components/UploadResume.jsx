import React, { useState } from 'react';
import './UploadResume.css'; 
import { FaFileUpload } from "react-icons/fa";
import axiosInstance from '../axiosConfig';

const UploadResume = () => {
  const [resume, setResume] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('phone', userData.phone);


    try {
      const response = await axiosInstance.post('/upload-resume/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert('File upload failed. Please try again.');
    }
  };

  return (
    <div className="upload-resume-container">
      <div className="upload-resume-content">
        <h2>Upload Resume</h2>
        <form onSubmit={handleUpload}>
          <div className="user-details">
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="file-upload-container">
            <input
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
              className="file-input"
              required
            />
          </div>
          <button type="submit" className="upload-button">
            Upload <FaFileUpload />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;
