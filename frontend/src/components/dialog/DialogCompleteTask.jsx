import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ModalComponent from '../modal/ModalComponent';
import { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";

export default function DialogCompleteTask(props) {


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
    .post("/api/tasks/completion", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchTasks();
        handleClose();
        handleOpenModal("Zakończenie zadania", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Zakończenie zadania", error.response.data.message);
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
                        className="project-component-remove-button"
                        onClick={handleClickOpen}>
                    <SendIcon/>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
            Zakończenie zadania
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Czy na pewno chcesz zakończyć zadanie?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Odrzuć</Button>
            <Button onClick={completeTaskRequest} autoFocus>
                Potwierdź
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
