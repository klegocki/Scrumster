import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import { Card, CardContent, CardActions, Typography } from '@mui/material';
import { getCsrfToken } from '../../functions/utils';
import axios from 'axios';
import ModalComponent from '../modal/ModalComponent';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


export default function DialogAddTasksToSprint(props) {
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const [selectedTasks, setSelectedTasks] = useState([]);
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

    const addTasksToSprint = () => {
        const payload = {
            sprint_id: props.sprintId,
            project_id: props.projectId,
            task_ids: selectedTasks,
        };

        axios
            .post("/api/projects/sprint/add/tasks", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                withCredentials: true
            })
            .then((response) => {
                props.fetchSprint();
                props.fetchTasks();
                props.fetchProjectBacklogTasks();
                handleClose();
                handleOpenModal("Dodaj zadania", response.data.message);
            })
            .catch((error) => {
                handleClose();
                handleOpenModal("Dodaj zadania", error.response.data.message);
            });
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Dodaj zadania
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        addTasksToSprint();
                        handleClose();
                    },
                }}
            >
                <DialogTitle>
                    Dodaj zadania
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Aby dodać zadanie, proszę zaznacz je poniżej.
                        
                    </DialogContentText>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' , flexDirection: "column"}}>
                        <DialogContentText style={{marginTop: '30px'}}>
                        Dodaj zadania do sprintu:
                    </DialogContentText>
                        {props.tasksData.map((task) => (
                            <Card key={task.id} style={{ width: '95%', margin: '8px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <CardContent>
                                    <div    style={{ 
                                            display: 'flex', 
                                            alignItems: 'center' 
                                        }}>
                                    <Checkbox
                                        checked={selectedTasks.includes(task.id)}
                                        onChange={() => handleTaskSelection(task.id)}
                                    />
                                    <Typography variant="h6">{task.title}</Typography>
                                    </div>
                                    <Typography variant="body2" color="textSecondary">{task.description || "Brak opisu"}</Typography>
                                </CardContent>

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
