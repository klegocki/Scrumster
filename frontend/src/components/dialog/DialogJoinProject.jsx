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

export default function DialogJoinProject(props) {

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

  const projectJoinRequest = (code) => {

    const payload = {
        invite_code: code,
    }

    axios
    .post("/api/projects/join", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchUserProjects();
        handleClose();
        handleOpenModal("Dołącz do projektu", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Dołącz do projektu", error.response.data.message);
    });
  }

  return (
    <>
      <Button sx={{
        fontSize: '1rem'
      }} variant="outlined" onClick={handleClickOpen}>
        Dołącz do projektu
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
            projectJoinRequest(code);
            handleClose();
          },
        }}
      >
        <DialogTitle>            
            Dołącz do projektu
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Aby dołączyć do zespołu, podaj kod projektu podany przez właściciela.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="code"
            label="Podaj kod zespołu"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 10 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Odrzuć</Button>
          <Button type="submit">Dołącz</Button>
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
