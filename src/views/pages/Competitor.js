import {
  Card,
  CardText,
  CardTitle,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Cookies from 'js-cookies';
import { useEffect, useMemo, useState } from 'react';
import { FilePlus } from 'react-feather';

const Competitor = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [avgRate, setAvgRate] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [modal7, setModal7] = useState(false);
  const toggle7 = () => {
    setModal7(!modal7);
  };
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    name: true,
    quantity: true,
    rate: true,
    top: true,
    grade: true,
    supplier: true,
  });
  const [selectedField, setSelectedField] = useState('date');
  const [searchValue, setSearchValue] = useState('');

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleFieldDropdown = () => setFieldDropdownOpen((prevState) => !prevState);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:5000/competitors', {
      headers: {
        Authorization: `Bearer ${Cookies.getItem('authToken')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 200) {
      console.log(response.data.data);
      setTotalQuantity(response.data.totalQuantity);
      setAvgRate(response.data.avgRate);
      const updatedData = response.data.data.map((item) => ({
        ...item,
        date: item.date.split('T')[0],
      }));
      setRowData(updatedData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    };
  }, []);

  const allColumns = [
    { field: 'date' },
    { field: 'name' },
    { field: 'quantity' },
    { field: 'rate' },
    { field: 'top' },
    { field: 'grade' },
    { field: 'supplier' },
  ];

  const searchFieldOptions = ['name', 'grade', 'supplier'];

  const getColumnDefs = () => {
    return allColumns.filter((col) => visibleColumns[col.field]);
  };

  const handleColumnVisibilityChange = (field) => {
    setVisibleColumns((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
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
          window.location.reload();
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  const handleFieldSelection = (field) => {
    setSelectedField(field);
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const apiData = {
      name: selectedField,
      search: value,
    };
    const response = await axios.post('http://localhost:5000/competitors/search', apiData);
    if (response.status === 200) {
      const updatedData = response.data.data.map((item) => ({
        ...item,
        date: item.date.split('T')[0],
      }));
      setRowData(updatedData);
      setTotalQuantity(response.data.totalQuantity);
      setAvgRate(response.data.avgRate);
    }
  };

  const autoSizeStrategy = {
    type: 'fitGridWidth',
    defaultMinWidth: 280,
    columnLimits: [
      {
        colId: 'date',
        minWidth: 120,
      },
      {
        colId: 'quantity',
        minWidth: 90,
      },
      {
        colId: 'rate',
        minWidth: 60,
      },
      {
        colId: 'top',
        minWidth: 100,
      },
      {
        colId: 'supplier',
        minWidth: 100,
      },
    ],
  };

  return (
    <div>
      <h1>Competitors</h1>
      <Row>
        <h5 className="mb-3 mt-3">Summary</h5>
        <Col md="6" lg="6">
          <Card body color="primary" inverse>
            <CardTitle tag="h4">Total Quantity</CardTitle>
            <CardText>{totalQuantity}</CardText>
          </Card>
        </Col>
        <Col md="6" lg="6">
          <Card body color="info" inverse>
            <CardTitle tag="h4">Average Rate</CardTitle>
            <CardText>{avgRate.toFixed(2)}</CardText>
          </Card>
        </Col>
        <Col md="6" lg="6">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="my-2">
            <DropdownToggle caret>Select Columns</DropdownToggle>
            <DropdownMenu>
              {allColumns.map((col) => (
                <DropdownItem
                  key={col.field}
                  toggle={false}
                  onClick={() => handleColumnVisibilityChange(col.field)}
                >
                  <input type="checkbox" checked={visibleColumns[col.field]} readOnly /> {col.field}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col md="6" lg="6">
          <Button color="success" onClick={toggle7.bind(null)}>
            <FilePlus />
          </Button>
          <Modal isOpen={modal7} toggle={toggle7.bind(null)}>
            <ModalHeader toggle={toggle7.bind(null)} charCode="Y">
              Upload .XLSX File
            </ModalHeader>
            <ModalBody>
              <Input type="file" id="File" />
            </ModalBody>
            <ModalFooter>
              <Button id="UploadBtn" type="button" onClick={handleFileSubmit} color="success">
                Upload
              </Button>
              <Button color="secondary" onClick={toggle7.bind(null)}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>

      <Row>
        <Col md="6" lg="3">
          <Dropdown isOpen={fieldDropdownOpen} toggle={toggleFieldDropdown} className="my-2">
            <DropdownToggle caret>{selectedField}</DropdownToggle>
            <DropdownMenu>
              {searchFieldOptions.map((col) => (
                <DropdownItem key={col} onClick={() => handleFieldSelection(col)}>
                  {col}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col md="6" lg="9">
          {' '}
          <Input
            type="text"
            placeholder={`Search by ${selectedField}`}
            value={searchValue}
            onChange={handleSearchInputChange}
            className="my-2"
          />
        </Col>
      </Row>

      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          autoSizeStrategy={autoSizeStrategy}
          defaultColDef={defaultColDef}
          rowData={rowData}
          columnDefs={getColumnDefs()}
          pagination
        />
      </div>
    </div>
  );
};

export default Competitor;
