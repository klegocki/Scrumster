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

export default function DialogChooseTask(props) {

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

  const createProjectRequest = (data) => {

    const payload = {
        title: data.title,
        description: data.description,
    }

    axios
    .post("/api/projects/create", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchUserProjects();
        handleClose();
        handleOpenModal("Stwórz projekt", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Stwórz projekt", error.response.data.message);
    });
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Stwórz projekt
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
            createProjectRequest(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>            
            Stwórz projekt
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Aby stworzyć projekt, proszę podaj niezbędne informacje.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="title"
            label="Podaj tytuł projektu"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 200 }}
          />
            <TextField
            autoFocus
            margin="dense"
            id="name"
            name="description"
            label="Podaj opis projektu (opcjonalne)"
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
