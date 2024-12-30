import { useState } from "react";
import DialogRemoveSprint from "../dialog/DialogRemoveSprint";

export default function SpringDashboardComponent(props){

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
            handleClose();

        })
        .catch((error) => {

            handleClose();
        
        });
    }

    
    return(<>
        <div className="task-box">
            <div style={titleStyle}>
                {title}
            </div>
            
            <DialogRemoveSprint setSprintsData={props.setSprintsData}
                                projectId={projectId}
                                sprintId={sprintId}
                                openParent={open}
                                handleClose={handleClose}
                                onGoingSprint={onGoingSprint}>
            </DialogRemoveSprint>
        </div>

        </>)
}