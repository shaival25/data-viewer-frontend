import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'react-datetime/css/react-datetime.css';
import Cookies from 'js-cookies';
import { useEffect, useMemo, useState } from 'react';
import Datetime from 'react-datetime';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import moment from 'moment';
import ComponentCard from '../../components/ComponentCard';
import { Calendar, Trash2 } from 'react-feather';

require('moment/locale/en-gb');

const Competitor = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [date, setDate] = useState(moment());
  const [modal7, setModal7] = useState(false);
  const toggle7 = () => {
    setModal7(!modal7);
  };
  const allColumns = [
    { field: 'delete', headerName: '', headerCheckboxSelection: true, checkboxSelection: true },
    { field: 'addedDate' },
    { field: 'date' },
    { field: 'name' },
    { field: 'quantity' },
    { field: 'rate' },
    { field: 'top' },
    { field: 'grade' },
    { field: 'supplier' },
  ];

  const autoSizeStrategy = {
    type: 'fitGridWidth',
    defaultMinWidth: 100,
    columnLimits: [
      {
        colId: 'delete',
        minWidth: 50,
      },
      {
        colId: 'addedDate',
        minWidth: 120,
      },
      {
        colId: 'date',
        minWidth: 120,
      },
      {
        colId: 'name',
        minWidth: 200,
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
        colId: 'grade',
        minWidth: 200,
      },
      {
        colId: 'supplier',
        minWidth: 100,
      },
    ],
  };

  const fetchData = async (date1) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/competitors/date`,
        {
          date: date1.format('DD-MM-YYYY'),
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.getItem('authToken')}`,
          },
        },
      );
      if (response.status === 200) {
        response.data.map((item) => {
          item.date = item.date.split('T')[0];
        });

        setRowData(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRowDelete = async () => {
    const rowsId = selectedRows.map((row) => row._id);
    try {
      const response = await axios.delete(`http://localhost:5000/competitors/`, {
        data: {
          rowsId,
        },
        headers: {
          Authorization: `Bearer ${Cookies.getItem('authToken')}`,
        },
      });
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
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

  const handleDateChange = async (date1) => {
    setDate(date1);
    fetchData(date1);
  };

  useEffect(() => {
    fetchData(date);
  }, []);

  return (
    <div>
      <h1>Delete Data</h1>
      <Row>
        <Col>
          {' '}
          <ComponentCard title="Select the date ">
            <Datetime
              locale="en-gb"
              timeFormat={false}
              inputProps={{ placeholder: 'Please Select Date' }}
              value={date}
              onChange={(date1) => handleDateChange(date1)}
            />
          </ComponentCard>
        </Col>
      </Row>
      {selectedRows.length > 0 && (
        <>
          <Row>
            <Col>
              <span onClick={toggle7.bind(null)}>
                <Trash2 style={{ width: '15px', height: '15px', color: 'red' }} />
              </span>
              <Modal isOpen={modal7} toggle={toggle7.bind(null)}>
                <ModalHeader toggle={toggle7.bind(null)} charCode="Y">
                  Delete data
                </ModalHeader>
                <ModalBody>Are you sure you want to delete the selected rows?</ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={handleRowDelete}>
                    Confirm
                  </Button>
                  <Button color="secondary" onClick={toggle7.bind(null)}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
        </>
      )}

      <div
        className="ag-theme-quartz mt-2" // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          autoSizeStrategy={autoSizeStrategy}
          defaultColDef={defaultColDef}
          rowData={rowData}
          columnDefs={allColumns}
          pagination
          rowSelection={'multiple'}
          suppressRowClickSelection={true}
          onRowSelected={(event) => {
            setSelectedRows(event.api.getSelectedRows());
          }}
        />
      </div>
    </div>
  );
};

export default Competitor;
