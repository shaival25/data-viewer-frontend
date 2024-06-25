import axios from 'axios';
import { useState } from 'react';
import { Edit } from 'react-feather';
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
import Cookies from 'js-cookies';
import Swal from 'sweetalert2';

const EditCellRender = ({ data, fetchData }) => {
  const [modal7, setModal7] = useState(false);
  const [data1, setData1] = useState(data);
  const [newPassword, setNewPassword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roles, setRoles] = useState(['admin', 'user']);
  const [selectedRole, setSelectedRole] = useState('admin');
  const toggle7 = () => {
    setModal7(!modal7);
  };
  const handleRoleSelect = (value) => {
    setSelectedRole(value);
  };
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleUserUpdate = async () => {
    try {
      if (newPassword.length > 0) {
        data1.password = newPassword;
      } else {
        delete data1.password;
      }
      const response = await axios.put(`http://localhost:5000/user`, data1, {
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
        },
      });
      if (response.status === 200) {
        fetchData();
        toggle7();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User updated successfully',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div onClick={toggle7.bind(null)}>
        <Edit />
      </div>
      <Modal isOpen={modal7} toggle={toggle7.bind(null)}>
        <ModalHeader toggle={toggle7.bind(null)} charCode="Y">
          Update user
        </ModalHeader>
        <ModalBody>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setData1({ ...data, email: e.target.value })}
            value={data1.email}
          />
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
          />
          <Label for="phone">Phone</Label>
          <Input
            type="number"
            maxLength={10}
            name="phone"
            id="phone"
            onChange={(e) => setData1({ ...data, phone: e.target.value })}
            value={data1.phone}
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
          <Button color="danger" onClick={handleUserUpdate}>
            Update
          </Button>
          <Button color="secondary" onClick={toggle7.bind(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditCellRender;
