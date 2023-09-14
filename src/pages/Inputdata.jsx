import React, { useState } from 'react';
import Papa from 'papaparse';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { styled } from 'styled-components';

const Inputdata = () => {
  const [data, setData] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const handleFileUpload = (e) => {
    const files = e.target.files;

    // Loop through selected files and parse each one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Update the fileNames array with the name of the current file
      setFileNames((prevFileNames) => [...prevFileNames, file.name]);

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // Append the data from the current file to the existing data
          setData((prevData) => [...prevData, ...results.data]);
        },
      });
    }
  };

  return (
    <>
      <input type="file" accept=".csv" multiple onChange={handleFileUpload} />
      {fileNames.length > 0 && (
        <div>
          <h2>Selected Files:</h2>
          <ul>
            {fileNames.map((fileName, index) => (
              <li key={index}>{fileName}</li>
            ))}
          </ul>
        </div>
      )}
      <FormContainer>
        <br />
        {data.length ? (
          <table>
            {/* ...Your table code */}
          </table>
        ) : null}
        <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:space-x-6">
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 mt-4 md:mt-0">
            {/* ...Your first bar chart */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 mt-4 md:mt-0">
            {/* ...Your second bar chart */}
          </div>
        </div>
      </FormContainer>
    </>
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
    thead,tr:nth-child(even) {
        background-color: #f2f2f2;
    } 
    
  

`;

export default Inputdata