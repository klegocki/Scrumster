import { useEffect, useState } from "react";
import TaskBoxComponent from "../projectDashboard/TaskBoxComponent";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import { Button, Skeleton } from "@mui/material";
import BoxComponent from "../dashboard/BoxComponent";

export default function SprintBody(props){

    const {projectId, sprintId} = props
    const [isLoading, setIsLoading] = useState(true);
    const [tasksData, setTasksData] = useState([])

    const titleStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "90%",
        height: "50px",

    }

    const buttonsStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: "80%"
    }

    const fetchTasks = () => {

        const payload = {
            project_id: projectId,
            sprint_id: sprintId,
        }

        axios
          .get("/api/projects/get/sprint/backlog", {
            params: payload,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCsrfToken(),
            },
            withCredentials: true 
          })
          .then((response) => {
            setTasksData(prevTasksData => prevTasksData = response.data)
          })
          .catch((error) => {
        });
    };
    useEffect(() => {
        fetchTasks()
        setTimeout(()=>{
            setIsLoading(false);
        },2000)
    },[])
    return(<>
    <div className="sprint-dashboard-body">
        {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '50%', 
                                      height: '90px',  
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center', }}></Skeleton>) 
                    :(            
                    <h2 className="sprint-body-title" style={titleStyle}>
                      {tasksData[0]?.sprintTitle}
                    </h2>)
        }        

        <div className="sprint-boxes">
            <BoxComponent header="To Do" body={
              isLoading ? (<Skeleton variant="rounded" 
                                     animation='wave'
                                     sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                :(<div>{tasksData[0]?.toDo?.map((task, index) => (

                <TaskBoxComponent 
                key={task.id}
                title={task.title}
                taskId={task.id}
                task={task}
                projectId={projectId}
                setTasksData={setTasksData}
                />
                ))}
                {(tasksData[0]?.toDo?.length  > 0) ? (null) : (<h3>Brak zadań</h3>)}
                </div>)}>
            </BoxComponent>

            <BoxComponent header="In Progress" body={
              isLoading ? (<Skeleton variant="rounded" 
                                     animation='wave'
                                     sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                :(<div>{tasksData[0]?.inProgress?.map((task, index) => (

                <TaskBoxComponent 
                key={task.id}
                title={task.title}
                taskId={task.id}
                task={task}
                projectId={projectId}
                setTasksData={setTasksData}
                />
                ))}
                {(tasksData[0]?.inProgress?.length  > 0) ? (null) : (<h3>Brak zadań</h3>)}
                </div>)}>
            </BoxComponent>

            <BoxComponent header="Twoje zadania" body={
              isLoading ? (<Skeleton variant="rounded" 
                                     animation='wave'
                                     sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                :(<div>{tasksData[0]?.usersTasks?.map((task, index) => (
                    
                <TaskBoxComponent 
                key={task.id}
                title={task.title}
                taskId={task.id}
                task={task}
                projectId={projectId}
                setTasksData={setTasksData}
                />
                ))}
                {(tasksData[0]?.usersTasks?.length > 0) ? (null) : (<h3>Brak zadań</h3>)}
                </div>)}>
            </BoxComponent>

            <BoxComponent header="Done" body={
              isLoading ? (<Skeleton variant="rounded" 
                                     animation='wave'
                                     sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                :(<div>{tasksData[0]?.done?.map((task, index) => (

                <TaskBoxComponent 
                key={task.id}
                title={task.title}
                taskId={task.id}
                task={task}
                projectId={projectId}
                setTasksData={setTasksData}
                />
                ))}
                {(tasksData[0]?.done?.length  > 0) ? (null) : (<h3>Brak zadań</h3>)}
                </div>)}>
            </BoxComponent>

        </div>

        <div style={buttonsStyle}>
            {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '15%', 
                                    height: '50px',  
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center', }}></Skeleton>) 
                    :(<Button variant="outlined">Daily scrum</Button>)
            }

            {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '15%', 
                                    height: '50px',  
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center', }}></Skeleton>) 
                    :(<Button variant="outlined">Raport sprintu</Button>)
            }

            {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '15%', 
                                    height: '50px',  
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center', }}></Skeleton>) 
                    :(<Button variant="outlined">Zakończ sprint</Button>)
            }
</div>
    </div>
    </>)
}