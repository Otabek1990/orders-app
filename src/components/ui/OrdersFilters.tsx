import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
} from '@mui/material';

interface OrdersFiltersProps {
  onFilterChange: (filters: {
    customerName: string;
    status: string;
    startDate: string;
    endDate: string;
  }) => void;
  onReset: () => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({ onFilterChange, onReset }) => {
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      customerName,
      status,
      startDate,
      endDate,
    });
  };

  return (
    <Box mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search by Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Filter by Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Ожидает оплаты">Ожидает оплаты</MenuItem>
            <MenuItem value="Отправлен">Отправлен</MenuItem>
            <MenuItem value="Доставлен">Доставлен</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            type="date"
            fullWidth
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            type="date"
            fullWidth
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilterChange}
          >
            Apply Filters
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onReset}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrdersFilters;
