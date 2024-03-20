import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [genderFilter, setGenderFilter] = useState("");
  const [diagnosisDateFilter, setDiagnosisDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchData();
  }, []); // Fetch data only once when the component mounts

  useEffect(() => {
    filterData();
  }, [
    genderFilter,
    diagnosisDateFilter,
    statusFilter,
    data,
    sortColumn,
    sortDirection,
  ]); // Re-run filtering whenever the filters or data change

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://us-central1-vial-development.cloudfunctions.net/function-1/subjects"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterData = () => {
    // Check ensures data is not undefined
    if (data && data.data) {
      var filtered = data.data;
    }

    // Apply filters
    if (genderFilter) {
      filtered = filtered.filter((item) => item.gender === genderFilter);
    }
    if (diagnosisDateFilter) {
      filtered = filtered.filter(
        (item) => item.diagnosisDate === diagnosisDateFilter
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // sorting numerical values
        if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // sorting string values
        if (sortDirection === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    // Check ensures filtered is not undefined
    if (filtered) {
      setFilteredData([...filtered]); // Update filteredData state
    }
  };

  // Event handlers for filter changes
  const handleGenderChange = (event) => setGenderFilter(event.target.value);
  const handleDiagnosisDateChange = (event) =>
    setDiagnosisDateFilter(event.target.value);
  const handleStatusChange = (event) => setStatusFilter(event.target.value);
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div>
      <h1>Data Table</h1>
      <div class="inputs">
        <div>
          <label>Gender:</label>
          <select value={genderFilter} onChange={handleGenderChange}>
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Diagnosis Date:</label>
          <input
            type="date"
            value={diagnosisDateFilter}
            onChange={handleDiagnosisDateChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={statusFilter} onChange={handleStatusChange}>
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("age")}>Age</th>
            <th onClick={() => handleSort("gender")}>Gender</th>
            <th onClick={() => handleSort("diagnosisDate")}>Diagnosis Date</th>
            <th onClick={() => handleSort("status")}>Status</th>
          </tr>
        </thead>
        {filteredData && filteredData.length > 0 && (
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.gender}</td>
                <td>{item.diagnosisDate}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default App;
