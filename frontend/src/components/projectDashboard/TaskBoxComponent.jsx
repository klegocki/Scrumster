import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import DialogRemoveTask from "../dialog/DialogRemoveTask";

export default function TaskBoxComponent(props){

    const {taskId, title, projectId} = props

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


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
    


    return(<>
        <div className="task-box">
            <div style={titleStyle}>
                {title}
            </div>
            <DialogRemoveTask
                                setTasksData={props.setTasksData}
                                projectId={projectId}
                                taskId={taskId}
                                openParent={open}
                                handleClose={handleClose}
            ></DialogRemoveTask>
        </div>
        </>)
}