import { useEffect, useState } from "react";
import TaskBoxComponent from "../projectDashboard/TaskBoxComponent";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import { Button, Skeleton } from "@mui/material";
import BoxComponent from "../dashboard/BoxComponent";
import TaskSprintDashboardComponent from "./TaskSprintDashboardComponent";
import ModalComponent from '../modal/ModalComponent';


export default function SprintBody(props){

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
  };
    const {projectId, sprintId} = props
    const [isLoading, setIsLoading] = useState(true);
    const [tasksData, setTasksData] = useState([])
    const [sprintsData, setSprintsData] = useState({})


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

    const fetchSprint = () => {

      const payload = {
          project_id: projectId,
          sprint_id: sprintId,
      }

      axios
        .get("/api/projects/sprint/get", {
          params: payload,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true 
        })
        .then((response) => {
          setSprintsData(prevTasksData => prevTasksData = response.data)
        })
        .catch((error) => {
      });
  };

    useEffect(() => {
        fetchTasks();
        fetchSprint();
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
                      {sprintsData?.title}
                    </h2>)
        }        

        <div className="sprint-boxes">
            <BoxComponent header="To Do" body={
              isLoading ? (<Skeleton variant="rounded" 
                                     animation='wave'
                                     sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                :(<div>{tasksData[0]?.toDo?.map((task, index) => (

                <TaskSprintDashboardComponent 
                key={task.id}
                title={task.title}
                taskId={task.id}
                task={task}
                role={sprintsData?.loggedInUserRole}
                projectId={projectId}
                fetchTasks={fetchTasks}
                usersTasks={false}
                onGoingSprint={sprintsData?.on_going_sprint}
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

                <TaskSprintDashboardComponent 
                key={task.id}
                title={task.title}
                taskId={task.id}
                task={task}
                projectId={projectId}
                fetchTasks={fetchTasks}
                usersTasks={false}
                onGoingSprint={sprintsData?.on_going_sprint}
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
                    
                <TaskSprintDashboardComponent 
                key={task.id}
                title={task.title}
                taskId={task.id}
                task={task}
                projectId={projectId}
                fetchTasks={fetchTasks}
                usersTasks={true}
                onGoingSprint={sprintsData?.on_going_sprint}
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

                <TaskSprintDashboardComponent 
                key={task.id}
                title={task.title}
                taskId={task.id}
                task={task}
                projectId={projectId}
                fetchTasks={fetchTasks}
                usersTasks={false}
                onGoingSprint={sprintsData?.on_going_sprint}
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
                    :(sprintsData?.daily_meet_link ? (
                      <a href={sprintsData?.daily_meet_link} target="_blank"> 
                        <Button variant="outlined">Daily scrum</Button>
                      </a>
                    ) : (
                      <>
                        <Button variant="outlined" onClick={handleClickOpen}>Daily scrum</Button>
                        <ModalComponent   open={open} 
                                          handleClose={handleClose} 
                                          header={"Spotkanie daily scrum"} 
                                          mainText={"Nie podano linku do spotkania."}>
                        </ModalComponent>
                      </>
                    ))
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