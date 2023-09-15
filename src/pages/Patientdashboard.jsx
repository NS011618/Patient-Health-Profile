import React, { useState, useEffect } from 'react';
import { getRoute } from '../utils/APIRoutes';
import axios from 'axios';


const Patientdashboard = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [summarized, setSummarized] = useState(""); // State to hold summarized text
  const [summarizedPoints, setSummarizedPoints] = useState([]); // State to hold summarized points
  const [error, setError] = useState(null);
  

  useEffect(() => {
    fetch(getRoute)
      .then((response) => response.json())
      .then((data) => setRecords(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Define the order of fields and exclude "Sno"
  const fieldOrder = ["Name", "Age", "Sex", "Dates", "Description", "Medical_specialty", "Sample_name", "Transcription", "Keywords"];

  const handleNameClick = (record) => {
    setSelectedRecord(record);
    setExpanded(true);
    setSummarized(""); // Clear any previous summarized text
    setSummarizedPoints([]); // Clear any previous summarized points
  };
  const handleSummarize = async (record) => {
    const summary = record.Transcription;
    console.log(summary);
    try {
      const data = {
        text: summary
      };
  
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
  
      const response = await fetch('http://127.0.0.1:9000/summarize', requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData.sucess);
  
      // Check if the success property exists and is not null before splitting
      const points = responseData.sucess ? responseData.sucess.split('\n') : [];
  
      setSummarizedPoints(points);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError('Error summarizing text. Please try again.'); // Set an error message
      console.error('Fetch Error:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className={`container mx-auto bg-white rounded-lg shadow-md p-8 ${expanded ? 'w-full' : 'w-5/6 md:w-4/6 lg:w-3/6'}`}>
        <div className="flex flex-col md:flex-row">
          {/* Left pane */}
          <div className="md:w-1/3">
            <h1 className="text-2xl font-semibold mb-4">Names</h1>
            <ul>
              {records.map((record, index) => (
                <li
                  key={index}
                  onClick={() => handleNameClick(record)}
                  className="cursor-pointer hover:bg-gray-200 py-2 px-4 mb-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {record.Name}
                </li>
              ))}
            </ul>
          </div>
          {/* Right pane */}
          <div className="md:w-2/3 ml-4">
            {selectedRecord && (
              <div>
                <h1 className="text-2xl font-semibold mb-4">Selected Record</h1>
                <table className="w-full border-collapse">
                  <tbody>
                    {fieldOrder.map((field, index) => (
                      // Check if the field exists in the selected record before rendering
                      selectedRecord.hasOwnProperty(field) && (
                        <tr key={index}>
                          <th className="py-2 px-4 border border-gray-300">{field}</th>
                          <td className="py-2 px-4 border border-gray-300">{selectedRecord[field]}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
                <br/>
                <button className='font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md' onClick={() => handleSummarize(selectedRecord)}>Summarize</button>

                {/* Display the summarized text or error message */}
                {error ? (
                  <p className="text-red-600 mt-4">{error}</p>
                ) : (
                  summarizedPoints.length > 0 && (
                    <div>
                      <h1 className="text-2xl font-semibold mt-4">Summary</h1>
                      <ul>
                        {summarizedPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default Patientdashboard;
