import React, {  useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Order } from "../../types/order.types";
import { useAddOrderMutation } from "../../services/orderApi";
import Loader from "./Loader";
import { nanoid } from "@reduxjs/toolkit";

interface AddOrderModalProps {
  open: boolean;
  onClose: () => void;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ open, onClose }) => {
  const { control, handleSubmit, reset, register, watch } = useForm<Order>({
    defaultValues: {
      products: [{ name: "", quantity: 0, price: 0,id:nanoid() }],
      createdAt: new Date().toISOString().split("T")[0], // Bugungi sana: YYYY-MM-DD formatida
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const [addOrder, { isLoading, error }] = useAddOrderMutation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Mahsulotlarning umumiy summasini hisoblash
  const products = watch("products");
  const totalAmount = products.reduce(
    (acc, product) => acc + product.quantity * product.price,
    0
  );

  const onSubmit = async (data: Order) => {
    try {
      const payload = { ...data, totalAmount }; // TotalAmountni payloadga qo'shish
      await addOrder(payload).unwrap();
      reset();
      setOpenSnackbar(true);
      onClose();
    } catch (err) {
      console.error("Order qo‘shishda xato:", err);
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
            Add New Order
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
                  defaultValue="Ожидает оплаты"
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
                  Add 
                </Button>
              </Box>
            </form>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to add the order. Please try again.
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
          Order added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddOrderModal;
