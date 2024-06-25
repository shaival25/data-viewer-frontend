import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Cookies from 'js-cookies';
import { useEffect, useMemo, useState } from 'react';
import EditCellRender from '../renders/editCellRender';
import DeleteCellRender from '../renders/deleteCellRender';
import {
  Button,
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
} from 'reactstrap';
import Swal from 'sweetalert2';

const Users = () => {
  const [rowData, setRowData] = useState([]);
  const [modal1, setModal1] = useState(false);
  const [data, setData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roles, setRoles] = useState(['admin', 'user']);
  const [selectedRole, setSelectedRole] = useState('admin');
  const toggle1 = () => {
    setModal1(!modal1);
  };
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/all-users`, {
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
        },
      });
      if (response.status === 200) {
        setRowData(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleRoleSelect = (value) => {
    setSelectedRole(value);
  };
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    };
  }, []);

  const allColumns = [
    { field: 'fullName' },
    { field: 'email' },
    { field: 'role' },
    { field: 'phone' },
    {
      field: 'edit',
      cellRenderer: EditCellRender,
      cellRendererParams: {
        fetchData: fetchData,
      },
    },
    {
      field: 'delete',
      cellRenderer: DeleteCellRender,
      cellRendererParams: {
        fetchData: fetchData,
      },
    },
  ];

  const autoSizeStrategy = {
    type: 'fitGridWidth',
    defaultMinWidth: 150,
  };

  const handleAddUser = async () => {
    data.role = selectedRole;
    try {
      const response = await axios.post(`http://localhost:5000/user/register`, data, {
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
        },
      });
      if (response.status === 200) {
        fetchData();
        toggle1.bind(null);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User added successfully',
        });
        setModal1(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Something went wrong',
      });
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <Button color="primary" onClick={toggle1.bind(null)}>
        <i className={`me-2 bi-person-plus-fill`} />
        Add User
      </Button>
      <Modal isOpen={modal1} toggle={toggle1.bind(null)}>
        <ModalHeader toggle={toggle1.bind(null)} charCode="Y">
          Add new user
        </ModalHeader>
        <ModalBody>
          <Label for="fullName">Full Name</Label>
          <Input
            type="text"
            name="fullName"
            id="fullName"
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            value={data.fullName}
          />
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            value={data.email}
          />
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            value={data.password}
          />
          <Label for="phone">Phone</Label>
          <Input
            type="number"
            maxLength={10}
            name="phone"
            id="phone"
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            value={data.phone}
          />
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="my-2">
            <Label for="role">Role</Label>
            <br />
            <DropdownToggle id="role" color="info" caret>
              {selectedRole}
            </DropdownToggle>
            <DropdownMenu>
              {roles.map((col) => (
                <DropdownItem key={col} toggle={true} onClick={() => handleRoleSelect(col)}>
                  {col}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleAddUser}>
            Add
          </Button>
          <Button color="secondary" onClick={toggle1.bind(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <h1>Users Data</h1>

      <div
        className="ag-theme-quartz mt-2" // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          autoSizeStrategy={autoSizeStrategy}
          defaultColDef={defaultColDef}
          rowData={rowData}
          columnDefs={allColumns}
        />
      </div>
    </div>
  );
};

export default Users;
