import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Cookies from 'js-cookies';
import { useEffect, useMemo, useState } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import ComponentCard from '../../components/ComponentCard';

require('moment/locale/en-gb');

const Competitor = () => {
  const [rowData, setRowData] = useState([]);
  const [date, setDate] = useState(moment());

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

  useEffect(() => {
    fetchData();
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    };
  }, []);

  const allColumns = [
    { field: 'addedDate' },
    { field: 'date' },
    { field: 'name' },
    { field: 'quantity' },
    { field: 'rate' },
    { field: 'top' },
    { field: 'grade' },
    { field: 'supplier' },
  ];

  // const getColumnDefs = () => {
  //   return allColumns.filter((col) => visibleColumns[col.field]);
  // };

  const autoSizeStrategy = {
    type: 'fitGridWidth',
    defaultMinWidth: 280,
    columnLimits: [
      {
        colId: 'addedDate',
        minWidth: 120,
      },
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
  const handleDateChange = async (date1) => {
    setDate(date1);
    fetchData(date1);
  };
  useEffect(() => {
    fetchData(date);
  }, []);
  return (
    <div>
      <h1>Competitors</h1>
      <ComponentCard title="Select the date ">
        <Datetime
          locale="en-gb"
          timeFormat={false}
          inputProps={{ placeholder: 'Please Select Date' }}
          value={date}
          onChange={(date1) => handleDateChange(date1)}
        />
      </ComponentCard>

      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          autoSizeStrategy={autoSizeStrategy}
          defaultColDef={defaultColDef}
          rowData={rowData}
          columnDefs={allColumns}
          pagination
        />
      </div>
    </div>
  );
};

export default Competitor;
