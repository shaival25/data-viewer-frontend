import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Navbar,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  ModalFooter,
  Input,
} from 'reactstrap';
import * as Icon from 'react-feather';
import Cookies from 'js-cookies';
import { ToggleMiniSidebar, ToggleMobileSidebar } from '../../store/customizer/CustomizerSlice';
import { ReactComponent as Logo } from '../../assets/images/logos/OPaqueLogo.svg';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/apps/auth/AuthSlice';
import axios from 'axios';
import Swal from 'sweetalert2';

const Header = ({ user }) => {
  const [modal, setModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const topbarColor = useSelector((state) => state.customizer.topbarBg);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    Cookies.removeItem('authToken');
    navigate('/auth1/login');
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword.length > 0) {
        const response = await axios.post(
          `http://localhost:5000/user/change-password`,
          { oldPassword: currentPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${Cookies.getItem('authToken')}`,
            },
          },
        );
        if (response.status === 200) {
          toggle();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Password changed successfully',
          });
        } else if (response.status === 201) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Current password is incorrect!',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Password cannot be empty!',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };

  return (
    <Navbar
      color={topbarColor}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="topbar"
    >
      <div className="d-flex align-items-center">
        <Button
          color={topbarColor}
          className="d-none d-lg-block"
          onClick={() => dispatch(ToggleMiniSidebar())}
        >
          <Icon.Menu size={22} />
        </Button>

        <Button
          color={topbarColor}
          className="d-sm-block d-lg-none"
          onClick={() => dispatch(ToggleMobileSidebar())}
        >
          <Icon.Menu size={22} />
        </Button>
      </div>

      <div className="d-flex align-items-center">
        <UncontrolledDropdown>
          <DropdownToggle color={topbarColor}>
            <Icon.User />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <div>
              <div className="d-flex gap-3 p-3 border-bottom pt-2 align-items-center">
                <span>
                  <h5 className="mb-0 fw-medium">{user.fullName}</h5>
                  <small className="text-muted">{user.email}</small>
                </span>
              </div>
              <DropdownItem toggle={false} className="px-4 py-3" onClick={() => toggle()}>
                <Icon.Lock size={20} className="text-muted" />
                &nbsp; Change Password
              </DropdownItem>
              <Modal fade={false} isOpen={modal} toggle={() => toggle()}>
                <ModalHeader toggle={() => toggle()} charCode="Y">
                  Change Password
                </ModalHeader>
                <ModalBody>
                  <Label for="currentPassword">Current Password</Label>
                  <Input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    id="currentPassword"
                    type="password"
                  />
                  <Label for="newPassword">New Password</Label>
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    id="newPassword"
                    type="password"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={handlePasswordChange}>
                    Confirm
                  </Button>
                  <Button color="secondary" onClick={() => toggle()}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
              <DropdownItem divider />
            </div>
            <div className="p-2 px-3">
              <Button onClick={handleLogout} color="danger" size="sm">
                Logout
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Navbar>
  );
};

export default Header;
