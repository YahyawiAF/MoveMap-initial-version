import React, { useState } from "react";
import { DataGrid } from '@material-ui/data-grid';
import useMobileDetect from 'hooks/useMobileDetect';

export default function DataTable({ data, columns, idColumnName, onRowClick }) {
  const { isMobile } = useMobileDetect();
  return (
    <div style={{ height: isMobile ? 460 : 600, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        disableSelectionOnClick
        getRowId={(row) => row[idColumnName]}
        onRowClick={(params) => onRowClick(params.row)}
        density="compact"
        pageSize={isMobile ? 10 : 100}
        rowsPerPageOptions={isMobile ? [10] : [100]}
      />
    </div>
  );
}
