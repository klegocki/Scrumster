import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getCsrfToken } from '../../functions/utils';
import axios from 'axios';
import ModalComponent from '../modal/ModalComponent';

export default function DialogCreateTask(props) {

    const [openModal, setOpenModal] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [modalMainText, setModalMainText] = useState("");
    const handleOpenModal = (header, mainText) => {
        setModalHeader(prevModalHeader => prevModalHeader = header);
        setModalMainText(prevModalMainText => prevModalMainText = mainText);
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

  const createTaskRequest = (data) => {

    const payload = {
        id: props.id,
        title: data.title,
        description: data.description,
    }

    axios
    .post("/api/projects/task/create", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchTasks();
        handleClose();
        handleOpenModal("Stwórz zadanie", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Stwórz zadanie", error.response.data.message);
    });
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Dodaj Zadania
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const code = formJson.code;
            createTaskRequest(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>            
            Stwórz zadanie
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Aby stworzyć zadanie, proszę podaj niezbędne informacje.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="title"
            label="Podaj tytuł zadania"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 60 }}
          />
            <TextField
            autoFocus
            margin="dense"
            id="name"
            name="description"
            label="Podaj opis zadania (opcjonalne)"
            type="textarea"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 3000 }}
            />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Odrzuć</Button>
          <Button type="submit">Stwórz</Button>
        </DialogActions>
      </Dialog>
      <ModalComponent   open={openModal} 
                        handleClose={handleCloseModal} 
                        header={modalHeader} 
                        mainText={modalMainText}>
      </ModalComponent>
    </>
  );
}
