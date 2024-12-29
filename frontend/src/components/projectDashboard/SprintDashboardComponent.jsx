import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";

export default function SpringDashboardComponent(props){

    const {title, onGoingSprint, sprintId, projectId} = props

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
    
    const deleteSprint = () => {

        const payload = {
            id: projectId,
            sprintId: sprintId,
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
                    (currentSprint) => currentSprint.id !== sprintId
                );
                updatedSprints.future = updatedSprints.future.filter(
                    (currentSprint) => currentSprint.id !== sprintId
                );
                updatedSprints.ended = updatedSprints.ended.filter(
                    (currentSprint) => currentSprint.id !== sprintId
                );

                return [updatedSprints];
            })
        
        })
        .catch((error) => {

        });
    }

    return(<>
        <div className="task-box">
            <div style={titleStyle}>
                {title}
            </div>
            {onGoingSprint ? (null) : (
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
                        onClick={deleteSprint}>
                    <DeleteIcon/>
            </IconButton>)}
        </div>
        </>)
}