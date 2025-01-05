import React, { useEffect,useState } from 'react';
import './Dashboard.css'; 
import axiosInstance from '../axiosConfig';



const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');

  useEffect(()=>{
    const fetchCandidates = async ()=>{
      try {
        const response = await axiosInstance.get('/candidates/');
        setCandidates(response.data)
      } catch (err) {
        setError('Failed to fetch data. Please try again later.')
        console.error(err)
      }
    };
    fetchCandidates()
  },[])

  const handleDownload = async (candidateId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to download the resume.');
        return;
      }
  
      const response = await axiosInstance.get(`/download-resume/${candidateId}/`, {
        responseType: 'blob', // Ensures the file is downloaded as a blob
        headers: {
          Authorization: `Token ${token}`, // Include the auth token
        },
      });
  
      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${candidateId}.pdf`); // Suggested filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading the resume:', error);
      alert('Failed to download the resume. Please try again.');
    }
  };


  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <p>Welcome! Here you can view and manage your account details.</p>
        
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Resume</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate)=>(
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>
  {candidate.resume ? (
    <a href={candidate.resume} target="_blank" rel="noopener noreferrer">
      View Resume
    </a>
  ) : (
    'No Resume'
  )}
</td>
<td><button className="download-button" onClick={()=>handleDownload(candidate.id)}>Download Resume</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
