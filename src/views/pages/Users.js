import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Cookies from 'js-cookies';
import { useEffect, useMemo, useState } from 'react';
import EditCellRender from '../renders/editCellRender';
import DeleteCellRender from '../renders/deleteCellRender';

const Users = () => {
  const [rowData, setRowData] = useState([]);

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

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
    };
  }, []);

  const allColumns = [
    { field: 'email' },
    { field: 'role' },
    { field: 'phone' },
    {
      field: 'edit',
      cellRenderer: EditCellRender,
      cellRendererParams: {
        fetchData: fetchData, // Pass fetchData as a prop
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
  };

  return (
    <div>
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
