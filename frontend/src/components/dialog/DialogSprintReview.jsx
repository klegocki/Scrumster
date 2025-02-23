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

export default function DialogSprintReview(props) {

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

  const sprintReviewRequest = (data) => {
    const payload = {
        sprint_id: props.sprintId,
        sprint_review: data,
    }

    axios
    .post("/api/projects/sprint/review/set", payload,{
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      withCredentials: true 
    })
    .then((response) => {
      props.fetchSprint()
        handleClose();
        handleOpenModal("Raport sprintu", response.data.message);
    })
    .catch((error) => {
        handleClose();
        handleOpenModal("Raport sprintu", error.response.data.message);
    });
  }

  return (
    <>
      <Button   sx={{
              fontSize: "1rem"
            }} variant="outlined" onClick={handleClickOpen}>
        Raport sprintu
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
            sprintReviewRequest(code);
            handleClose();
          },
        }}
      >
        <DialogTitle>            
            Raport sprintu
        </DialogTitle>
        <DialogContent>
          <DialogContentText>

            {props.role !== "Scrum master" ? (
              props.sprintReview !== "" && props.sprintReview !== null? (props.sprintReview) : ("Brak raportu sprintu.")
            ) : (null)}

          </DialogContentText>
          {props.role === "Scrum master" ? (

            <TextField
              required
              margin="dense"
              id="sprintReview"
              name="code"
              label="Uzupełnij raport sprintu"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={7}
              inputProps={{ maxLength: 3000 }}
              defaultValue={props.sprintReview !== "" ? props.sprintReview : null}
              sx={{
                minWidth: '400px',
                width: '100%',
              }}
            />
            
            ) : (null)}


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Odrzuć</Button>
          {props.role === "Scrum master" ? (          
              <Button type="submit">Zapisz</Button>
            ) : (null)}
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
