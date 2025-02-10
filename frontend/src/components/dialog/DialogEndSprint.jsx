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

export default function DialogEndSprint(props) {

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

  const sprintReviewRequest = () => {
    const payload = {
        sprint_id: props.sprintId,
    }

    axios
    .post("/api/projects/sprint/end", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
        props.fetchTasks();
        props.fetchSprint();
        handleClose();
        handleOpenModal("Zakończ sprint", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Zakończ sprint", error.response.data.message);
    });
  }

  return (
    <>
      <Button variant="outlined"
              onClick={handleClickOpen}
              disabled={props.role === "Scrum master" || props.role ==="Administrator projektu" ? (false) : (true)}>
        Zakończ sprint
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}>
        <DialogTitle>            
            Zakończ sprint
        </DialogTitle>
        <DialogContent>
          <DialogContentText>

            Czy chcesz zakończyć sprint?<br/> Wszystkie zadania z kolumn "To Do", oraz "In Progress", zostaną <br/>z powrotem dodane do backlogu produktu.

          </DialogContentText>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Odrzuć</Button>
        
              <Button onClick={sprintReviewRequest}>Zakończ</Button>
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
