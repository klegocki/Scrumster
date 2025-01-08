import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ModalComponent from '../modal/ModalComponent';
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";

export default function DialogRevertTaskToBacklog(props) {


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


const reassignTaskToSprintBacklog = () => {

    const payload = {
        task_id: props.taskId,
    }

    axios
    .post("/api/projects/sprint/task/revert", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchTasks();
        handleClose();
        handleOpenModal("Przywrócenie zadania do backlogu sprintu", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Przywrócenie zadania do backlogu sprintu", error.response.data.message);
    });
}

  return (
    <>
            <IconButton sx={{
                        width: 25,
                        height: 25,
                        backgroundColor: 'hsl(0, 100%, 43%)',
                        borderRadius: '5px',
                        margin: '5px',
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        '&:hover': {
                            backgroundColor: 'hsl(0, 100%, 37%)',
                        }}}  
                        className="project-component-remove-button"
                        onClick={handleClickOpen}>
                    <DeleteIcon/>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
            Przywrócenie zadania do backlogu sprintu
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Czy na pewno chcesz przywrócić zadanie do backlogu sprintu?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Odrzuć</Button>
            <Button onClick={reassignTaskToSprintBacklog} autoFocus>
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
