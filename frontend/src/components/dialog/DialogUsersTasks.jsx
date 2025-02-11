import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Card, CardContent, Typography } from '@mui/material';
import { getCsrfToken } from '../../functions/utils';
import axios from 'axios';



export default function DialogUsersTasks(props) {

    const [open, setOpen] = useState(false);
    const [usersTasks, setUsersTasks] = useState([])
    const searchTextRef = useRef(null);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchUsersTasks = () => {

        const payload = {
            project_id: props.projectId,
            user_id: props.userId
        }
  
        axios
          .get("/api/projects/get/users/tasks", {
            params: payload,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCsrfToken(),
            },
            withCredentials: true 
          })
          .then((response) => {
            setUsersTasks(prevUsersTasks => prevUsersTasks = response.data)
          })
          .catch((error) => {
        });
      };


      const searchUsersTasks = (data) => {

        const payload = {
            project_id: props.projectId,
            user_id: props.userId,
            search: data
        }
  
        axios
          .get("/api/projects/search/users/tasks", {
            params: payload,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCsrfToken(),
            },
            withCredentials: true 
          })
          .then((response) => {
            setUsersTasks(prevUsersTasks => prevUsersTasks = response.data)
          })
          .catch((error) => {
        });
      };
      useEffect(() => {
        fetchUsersTasks()
      }, [])

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Zadania
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                Zadania użytkownika {props.firstName + " " + props.lastName}:                        
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="search"
                        label="Wyszukaj zadanie"
                        type="textarea"
                        fullWidth
                        variant="standard"
                        inputRef={searchTextRef}
                        inputProps={{ maxLength: 20 }}
                    />
                    <Button onClick={() => searchUsersTasks(searchTextRef.current.value)}>Wyszukaj</Button>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' , flexDirection: "column"}}>
                        {usersTasks?.map((task) => (
                            <Card key={task.id} style={{ width: '95%', margin: '8px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <CardContent>
                                    <Typography variant="h6">{task.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{task.description || "Brak opisu"}</Typography>
                                    <Typography variant="body2" color="textSecondary">{task.status || "Brak statusu"}</Typography>
                                    <Typography variant="body2" color="textSecondary">{task.sprint || "Brak sprintu"}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Odrzuć</Button>
                </DialogActions>
            </Dialog>

        </>
    );
}
