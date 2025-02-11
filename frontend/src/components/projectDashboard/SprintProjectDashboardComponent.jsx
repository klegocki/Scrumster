import { useState } from "react";
import DialogRemoveSprint from "../dialog/DialogRemoveSprint";
import { useNavigate } from "react-router-dom";

export default function SprintProjectDashboardComponent(props){

    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    const {altTitle, title, onGoingSprint, sprintId, projectId} = props
    const navigate = useNavigate();

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
    const navigateToSprint= () => {
        navigate(`/app/project/${projectId}/sprint/${sprintId}`);
    }
    
    return(<>
        <div className="task-box">
            <div style={titleStyle} onClick={navigateToSprint}>

                {title}<br/>
                {altTitle ? (altTitle) : (null)}
            </div>
            
            <DialogRemoveSprint setSprintsData={props.setSprintsData}
                                projectId={projectId}
                                sprintId={sprintId}
                                openParent={open}
                                fetchTasks={props.fetchTasks}
                                handleClose={handleClose}
                                onGoingSprint={onGoingSprint}>
            </DialogRemoveSprint>
        </div>

        </>)
}