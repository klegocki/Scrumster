import { useState } from "react";
import DialogTaskInfo from "../dialog/DialogTaskInfo";
import DialogRemoveSprintTask from "../dialog/DialogRemoveSprintTask";
import DialogDeveloperTask from "../dialog/DialogDeveloperTask";
import DialogRevertTaskToBacklog from "../dialog/DialogRevertTaskToBacklog";
import DialogCompleteTask from "../dialog/DialogCompleteTask";
import DialogApproveTask from "../dialog/DialogApproveTask";

export default function TaskSprintDashboardComponent(props){

    const {taskId, title, projectId, task, role, usersTasks, onGoingSprint, isScrumMasterDeveloper, toApprove} = props
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
            {toApprove ? (
                <DialogApproveTask
                                    fetchTasks={props.fetchTasks}
                                    projectId={projectId}
                                    taskId={taskId}
                ></DialogApproveTask>
            ) : (null)}
            {task?.status === 'Do zrobienia' && role === "Administrator projektu" ? (
                        <DialogRemoveSprintTask 
                        fetchTasks={props.fetchTasks}
                        projectId={projectId}
                        taskId={taskId}
                        />
                    ) : null}
            {task?.status === 'Do zrobienia' && role === 'Scrum master' ? (
                <>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <DialogDeveloperTask fetchTasks={props.fetchTasks}
                                             projectId={projectId}
                                             taskId={taskId}
                        ></DialogDeveloperTask>

                        {isScrumMasterDeveloper ? (

                            <DialogRemoveSprintTask 
                            fetchTasks={props.fetchTasks}
                            projectId={projectId}
                            taskId={taskId}
                            />
                        ) : (null)}
                    </div>

                        </>
                    ) : null}
            {onGoingSprint ? (
                <>

                    {task?.status === 'Do zrobienia' && role !== 'Scrum master' && role !== 'Product owner' && role !== 'Administrator projektu' && !usersTasks ? (
                        <DialogDeveloperTask fetchTasks={props.fetchTasks}
                                             projectId={projectId}
                                             taskId={taskId}
                        ></DialogDeveloperTask>
                    ) : null}

                    {usersTasks && task?.status !== "Do zatwierdzenia" ? (<div style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <DialogCompleteTask
                            fetchTasks={props.fetchTasks}
                            taskId={taskId}
                        />

                        <DialogRevertTaskToBacklog 
                            fetchTasks={props.fetchTasks}
                            taskId={taskId}
                        />
                    </div>) : null}
                </>
            ) : null}

            <DialogTaskInfo task={task}
                            open={openInfo}
                            setOpen={setOpenInfo}
            ></DialogTaskInfo>

        </div>
        </>)
}