import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Card, CardContent, CardActions, Typography } from '@mui/material';
import { getCsrfToken } from '../../functions/utils';
import axios from 'axios';
import ModalComponent from '../modal/ModalComponent';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DialogCreateSprint(props) {
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [modalMainText, setModalMainText] = useState("");
    console.log(selectedTasks)

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
        setSelectedTasks([]);
        setOpen(false);
    };

    const handleTaskSelection = (taskId) => {
        setSelectedTasks((prevSelected) =>
            prevSelected.includes(taskId)
                ? prevSelected.filter((id) => id !== taskId)
                : [...prevSelected, taskId]
        );
    };

    const createSprintRequest = (data) => {
        const payload = {
            id: props.id,
            daily_meet_link: data.daily_meet_link,
            start_date: data.startDate,
            end_date: data.endDate,
            task_ids: selectedTasks,
        };

        axios
            .post("/api/projects/sprint/create", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                withCredentials: true
            })
            .then((response) => {
                props.fetchSprints();
                props.fetchTasks();
                handleClose();
                handleOpenModal("Stwórz sprint", response.data.message);
            })
            .catch((error) => {
                handleClose();
                handleOpenModal("Stwórz sprint", error.response.data.message);
            });
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Stwórz sprint
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
                        formJson.startDate = startDateRef.current ? startDateRef.current : null;
                        formJson.endDate = endDateRef.current ? endDateRef.current : null;
                        createSprintRequest(formJson);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>
                    Stwórz sprint
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Aby stworzyć sprint, proszę podaj niezbędne informacje.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="daily_meet_link"
                        label="Podaj link do codziennego spotkania (opcjonalne)"
                        type="textarea"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 3000 }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'DatePicker']} >
                            <DatePicker
                                label="Początek sprintu"
                                onChange={(newValue) => {
                                    startDateRef.current = newValue ? newValue.format('YYYY-MM-DD') : null;
                                }}
                            />
                            <DatePicker
                                label="Koniec sprintu"
                                onChange={(newValue) => {
                                    endDateRef.current = newValue ? newValue.format('YYYY-MM-DD') : null;
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' , flexDirection: "column"}}>
                        <DialogContentText style={{marginTop: '30px'}}>
                        Dodaj zadania do sprintu:
                    </DialogContentText>
                        {props.tasksData.map((task) => (
                            <Card key={task.id} style={{ width: '95%', margin: '8px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <CardContent>
                                    <Typography variant="h6">{task.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{task.description || "Brak opisu"}</Typography>
                                </CardContent>
                                <CardActions>
                                <Checkbox
                                        checked={selectedTasks.includes(task.id)}
                                        onChange={() => handleTaskSelection(task.id)}
                                    />
                                
                                </CardActions>
                            </Card>
                        ))}
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Odrzuć</Button>
                    <Button type="submit">Stwórz</Button>
                </DialogActions>
            </Dialog>
            <ModalComponent open={openModal}
                handleClose={handleCloseModal}
                header={modalHeader}
                mainText={modalMainText}>
            </ModalComponent>
        </>
    );
}
