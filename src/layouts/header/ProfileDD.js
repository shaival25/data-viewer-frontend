import React, { useState } from 'react';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { Lock } from 'react-feather';

const ProfileDD = ({ user }) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const handleChangePassword = () => {};
  return (
    <div>
      <div className="d-flex gap-3 p-3 border-bottom pt-2 align-items-center">
        <span>
          <h5 className="mb-0 fw-medium">{user.fullName}</h5>
          <small className="text-muted">{user.email}</small>
        </span>
      </div>
      <DropdownItem toggle={false} className="px-4 py-3" onClick={() => toggle()}>
        <Lock size={20} className="text-muted" />
        &nbsp; Change Password
      </DropdownItem>
      <Modal isOpen={modal} toggle={() => toggle()}>
        <ModalHeader toggle={() => toggle()} charCode="Y">
          Change Password
        </ModalHeader>
        <ModalBody>
          <Label for="currentPassword"></Label>
          <Input id="currentPassword" type="password" />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleChangePassword}>
            Confirm
          </Button>
          <Button color="secondary" onClick={() => toggle()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <DropdownItem divider />
    </div>
  );
};

export default ProfileDD;
