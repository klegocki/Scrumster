import { useEffect, useState } from "react";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import { Button, Skeleton } from "@mui/material";
import BoxComponent from "../dashboard/BoxComponent";
import TaskSprintDashboardComponent from "./TaskSprintDashboardComponent";
import ModalComponent from '../modal/ModalComponent';
import DialogSprintReview from "../dialog/DialogSprintReview";
import DialogEndSprint from "../dialog/DialogEndSprint";
import DialogAddTasksToSprint from "../dialog/DialogAddTasksToSprints";

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
    const [projectsBacklogTasksData, setProjectsBacklogTasksData] = useState([])

    const fetchProjectBacklogTasks = () => {

      const payload = {
          id: projectId,
      }

      axios
        .get("/api/projects/backlog/get", {
          params: payload,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true 
        })
        .then((response) => {
          setProjectsBacklogTasksData(ProjectsBacklogTasksData => ProjectsBacklogTasksData = response.data)
        })
        .catch((error) => {
      });
    };

    const fetchTasks = () => {

        const payload = {
            project_id: projectId,
            sprint_id: sprintId,
        }

        axios
          .get("/api/sprints/backlog/get", {
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
        .get("/api/sprints/sprint/info/get", {
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
        fetchProjectBacklogTasks();
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
                    <h2>
                      {sprintsData?.title}<br/>
                      {sprintsData?.alt_title ? (sprintsData.alt_title) : (null)}
                    </h2>)
        }        

        <div className="sprint-boxes">
            <BoxComponent header="Do zrobienia" body={
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
                isScrumMasterDeveloper={sprintsData?.isScrumMasterDeveloper}
                fetchTasks={fetchTasks}
                usersTasks={false}
                onGoingSprint={sprintsData?.on_going_sprint}
                />
                ))}
                {(tasksData[0]?.toDo?.length  > 0) ? (null) : (<h3>Brak zadań</h3>)}
                </div>)}>
            </BoxComponent>

            <BoxComponent header="W trakcie" body={
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
                isScrumMasterDeveloper={sprintsData?.isScrumMasterDeveloper}
                projectId={projectId}
                fetchTasks={fetchTasks}
                usersTasks={true}
                onGoingSprint={sprintsData?.on_going_sprint}
                />
                ))}
                <>{sprintsData?.isScrumMasterDeveloper ? (
                                  tasksData[0]?.toApprove?.map((task, index) => (

                                    <TaskSprintDashboardComponent 
                                    key={task.id}
                                    title={task.title}
                                    taskId={task.id}
                                    task={task}
                                    projectId={projectId}
                                    fetchTasks={fetchTasks}
                                    toApprove={true}
                                    />
                                  ))
                ) : (null)}

                </>

                {(tasksData[0]?.usersTasks?.length || (sprintsData?.loggedInUserRole === "Scrum master" && tasksData[0]?.toApprove?.length)> 0) ? (null) : (<h3>Brak zadań</h3>)}
                </div>)}>
            </BoxComponent>

            <BoxComponent header="Ukończone" body={
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

        <div className="all-dashboards-buttons">
            {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '15%', 
                                      height: '50px',  
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center', }}></Skeleton>) 
                    :(sprintsData?.daily_meet_link ? (

                      <a
                        href={
                          sprintsData?.daily_meet_link?.startsWith("http") 
                            ? sprintsData.daily_meet_link 
                            : `https://${sprintsData.daily_meet_link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      > 
                        <Button   sx={{
              fontSize: "1rem"
            }} variant="outlined">Daily scrum</Button>
                      </a>

                    ) : (
                      <>
                        <Button   sx={{
              fontSize: "1rem"
            }} variant="outlined" onClick={handleClickOpen}>Daily scrum</Button>
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
                    :(
                        <DialogAddTasksToSprint 
                                         sprintId={sprintsData?.id}
                                         projectId={projectId}
                                         tasksData={projectsBacklogTasksData}
                                         fetchSprint={fetchSprint}
                                         fetchTasks={fetchTasks}
                                         fetchProjectBacklogTasks={fetchProjectBacklogTasks}>

                        </DialogAddTasksToSprint>
                    )
            }

            {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '15%', 
                                      height: '50px',  
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center', }}></Skeleton>) 
                    :(<DialogSprintReview sprintReview={sprintsData?.sprint_review}
                                          role={sprintsData?.loggedInUserRole}
                                          sprintId={sprintsData?.id}
                                          fetchSprint={fetchSprint}
                    ></DialogSprintReview>)
            }

            {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '15%', 
                                      height: '50px',  
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center', }}></Skeleton>) 
                    :(
                        <DialogEndSprint 
                                         role={sprintsData?.loggedInUserRole}
                                         sprintId={sprintsData?.id}
                                         fetchSprint={fetchSprint}
                                         fetchTasks={fetchTasks}>

                        </DialogEndSprint>
                    )
            }
      </div>
    </div>
    </>)
}