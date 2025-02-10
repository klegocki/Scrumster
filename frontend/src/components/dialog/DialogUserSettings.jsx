import { useState, useRef } from "react";
import DialogContentText from "@mui/material/DialogContentText";
import { getCsrfToken } from "../../functions/utils";
import axios from "axios";
import ModalComponent from "../modal/ModalComponent";
import {
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
  } from "@mui/material";

export default function DialogUserSettings(props) {

    const email = useRef('')
    const password1 = useRef('')
    const password2 = useRef('')
    const firstName = useRef('')
    const lastName = useRef('')
    const username = useRef('')

  const [openModal, setOpenModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalMainText, setModalMainText] = useState("");
  const handleOpenModal = (header, mainText) => {
    setModalHeader((prevModalHeader) => (prevModalHeader = header));
    setModalMainText((prevModalMainText) => (prevModalMainText = mainText));
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setEmailRequest = (emailInput) => {
    const payload = {
      email: emailInput,
    };

    axios
      .post("/api/users/set/email", payload, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        email.current = ''
        props.fetchUserInfo()
        handleClose();
        handleOpenModal("Zmień adres email", response.data.message);
      })
      .catch((error) => {
        email.current = ''
        handleClose();
        handleOpenModal("Zmień adres email", error.response.data.message);
      });
  };

  const setPasswordRequest = (password1Input, password2Input) => {
    const payload = {
      password1: password1Input,
      password2: password2Input,
    };

    axios
      .post("/api/users/set/password", payload, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        password1.current = ""
        password2.current = ""
        props.fetchUserInfo()
        handleClose();
        handleOpenModal("Zmień hasło", response.data.message);
      })
      .catch((error) => {
        password1.current = ""
        password2.current = ""
        handleClose();
        handleOpenModal("Zmień hasło", error.response.data.message);
      });
  };

  const setUsernameRequest = (usernameInput) => {
    const payload = {
      username: usernameInput,
    };

    axios
      .post("/api/users/set/username", payload, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        username.current = ""
        props.fetchUserInfo()
        handleClose();
        handleOpenModal("Zmien nazwę użytkownika", response.data.message);
      })
      .catch((error) => {
        username.current = ""
        handleClose();
        handleOpenModal("Zmien nazwę użytkownika", error.response.data.message);
      });
  };

  const setFirstAndLastNameRequest = (firstNameInput, lastNameInput) => {
    const payload = {
      first_name: firstNameInput,
      last_name: lastNameInput,
    };

    axios
      .post("/api/users/set/names", payload, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        withCredentials: true,
      })
      .then((response) => {
        firstName.current = ""
        lastName.current = ""
        props.fetchUserInfo()
        handleClose();
        handleOpenModal("Zmien imię i nazwisko", response.data.message);
      })
      .catch((error) => {
        firstName.current = ""
        lastName.current = ""
        handleClose();
        handleOpenModal("Zmien imię i nazwisko", error.response.data.message);
      });
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ustawiena
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const code = formJson.code;
            createProjectRequest(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>Ustawienia użytkownika</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Aby zmienić ustawienia użytkownika, wpisz dane i zatwierdź.
          </DialogContentText>


          <Box
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
              sx={{ marginBottom: "12px", fontWeight: "bold", color: "#333" }}
            >
              Zmień nazwę użytkownika:
            </Typography>

            <TextField
            required
            margin="dense"
            id="name"
            name="title"
            label="Podaj nazwę użytkownika"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 30 }}
            onChange={(e) => username.current = e.target.value}
            />

            <Button
              variant="outlined"
              onClick={() => setUsernameRequest(username.current)}
            >
              Zapisz
            </Button>

          </Box>
          <Box
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
              sx={{ marginBottom: "12px", fontWeight: "bold", color: "#333" }}
            >
              Zmień adres email:
            </Typography>

            <TextField
            required
            margin="dense"
            id="name"
            name="title"
            label="Podaj adres email"
            type="email"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 50 }}
            onChange={(e) => email.current = e.target.value}
            />

            <Button
              variant="outlined"
              onClick={() => setEmailRequest(email.current)}
            >
              Zapisz
            </Button>

          </Box>
          <Box
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
              sx={{ marginBottom: "12px", fontWeight: "bold", color: "#333" }}
            >
              Zmień hasło:
            </Typography>

            <TextField
            required
            margin="dense"
            id="name"
            name="title"
            label="Podaj hasło"
            type="password"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 200 }}
            onChange={(e) => password1.current = e.target.value}
            />

            <TextField
            required
            margin="dense"
            id="name"
            name="title"
            label="Podaj hasło ponownie"
            type="password"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 200 }}
            onChange={(e) => password2.current = e.target.value}
            />

            <Button
              variant="outlined"
              onClick={() => setPasswordRequest(password1.current, password2.current)}
            >
              Zapisz
            </Button>

          </Box>
          <Box
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
              sx={{ marginBottom: "12px", fontWeight: "bold", color: "#333" }}
            >
              Zmień imię i nazwisko:
            </Typography>

            <TextField
            required
            margin="dense"
            id="name"
            name="title"
            label="Zmień imię"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 30 }}
            onChange={(e) => firstName.current = e.target.value}
            />

            <TextField
            required
            margin="dense"
            id="name"
            name="title"
            label="Zmień nazwisko"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 30 }}
            onChange={(e) => lastName.current = e.target.value}
            />

            <Button
              variant="outlined"
              onClick={() => setFirstAndLastNameRequest(firstName.current, lastName.current)}
            >
              Zapisz
            </Button>

          </Box>

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
      ></ModalComponent>
    </>
  );
}
