import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookies';
import { format } from 'date-fns';
import DatePicker from 'react-multi-date-picker';
import Chart from 'react-apexcharts';
import {
  Button,
  Card,
  CardText,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronsLeft,
  ChevronsRight,
  FilePlus,
} from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

const DataTable = () => {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const [dates, setDates] = useState();
  const columns = ['date', 'name', 'quantity', 'rate', 'amount', 'terms', 'grade', 'supplier'];
  const columnDisplayNames = {
    date: 'Date',
    name: 'Name',
    quantity: 'Quantity',
    rate: 'Rate',
    amount: 'Amount',
    terms: 'Terms',
    grade: 'Grade',
    supplier: 'Supplier',
  };

  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [rowData, setRowData] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [avgRate, setAvgRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('Name');
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [modal7, setModal7] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const searchFieldOptions = ['Name', 'Grade', 'Supplier'];
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const [seriespie, setSeriespie] = useState([]);
  const [labelspie, setLabelspie] = useState([]);

  const optionspie = {
    chart: {
      id: 'pie-chart',
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '100px',
        },
      },
    },
    legend: {
      show: true,
      width: '50px',
    },
    labels: labelspie,
  };

  const toggle7 = () => {
    setModal7(!modal7);
  };

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleFieldDropdown = () => setFieldDropdownOpen((prevState) => !prevState);

  const handleFileSubmit = async () => {
    const fileInput = document.getElementById('File');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const { name } = file;
      const ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
      if (ext !== 'xlsx') {
        console.error('Invalid file extension');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:5000/uploads', formData, {
          headers: {
            Authorization: `Bearer ${Cookies.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          toggle7();
          fetchData();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'File uploaded successfully',
          });
        } else if (response.status === 201) {
          toggle7();
          Swal.fire({
            icon: 'error',
            title: 'Missing',
            text: response.data.map((error) => error.errors).join(', '),
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error uploading file',
        });
        console.error('Error uploading file:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/competitors', {
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setTotalQuantity(response.data.totalQuantity);
        setAvgRate(response.data.avgRate);
        setTotalAmount(response.data.totalAmount);
        const updatedData = response.data.data.map((item) => ({
          ...item,
          date: format(new Date(item?.date), 'dd/MM/yyyy'),
        }));
        setRowData(updatedData);
        setSeriespie(response.data.suppliersCount.map((item) => item.count));
        setLabelspie(response.data.suppliersCount.map((item) => item.supplier));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRow = (rowIndex) => {
    setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
  };

  const handleColumnSelection = (columnName) => {
    if (selectedColumns.includes(columnName)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(rowData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = rowData.slice(startIndex, startIndex + rowsPerPage);
  const endIndex = Math.min(startIndex + rowsPerPage, rowData.length);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user`, {
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (err) {
      navigate('/auth1/login');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSearchInputChange = async (event) => {
    const value = event.target.value;
    setSearchValue(value);
    const apiData = {
      field: selectedField.toLowerCase(),
      search: value,
    };

    try {
      const response = await axios.post(`http://localhost:5000/competitors/suggestion`, apiData);
      if (response.status === 200) {
        setSuggestions(response.data);
        setShowSuggestions(true);
      } else if (response.status === 201) {
        setShowSuggestions(true);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);

    const apiData = {
      field: selectedField.toLowerCase(),
      search: suggestion,
    };

    try {
      const response = await axios.post(`http://localhost:5000/competitors/search`, apiData);
      if (response.status === 200) {
        setAvgRate(response.data.avgRate);
        setTotalAmount(response.data.totalAmount);
        setTotalQuantity(response.data.totalQuantity);
        const updatedData = response.data.data.map((item) => ({
          ...item,
          date: item.date.split('T')[0],
        }));
        setRowData(updatedData);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFieldSelection = (field) => {
    setSelectedField(field);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort data based on sortConfig
  useEffect(() => {
    if (sortConfig.key !== null) {
      const sortedData = [...rowData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setRowData(sortedData);
    }
  }, [sortConfig]);
  const exportToCSV = () => {
    const csvData = [];

    // Add header row
    const headerRow = columns.map((col) => columnDisplayNames[col]).join(',');
    csvData.push(headerRow);

    // Add data rows
    rowData.forEach((row) => {
      const rowData = columns.map((col) => row[col]);
      csvData.push(rowData.join(','));
    });

    // Create a Blob and save as CSV file
    const blob = new Blob([csvData.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data.csv');
  };

  const handleDateChange = async (dates) => {
    const formattedDates = dates.map((date) => date.format('YYYY-MM-DD'));
    const response = await axios.post('http://localhost:5000/competitors/date-range', {
      startDateString: formattedDates[0],
      endDateString: formattedDates[1],
    });
    if (response.status === 200) {
      setTotalQuantity(response.data.data.totalQuantity);
      setAvgRate(response.data.data.avgRate);
      setTotalAmount(response.data.data.totalAmount);
      const updatedData = response.data.data.data.map((item) => ({
        ...item,
        date: format(new Date(item?.date), 'dd/MM/yyyy'),
      }));
      setRowData(updatedData);
      setSeriespie(response.data.data.suppliersCount.map((item) => item.count));
      setLabelspie(response.data.data.suppliersCount.map((item) => item.supplier));
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h2>Competitors</h2>
        </Col>
        <Col>
          {user.role === 'admin' ? (
            <Button color="success" onClick={toggle7}>
              <div className="flex">
                <FilePlus width={40} height={40} />
                <span>Upload File</span>
              </div>
            </Button>
          ) : null}

          <Modal isOpen={modal7} toggle={toggle7}>
            <ModalHeader toggle={toggle7} charCode="Y">
              Upload .XLSX File
            </ModalHeader>
            <ModalBody>
              <Input type="file" id="File" />
            </ModalBody>
            <ModalFooter>
              <Button id="UploadBtn" type="button" onClick={handleFileSubmit} color="success">
                Upload
              </Button>
              <Button color="secondary" onClick={toggle7}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
      <Row>
        <h5 className="mb-3 mt-3">Summary</h5>
        <Col md="6" lg="4">
          <Card body color="primary" inverse>
            <CardTitle tag="h4">Total Quantity (KG)</CardTitle>
            <CardText>{totalQuantity}</CardText>
          </Card>
        </Col>
        <Col md="6" lg="4">
          <Card body color="info" inverse>
            <CardTitle tag="h4">Average Rate (INR/KG)</CardTitle>
            <CardText>{avgRate?.toFixed(2)}</CardText>
          </Card>
        </Col>
        <Col md="6" lg="4">
          <Card body color="info" inverse>
            <CardTitle tag="h4">Total Amount (INR)</CardTitle>
            <CardText>{totalAmount}</CardText>
          </Card>
        </Col>
        <Col md="6" lg="4">
          <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 350 }}>
            <Chart options={optionspie} series={seriespie} type="pie" height="300" />
          </div>
        </Col>
      </Row>
      <Button color="primary" onClick={exportToCSV}>
        Export CSV
      </Button>
      <DatePicker
        placeholder="Select Dates"
        value={dates}
        onChange={setDates}
        onClose={() => handleDateChange(dates)}
        numberOfMonths={2}
        offsetY={10}
        range
        rangeHover
        format="MMMM DD"
      />
      <Row width="100px">
        <Col md="6" lg="1">
          <Dropdown isOpen={fieldDropdownOpen} toggle={toggleFieldDropdown} className="my-2">
            <DropdownToggle color="danger" caret>
              {selectedField}
            </DropdownToggle>
            <DropdownMenu>
              {searchFieldOptions.map((col) => (
                <DropdownItem key={col} onClick={() => handleFieldSelection(col)}>
                  {col}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col md="6" lg="6">
          <Input
            type="text"
            placeholder={`Search by ${selectedField}`}
            value={searchValue}
            onChange={handleSearchInputChange}
            className="my-2"
          />
          {showSuggestions && (
            <ul ref={suggestionsRef} className="suggestions-list">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion}
                  </li>
                ))
              ) : (
                <li className="suggestion-item">No result found</li>
              )}
            </ul>
          )}
        </Col>
        <Col md="6" lg="6">
          <div className="d-flex justify-content-end">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="my-2">
              <DropdownToggle color="purple" caret>
                Select Columns
              </DropdownToggle>
              <DropdownMenu>
                {columns.map((col, index) => (
                  <DropdownItem
                    key={index}
                    toggle={false}
                    onClick={() => {
                      handleColumnSelection(col);
                    }}
                  >
                    <input
                      type="checkbox"
                      id={col}
                      checked={selectedColumns.includes(col)}
                      readOnly
                    />{' '}
                    <label htmlFor={col}> {columnDisplayNames[col]}</label>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </Col>
      </Row>
      <div className="table-container">
        <table className="data-table">
          <thead className="sticky-header">
            <tr>
              {columns.map((col, colIndex) =>
                selectedColumns.includes(col) && (!isMobile || colIndex < 2) ? (
                  <th key={col} onClick={() => handleSort(col)}>
                    {columnDisplayNames[col]}
                    {sortConfig.key === col && (
                      <span>
                        {sortConfig.direction === 'asc' ? (
                          <ArrowUp className="m-2" width={20} />
                        ) : (
                          <ArrowDown className="m-2" width={20} />
                        )}
                      </span>
                    )}
                  </th>
                ) : null,
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr
                  onClick={isMobile ? () => toggleRow(rowIndex) : undefined}
                  className={isMobile ? 'main-row' : ''}
                >
                  {columns.map(
                    (col, colIndex) =>
                      selectedColumns.includes(col) &&
                      (colIndex < 2 || !isMobile || expandedRow === rowIndex) && (
                        <td key={col}>{row[col]}</td>
                      ),
                  )}
                </tr>
                {expandedRow === rowIndex && isMobile && (
                  <tr className="expanded-row">
                    <td colSpan={columns.length}>
                      <table border={1}>
                        <tbody>
                          {columns.slice(2).map(
                            (col) =>
                              selectedColumns.includes(col) && (
                                <tr key={col}>
                                  <td>{columnDisplayNames[col]}:</td>
                                  <td>{row[col]}</td>
                                </tr>
                              ),
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="table-controls mt-1">
          <div className="pagination-controls">
            <Button
              style={{ backgroundColor: 'black', color: 'white' }}
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft />
            </Button>
            <Button
              style={{ backgroundColor: 'black', color: 'white' }}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft />
            </Button>
            <Label>
              Page {currentPage} of {totalPages}
            </Label>
            <Button
              style={{ backgroundColor: 'black', color: 'white' }}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ArrowRight />
            </Button>
            <Button
              style={{ backgroundColor: 'black', color: 'white' }}
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight />
            </Button>
          </div>
          <div className="rows-per-page-controls">
            <label htmlFor="rows-per-page">Rows per page:</label>
            <select id="rows-per-page" value={rowsPerPage} onChange={handleRowsPerPageChange}>
              {[10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="row-range-display">
            <span>
              Showing{' '}
              <strong>
                {startIndex + 1} - {endIndex}
              </strong>{' '}
              of <strong>{rowData.length}</strong>
            </span>
          </div>
        </div>
        <style jsx>{`
          .table-container {
            overflow-x: auto;
            margin-top: 10px;
          }
          .table-controls {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          .rows-per-page-controls {
            margin-left: 15px;
            display: flex;
            align-items: center;
          }
          .rows-per-page-controls label {
            margin-right: 5px;
          }
          .rows-per-page-controls select {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid black;
          }
          .row-range-display {
            display: flex;
            align-items: center;
            margin-right: 15px;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid black;
          }
          th,
          td {
            padding: 8px;
            text-align: left;
            border: 1px solid black;
          }
          .sticky-header th {
            background-color: #f8f9fa;
            position: sticky;
            top: 0;
            z-index: 1;
          }
          .pagination-controls {
            display: flex;
            align-items: center;
          }
          .pagination-controls button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            margin-right: 5px;
            padding: 0;
            border: none;
            background-color: #343a40;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .pagination-controls button:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
          }
          .pagination-controls label {
            margin: 0 10px;
          }
          .expanded-row td {
            background-color: #f8f9fa;
            border: none;
          }
          .main-row:hover {
            background-color: #f1f1f1;
            cursor: pointer;
          }
          .suggestions-list {
            position: absolute;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
            margin-top: 2px;
            z-index: 1000;
            width: 100%; /* Set the width to match the search bar */
            list-style-type: none; /* Remove bullets */
            padding: 0; /* Remove default padding */
          }
          .suggestion-item {
            padding: 8px;
            cursor: pointer;
          }
          .suggestion-item:hover {
            background-color: #f1f1f1;
          }
        `}</style>
      </div>
    </>
  );
};

export default DataTable;
