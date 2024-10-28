import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

interface DeleteModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  handleDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isModalOpen,
  closeModal,
  handleDelete,
}) => {
  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Are you sure?
        </Typography>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
