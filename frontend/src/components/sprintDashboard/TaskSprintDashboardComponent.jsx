import { useState } from "react";
import DialogTaskInfo from "../dialog/DialogTaskInfo";
import DialogRemoveSprintTask from "../dialog/DialogRemoveSprintTask";

export default function TaskSprintDashboardComponent(props){

    const {taskId, title, projectId, task, role, usersTasks, onGoingSprint} = props

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
            {onGoingSprint ? (
                <>
                    {task?.status === 'To Do' && role === 'Scrum master' ? (
                        <DialogRemoveSprintTask 
                            fetchTasks={props.fetchTasks}
                            projectId={projectId}
                            taskId={taskId}
                        />
                    ) : null}

                    {task?.status === 'To Do' && role !== 'Scrum master' && role !== 'Product owner' ? (
                        <p>g</p>
                    ) : null}

                    {usersTasks ? (
                        <DialogRemoveSprintTask 
                            fetchTasks={props.fetchTasks}
                            projectId={projectId}
                            taskId={taskId}
                        />
                    ) : null}
                </>
            ) : null}




            <DialogTaskInfo task={task}
                            open={openInfo}
                            setOpen={setOpenInfo}
            ></DialogTaskInfo>
        </div>
        </>)
}