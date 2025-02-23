import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ModalComponent from '../modal/ModalComponent';
import { IconButton } from "@mui/material";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import CheckIcon from '@mui/icons-material/Check';

export default function DialogApproveTask(props) {


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


const completeTaskRequest = () => {

    const payload = {
        task_id: props.taskId,
    }

    axios
    .post("/api/projects/sprint/task/approval", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchTasks();
        handleClose();
        handleOpenModal("Potwierdzenie zadania", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Potwierdzenie zadania", error.response.data.message);
    });
}

const rejectTaskRequest = () => {

  const payload = {
      task_id: props.taskId,
  }

  axios
  .post("/api/projects/sprint/task/rejection", payload,{
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCsrfToken(),
    },
    withCredentials: true 
  })
  .then((response) => {
      props.fetchTasks();
      handleClose();
      handleOpenModal("Potwierdzenie zadania", response.data.message);
  })
  .catch((error) => {
      handleClose();
      handleOpenModal("Potwierdzenie zadania", error.response.data.message);
  });
}

  return (
    <>
            <IconButton sx={{
                        width: 25,
                        height: 25,
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
                    <CheckIcon/>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
            Potwierdzenie zadania
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Czy zadanie zostało zakończone powodzeniem?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Odrzuć</Button>
            <Button onClick={rejectTaskRequest} autoFocus>
                Nie
            </Button>
            <Button onClick={completeTaskRequest} autoFocus>
                Tak
            </Button>
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
