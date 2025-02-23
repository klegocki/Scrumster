import React, { useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Box,
} from "@mui/material";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import ModalComponent from "../modal/ModalComponent";

export default function DialogAssignRoles({
  projectId,
  projectUsers,
  fetchProject,
}) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalMainText, setModalMainText] = useState("");
  const [userRoles, setUserRoles] = useState(
    projectUsers.map((user) => ({
      id: user.id,
      role: user.role || "",
      customRole: "",
    }))
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenModal = (header, mainText) => {
    setModalHeader(header);
    setModalMainText(mainText);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleRoleChange = (userId, newRole) => {
    setUserRoles((prevRoles) =>
      prevRoles.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: newRole,
              customRole: newRole === "Developer" ? user.customRole : "",
            }
          : user
      )
    );
  };

  const handleCustomRoleChange = (userId, value) => {
    setUserRoles((prevRoles) =>
      prevRoles.map((user) =>
        user.id === userId ? { ...user, customRole: value } : user
      )
    );
  };

  const assignRoleRequest = (userId, role) => {
    
    const payload = {
      project_id: projectId,
      user_id: userId,
      role: role,
    };

    axios
      .post("/api/projects/set/role", payload, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        fetchProject();
        handleOpenModal("Ustaw rolę", response.data.message);
      })
      .catch((error) => {
        handleOpenModal("Ustaw rolę", error.response.data.message);
      });
  };

  const deleteRoleRequest = (userId) => {

    const payload = {
      project_id: projectId,
      user_id: userId,
    };

    axios
      .post("/api/projects/delete/role", payload, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        fetchProject();
        handleOpenModal("Ustaw rolę", response.data.message);
      })
      .catch((error) => {
        handleOpenModal("Ustaw rolę", error.response.data.message);
      });
  };

  return (
    <>
      <Button   sx={{
              fontSize: "1rem"
            }} variant="outlined" onClick={handleOpen}>
        Ustaw rolę
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Ustaw rolę członków zespołu
        </DialogTitle>
        <DialogContent dividers={true}>
          {projectUsers?.map((user) => {
            const userRole = userRoles.find((u) => u.id === user.id);
            return (
              <Box
                key={user.id}
                sx={{
                  border: "1px solid grey",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "12px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {user.first_name} {user.last_name}
                  <br />
                  {user.email}
                  <br />
                  {user.role ? user.role : "Brak roli"}
                </Typography>

                <FormControl fullWidth sx={{ marginBottom: "12px" }}>
                  <Typography
                    variant="body2"
                    sx={{ marginBottom: "12px", color: "#555" }}
                  >
                    Wybierz rolę
                  </Typography>
                  <Select
                    value={userRole.role || ""}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <MenuItem value="Scrum master">Scrum master</MenuItem>
                    <MenuItem value="Właściciel produktu">Właściciel produktu</MenuItem>
                    <MenuItem value="Developer">Deweloper</MenuItem>
                  </Select>
                </FormControl>
                {userRole.role === "Developer" && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{ marginBottom: "12px", color: "#555" }}
                    >
                      Szczegółowa rola (Deweloper)
                    </Typography>
                    <TextField
                      value={userRole.customRole || ""}
                      onChange={(e) =>
                        handleCustomRoleChange(user.id, e.target.value)
                      }
                      fullWidth
                      variant="outlined"
                      sx={{ marginBottom: "12px" }}
                    />
                  </>
                )}
                <Button
                  variant="outlined"
                  onClick={() => deleteRoleRequest(user.id)}
                >
                  Usuń rolę
                </Button>
                <Button
                  sx={{
                    float: "right",
                  }}
                  variant="outlined"
                  onClick={() =>
                    assignRoleRequest(
                      user.id,
                      userRole.role === "Developer"
                        ? userRole.customRole
                        : userRole.role
                    )
                  }
                >
                  Zapisz rolę
                </Button>
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Zamknij</Button>
        </DialogActions>
      </Dialog>
      <ModalComponent
        open={openModal}
        handleClose={handleCloseModal}
        header={modalHeader}
        mainText={modalMainText}
      />
    </>
  );
}
