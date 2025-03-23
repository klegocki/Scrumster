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

export default function DialogRemoveSprintTask(props) {


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


const deleteTask = () => {

    const payload = {
        task_id: props.taskId,
    }

    axios
    .post("/api/projects/sprint/task/delete", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchTasks();
        handleClose();
        handleOpenModal("Usunąć zadanie ze sprintu?", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Usunąć zadanie ze sprintu?", error.response.data.message);
    });
}

  return (
    <>
            <IconButton sx={{
                        width: 30,
                        height: 30,
                        backgroundColor: 'hsl(0, 100%, 43%)',
                        borderRadius: '5px',
                        margin: '10px',
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
                Usunąć zadanie ze sprintu?
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Czy na pewno chcesz usunąć zadanie ze sprintu?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Odrzuć</Button>
            <Button onClick={deleteTask} autoFocus>
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
