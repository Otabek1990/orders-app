import { useState } from "react";
import AddOrderModal from "../../components/ui/AddOrderModal";
import { Box, Button, Typography } from "@mui/material";
import OrdersTable from "../../components/ui/OrdersTable";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div style={{padding:"10px 50px"}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        {/* Orders yozuvi */}
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Orders
        </Typography>

        {/* Add New Order tugmasi */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            fontWeight: "bold",
            borderRadius: "12px",
            padding: "10px 20px",
          }}
          onClick={handleOpenModal}
        >
          Add New Order
        </Button>
      </Box>
      <OrdersTable/>
      <AddOrderModal open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default Home;
