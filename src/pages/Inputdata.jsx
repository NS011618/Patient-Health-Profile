import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Papa from 'papaparse';
import { inputRoute } from '../utils/APIRoutes'; // Make sure to import your API route correctly

const CsvDataDisplay = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [csvData, setCsvData] = useState([]);
  const [postDataResponse, setPostDataResponse] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const nonEmptyRows = result.data.filter((row) => {
          // Customize this condition based on your CSV data structure
          return Object.values(row).some((value) => value !== null && value !== undefined && value !== '');
        });
        setCsvData(nonEmptyRows);
      },
    });
  };

  const postDataToPublicURL = async () => {
    if (csvData.length === 0) {
      setPostDataResponse('No data to post');
      return;
    }

    try {
      const response = await fetch(inputRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(csvData),
      });

      if (response.ok) {
        setPostDataResponse('Data posted successfully');

        // Redirect to the patient dashboard after successful data posting
        navigate('/patient-dashboard'); // Replace with your actual dashboard route
      } else {
        setPostDataResponse('Failed to post data');
      }
    } catch (error) {
      console.error('Error posting data:', error);
      setPostDataResponse('An error occurred while posting data');
    }
  };

  return (
    <div>
      <h1>CSV Data Display and Post</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {csvData.length > 0 && (
        <div>
          <h2>CSV Data:</h2>
          <ul>
            {csvData.map((row, index) => (
              <li key={index}>
                {Object.entries(row).map(([key, value]) => {
                  if (value !== null && value !== undefined && value !== '') {
                    return (
                      <div key={key}>
                        <strong>{key}:</strong> {value}
                      </div>
                    );
                  }
                  return null; // Skip printing empty values
                })}
              </li>
            ))}
          </ul>
          <button onClick={postDataToPublicURL}>Post Data</button>
          {postDataResponse && <p>{postDataResponse}</p>}
        </div>
      )}
    </div>
  );
};

export default CsvDataDisplay;
