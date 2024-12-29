import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";

export default function TaskBoxComponent(props){

    const {taskId, title, projectId} = props

    const titleStyle = {
        display: 'flex',
        alignItems: 'center',
        width: "100%",
        minWidth: "200px",
        height: '75%',
        backgroundColor: 'hsl(214, 90%, 60%)',
        borderRadius: '5px',
        margin: '10px',
        paddingLeft: '5px',
        color: 'black',
        fontWeight: "bold",
    }  
    
    const deleteTask = () => {

        const payload = {
            id: projectId,
            taskId: taskId,
        }

        axios
        .post("/api/projects/task/delete", payload,{
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true 
        })
        .then((response) => {
            console.log(response.data)
            props.setTasksData(prevTasksInfo => prevTasksInfo.filter((currentTask)=>currentTask.id !== taskId))
        })
        .catch((error) => {

        });
    }

    return(<>
        <div className="task-box">
            <div style={titleStyle}>
                {title}
            </div>
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
                        onClick={deleteTask}>
                    <DeleteIcon/>
            </IconButton>
        </div>
        </>)
}