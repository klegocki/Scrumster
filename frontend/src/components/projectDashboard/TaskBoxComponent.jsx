import { useState } from "react";
import DialogRemoveTask from "../dialog/DialogRemoveTask";
import DialogTaskInfo from "../dialog/DialogTaskInfo";

export default function TaskBoxComponent(props){

    const {taskId, title, projectId, task} = props

    const [openInfo, setOpenInfo] = useState(false)
    
    const handleOpenInfo = () => setOpenInfo(true);

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
            <div style={titleStyle} onClick={handleOpenInfo}>
                {title}
            </div>
            <DialogRemoveTask
                                setTasksData={props.setTasksData}
                                projectId={projectId}
                                taskId={taskId}
            ></DialogRemoveTask>
            <DialogTaskInfo task={task}
                            open={openInfo}
                            setOpen={setOpenInfo}
            ></DialogTaskInfo>
        </div>
        </>)
}