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
import '../../assets/scss/custom.css';
import Cookies from 'js-cookies';
import { useEffect, useMemo, useState } from 'react';
import { FilePlus } from 'react-feather';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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

  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState('name');
  const [searchValue, setSearchValue] = useState('');

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleFieldDropdown = () => setFieldDropdownOpen((prevState) => !prevState);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/competitors', {
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setTotalQuantity(response.data.totalQuantity);
        setAvgRate(response.data.avgRate);
        const updatedData = response.data.data.map((item) => ({
          ...item,
          date: item.date.split('T')[0],
        }));
        setRowData(updatedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
    { field: 'top', headerName: 'Terms of Payment' },
    { field: 'grade' },
    { field: 'supplier' },
  ];

  const searchFieldOptions = ['name', 'grade', 'supplier'];

  const getColumnDefs = () => {
    return allColumns.filter((col) => visibleColumns[col.field]);
  };
  const noRowsOverlayComponent = () => {
    return 'No results found!';
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
          toggle7();
          fetchData();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'File uploaded successfully',
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

  const handleFieldSelection = (field) => {
    setSelectedField(field);
  };

  const handleSearchInputChange = async (e) => {
    try {
      const value = e.target.value;
      setSearchValue(value);
      const apiData = {
        name: selectedField,
        search: value,
      };
      const response = await axios.post('http://localhost:5000/competitors/search', apiData);
      if (response.status === 200) {
        const updatedData = response?.data?.data?.map((item) => ({
          ...item,
          date: item.date.split('T')[0],
        }));
        setRowData(updatedData || []);
        setTotalQuantity(response.data.totalQuantity);
        setAvgRate(response.data.avgRate);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching data',
      });
      console.error('Error fetching data:', error);
    }
  };

  const autoSizeStrategy = {
    type: 'fitGridWidth',
    defaultMinWidth: 50,
    checkboxSelection: true,
    columnLimits: [
      {
        colId: 'date',
        minWidth: 120,
      },
      {
        colId: 'name',
        minWidth: 280,
      },
      {
        colId: 'quantity',
        minWidth: 80,
      },

      {
        colId: 'top',
        minWidth: 150,
      },
      {
        colId: 'grade',
        minWidth: 280,
      },
      {
        colId: 'supplier',
        minWidth: 150,
      },
    ],
  };

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

  return (
    <div>
      <Row>
        <Col>
          <h2>Competitors</h2>
        </Col>
        <Col>
          {user.role === 'admin' ? (
            <Button color="success" onClick={toggle7.bind(null)}>
              <div className="flex">
                <FilePlus width={40} height={40} />
                <span>Upload File</span>
              </div>
            </Button>
          ) : null}

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
      </Row>

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
        <Col md="6" lg="5">
          {' '}
          <Input
            type="text"
            placeholder={`Search by ${selectedField}`}
            value={searchValue}
            onChange={handleSearchInputChange}
            className="my-2"
          />
        </Col>
        <Col md="6" lg="6">
          <div className="d-flex justify-content-end">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="my-2">
              <DropdownToggle color="purple" caret>
                Select Columns
              </DropdownToggle>
              <DropdownMenu>
                {allColumns.map((col) => (
                  <DropdownItem
                    key={col.field}
                    toggle={false}
                    onClick={() => handleColumnVisibilityChange(col.field)}
                  >
                    <input type="checkbox" checked={visibleColumns[col.field]} readOnly />{' '}
                    {col.field}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </Col>
      </Row>

      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 1000 }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          autoSizeStrategy={autoSizeStrategy}
          defaultColDef={defaultColDef}
          rowData={rowData}
          columnDefs={getColumnDefs()}
          pagination
          // paginationAutoPageSize
          noRowsOverlayComponent={noRowsOverlayComponent}
        />
      </div>
    </div>
  );
};

export default Competitor;
