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

export default function DialogRemoveSprint(props) {


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


  const deleteSprint = () => {

    const payload = {
        id: props.projectId,
        sprintId: props.sprintId,
    }

    axios
    .post("/api/projects/sprint/delete", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {

        props.setSprintsData(prevSprintsData => {
            if (!prevSprintsData.length) return prevSprintsData;

            const updatedSprints = { ...prevSprintsData[0] };
            updatedSprints.ongoing = updatedSprints.ongoing.filter(
                (currentSprint) => currentSprint.id !== props.sprintId
            );
            updatedSprints.future = updatedSprints.future.filter(
                (currentSprint) => currentSprint.id !== props.sprintId
            );
            updatedSprints.ended = updatedSprints.ended.filter(
                (currentSprint) => currentSprint.id !== props.sprintId
            );

            return [updatedSprints];
        })

        handleOpenModal("Usunięcie sprintu.", response.data.message);
        handleClose();

    })
    .catch((error) => {

        handleClose();
        handleOpenModal("Usunięcie sprintu.", error.response.data.message);
    
    });
}

  return (
    <>
            {props.onGoingSprint ? (null) : (
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
            </IconButton>)}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
                Usunąć sprint?
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Usunięcie sprintu jest nieodwracalne.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Odrzuć</Button>
            <Button onClick={deleteSprint} autoFocus>
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
