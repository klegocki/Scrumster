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
import { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

export default function DialogDeveloperTask(props) {

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

  const assignUserToTaskRequest = (data) => {

    const payload = {
        task_id: props.taskId,
        estimated_hours: data.estimated_time,
        git_link: data.git_link
    }

    axios
    .post("/api/tasks/set/user", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchTasks();
        handleClose();
        handleOpenModal("Wybierz zadanie", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Wybierz zadanie", error.response.data.message);
    });
  }

  return (
    <>
    <IconButton sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '5px',
                        margin: '5px',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                backgroundColor: 'hsl(125, 100%, 42%)',
                '&:hover': {
                    backgroundColor: 'hsl(125, 100%, 37%)',
                }}}  
                onClick={handleClickOpen}>
            <SendIcon/>
    </IconButton>
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
            assignUserToTaskRequest(formJson);
            handleClose();
          },
        }}
      >
        <DialogTitle>            
            Wybierz zadanie
        </DialogTitle>
        
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
                Aby podjąć się zadania, wpisz czas potrzebny na wykonanie oraz link do strony kontroli wersji.
            </DialogContentText>
            <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="estimated_time"
                label="Podaj czas wykonania zadania w godzinach"
                type="text"
                fullWidth
                variant="standard"
                inputProps={{
                    maxLength: 5,
                    inputMode: "decimal",
                }}
                onChange={(event) => {

                    const value = event.target.value;
                    const regex = /^[0-9]{0,3}(\.[0-9]?)?$/;

                    if (regex.test(value)) {
                    event.target.value = value;
                    } else {
                    event.target.value = value.slice(0, -1);
                    }
                }}
            />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                name="git_link"
                label="Podaj link do strony kontroli wersji"
                type="text"
                fullWidth
                variant="standard"
                inputProps={{
                    maxLength: 600,
                }}

            />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Odrzuć</Button>
          <Button type="submit">Wybierz</Button>
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
