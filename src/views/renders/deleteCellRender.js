import axios from 'axios';
import React, { useState } from 'react';
import { Trash2 } from 'react-feather';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Cookies from 'js-cookies';
import Swal from 'sweetalert2';

const DeleteCellRender = ({ data, fetchData }) => {
  const [modal7, setModal7] = useState(false);

  const toggle7 = () => {
    setModal7(!modal7);
  };

  const handleUserDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/user/${data._id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
        },
      });
      if (response.status === 200) {
        fetchData();
        toggle7();
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'User deleted successfully',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div onClick={toggle7.bind(null)}>
        <Trash2 />
      </div>
      <Modal isOpen={modal7} toggle={toggle7.bind(null)}>
        <ModalHeader toggle={toggle7.bind(null)} charCode="Y">
          Delete user
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this user?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleUserDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggle7.bind(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteCellRender;
