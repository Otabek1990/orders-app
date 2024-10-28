import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { Order } from "../../types/order.types";
import { useUpdateOrderMutation } from "../../services/orderApi";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { nanoid } from "@reduxjs/toolkit";
import Loader from "./Loader";

interface EditOrderModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({
  open,
  onClose,
  order,
}) => {
  const { control, handleSubmit, reset, register, watch } = useForm<Order>({
    defaultValues: {
      products: order.products || [], // Initialize with order products
      createdAt: order.createdAt || new Date().toISOString().split("T")[0],
      customerName: order.customerName || "",
      orderNumber: order.orderNumber || "",
      status: order.status || "Ожидает оплаты",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const [editOrder, { isLoading, error }] = useUpdateOrderMutation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Watch products array to calculate total amount dynamically
  const products = watch("products");
  const totalAmount = products.reduce(
    (acc, product) => acc + product.quantity * product.price,
    0
  );

  // Reset form values whenever the `order` prop changes
  useEffect(() => {
    if (order) {
      reset(order); // Populate form with order data
    }
  }, [order, reset]);

  const onSubmit = async (data: Order) => {
    try {
      const payload = { ...data, totalAmount, id: order.id }; // Include totalAmount
      await editOrder(payload).unwrap();
      reset();
      setOpenSnackbar(true);
      onClose();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Edit Order
          </Typography>

          {isLoading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Customer Name"
                fullWidth
                {...register("customerName", { required: true })}
                margin="normal"
              />
              <TextField
                label="Order Number"
                fullWidth
                {...register("orderNumber", { required: true })}
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value="Ожидает оплаты">Ожидает оплаты</MenuItem>
                      <MenuItem value="Отправлен">Отправлен</MenuItem>
                      <MenuItem value="Доставлен">Доставлен</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              <Typography variant="h6" mt={2} mb={1}>
                Products
              </Typography>

              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  display="flex"
                  gap={2}
                  alignItems="center"
                  mb={1}
                >
                  <TextField
                    label="Product Name"
                    {...register(`products.${index}.name`, { required: true })}
                  />
                  <TextField
                    label="Quantity"
                    type="number"
                    {...register(`products.${index}.quantity`, {
                      required: true,
                    })}
                  />
                  <TextField
                    label="Price"
                    type="number"
                    {...register(`products.${index}.price`, { required: true })}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}

              <Button
                variant="outlined"
                onClick={() =>
                  append({ name: "", quantity: 0, price: 0, id: nanoid() })
                }
              >
                Add Product
              </Button>

              <Typography variant="h6" mt={2}>
                Total Amount: {totalAmount} UZS
              </Typography>

              <Box mt={2} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Edit
                </Button>
              </Box>
            </form>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to update the order. Please try again.
            </Alert>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Order updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditOrderModal;
