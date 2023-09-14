import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { inputRoute } from '../utils/APIRoutes';
import { styled } from 'styled-components';

const CsvDataDisplay = () => {
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState([]);
  const [postDataResponse, setPostDataResponse] = useState(null);
  const [fileNames, setFileNames] = useState([]);
  const [editedFileNames, setEditedFileNames] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files);

    // Create an array to store the names of uploaded files
    const newFileNames = newFiles.map((file) => file.name);

    // Initialize editedFileNames with the same values as newFileNames
    setEditedFileNames([...newFileNames]);

    // Append the new file names to the existing file names
    setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames]);

    // Loop through selected files and parse each one
    newFiles.forEach((file) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // Append the data from the current file to the existing data
          setCsvData((prevData) => [...prevData, ...results.data]);
        },
      });
    });
  };

  const handleEditFileName = (index) => {
    // Update the fileNames state with the edited name at the specified index
    setFileNames((prevFileNames) => {
      const newFileNames = [...prevFileNames];
      newFileNames[index] = editedFileNames[index];
      return newFileNames;
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
        navigate('/patient-dashboard');
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
      <input type="file" accept=".csv" multiple onChange={handleFileUpload} />
      {fileNames.length > 0 && (
        <div>
          <h2>Selected Files:</h2>
          <ul>
            {fileNames.map((fileName, index) => (
              <li key={index}>
                <input
                  type="text"
                  value={editedFileNames[index]}
                  onChange={(e) => {
                    const newEditedFileNames = [...editedFileNames];
                    newEditedFileNames[index] = e.target.value;
                    setEditedFileNames(newEditedFileNames);
                  }}
                />
                <button onClick={() => handleEditFileName(index)}>Save</button>
                {editedFileNames[index] !== fileName && (
                  <span> (Edited)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      
      <button onClick={postDataToPublicURL}>Post Data</button>
      {postDataResponse && <p>{postDataResponse}</p>}
    </div>
  );
};

const FormContainer = styled.div`
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border: 1px solid #ddd;
  }
  th,
  td {
    text-align: left;
    padding: 16px;
    border: 1px solid #ddd;
  }
  thead,
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

export default CsvDataDisplay;
