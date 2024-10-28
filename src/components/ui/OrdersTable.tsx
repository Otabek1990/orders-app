import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  Box,
  Snackbar,
  TablePagination, // Import TablePagination
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useDeleteOrderMutation, useGetOrdersQuery } from "../../services/orderApi";
import EditOrderModal from "./EditOrderModal"; // Import the modal component
import { Order } from "../../types/order.types";
import DeleteModal from "./DeleteModal";
import OrdersFilters from "./OrdersFilters";



type OrderBy = keyof Omit<Order, "products" | "createdAt" | "id">;

const OrdersTable: React.FC = () => {
  const { data: orders, isLoading, isError, isSuccess } = useGetOrdersQuery();
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<OrderBy>("customerName");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Track selected order for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [deleteModal] = useDeleteOrderMutation();
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(3); // State for rows per page

  const openDeleteModal = (id: number) => {
    console.log("del");
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      deleteModal(selectedId);
      setIsSnackbarOpen(true);
      closeDeleteModal();
    }
  };

  useEffect(() => {
    if (orders) setLocalOrders(orders);
  }, [orders]);

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };
 

  const [filters, setFilters] = useState({
    customerName: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // ... existing functions ...

  // Function to apply filters
  const handleFilterChange = (newFilters: {
    customerName: string;
    status: string;
    startDate: string;
    endDate: string;
  }) => {
    setFilters(newFilters);
  };

  // Function to reset filters
  const handleResetFilters = () => {
    setFilters({
      customerName: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setFilteredOrders(localOrders)
  };

  useEffect(() => {
    if (orders) {
      setLocalOrders(orders);
      let filtered = orders;

      // Apply filters
      if (filters.customerName) {
        filtered = filtered.filter((order) =>
          order.customerName
            .toLowerCase()
            .includes(filters.customerName.toLowerCase())
        );
      }

      if (filters.status) {
        filtered = filtered.filter((order) => order.status === filters.status);
      }

      if (filters.startDate) {
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= new Date(filters.startDate)
        );
      }

      if (filters.endDate) {
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) <= new Date(filters.endDate)
        );
      }

      setFilteredOrders(filtered);
    }
  }, [orders, filters]);
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load orders</Alert>;
  if (isSuccess && localOrders.length) {
   

    return (
      <>
        <OrdersFilters
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "customerName"}
                    direction={
                      orderBy === "customerName" ? orderDirection : "asc"
                    }
                    onClick={() => handleSort("customerName")}
                  >
                    Customer Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "orderNumber"}
                    direction={
                      orderBy === "orderNumber" ? orderDirection : "asc"
                    }
                    onClick={() => handleSort("orderNumber")}
                  >
                    Order Number
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === "totalAmount"}
                    direction={
                      orderBy === "totalAmount" ? orderDirection : "asc"
                    }
                    onClick={() => handleSort("totalAmount")}
                  >
                    Total Amount ($)
                  </TableSortLabel>
                </TableCell>
                <TableCell>Detail</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders
                .sort((a, b) => (a.customerName > b.customerName ? 1 : -1))
                ?.map((order: Order, index) => (
                  <React.Fragment key={order.id}>
                    <TableRow>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell align="right">{order.totalAmount}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => toggleRowExpansion(order.id)}
                        >
                          {expandedRowId === order.id ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(order)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => openDeleteModal(+order.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={expandedRowId === order.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Product Name</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell>Quantity</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.products.map((product, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[3, 5, 10]} // Options for rows per page
          component="div"
          count={localOrders.length} // Total number of rows
          rowsPerPage={rowsPerPage} // Current rows per page
          page={page} // Current page
          onPageChange={handleChangePage} // Function to handle page change
          onRowsPerPageChange={handleChangeRowsPerPage} // Function to handle rows per page change
        />

        {/* Edit Order Modal */}
        {selectedOrder && (
          <EditOrderModal
            open={isModalOpen}
            onClose={handleModalClose}
            order={selectedOrder}
          />
        )}
        {isDeleteModalOpen && (
          <DeleteModal
            isModalOpen={isDeleteModalOpen}
            closeModal={closeDeleteModal}
            handleDelete={handleDelete}
          />
        )}
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setIsSnackbarOpen(false)}
          message="Order deleted successfully!"
        />
      </>
    );
  }

  return null; // If no orders to display
};

export default OrdersTable;
