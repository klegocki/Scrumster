import { Button } from "@mui/material";
import BoxComponent from "../dashboard/BoxComponent";
import { getCsrfToken } from "../../functions/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import TaskBoxComponent from "./TaskBoxComponent";
import BoxSprintComponent from "./BoxSprintComponent";
import SprintDashboardComponent from "./SprintDashboardComponent";
import { Skeleton } from "@mui/material";
import DialogProjectInfo from "../dialog/DialogProjectInfo";
import DialogCreateTask from "../dialog/DialogCreateTask";
import DialogCreateSprint from "../dialog/DialogCreateSprint";

export default function ProjectBody(props){

  const [isLoading, setIsLoading] = useState(true);

    const [projectData, setProjectData] = useState([]);
    const [tasksData, setTasksData] = useState([]);
    const [sprintsData, setSprintsData] = useState([]);

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

    const fetchProject = () => {

      const payload = {
          id: props.id,
      }

      axios
        .get("/api/projects/get/project", {
          params: payload,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true 
        })
        .then((response) => {
          setProjectData(prevProjectData => prevProjectData = response.data)
        })
        .catch((error) => {
      });
    };

    const fetchTasks = () => {

        const payload = {
            id: props.id,
        }

        axios
          .get("/api/projects/get/backlog", {
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

      const fetchSprints = () => {

        const payload = {
            id: props.id,
        }

        axios
          .get("/api/projects/get/sprints", {
            params: payload,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCsrfToken(),
            },
            withCredentials: true 
          })
          .then((response) => {
            setSprintsData(prevSprintsData => prevSprintsData = response.data)
          })
          .catch((error) => {
        });
      };

      useEffect(() => {
        fetchProject()
        fetchTasks()
        fetchSprints()
        setTimeout(()=>{
          setIsLoading(false);
        },2000)
      },[])


    return(<>
    
    
    <div className="project-dashboard-body">
    {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '50%', 
                                      height: '90px',  
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center', }}></Skeleton>) 
                    :(            
                    <h2 className="project-body-title" style={titleStyle}>
                      {projectData.title}
                    </h2>)}
            <div className="project-boxes">
            <BoxComponent header="Backlog produktu" body={isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                    :(<div>{tasksData.map((task, index) => (

                      <TaskBoxComponent 
                      key={task.id}
                      title={task.title}
                      taskId={task.id}
                      task={task}
                      projectId={props.id}
                      setTasksData={setTasksData}
                      />
              ))}
              {(tasksData.length > 0) ? (null) : (<h3>Brak tasków</h3>)}
              </div>)}></BoxComponent>
            <BoxSprintComponent 
              ongoingSprints={isLoading ? (<Skeleton variant="rounded" 
                animation='wave'
                sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                  :(<div>{sprintsData[0]?.ongoing?.map((sprint, index) => (
                      <SprintDashboardComponent 
                      key={sprint.id}
                      title={sprint.title}
                      sprintId={sprint.id}
                      projectId={props.id}
                      fetchTasks={fetchTasks}
                      onGoingSprint={true}
                      setSprintsData={setSprintsData}
                      />
              ))}
                {(sprintsData[0]?.ongoing?.length > 0) ? (null) : (<h3>Brak obecnych sprintów</h3>)}
              </div>)}
              futureSprints={isLoading ? (<Skeleton variant="rounded" 
                animation='wave'
                sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                :(<div>{sprintsData[0]?.future?.map((sprint, index) => (
                      <SprintDashboardComponent 
                      key={sprint.id}
                      title={sprint.title}
                      sprintId={sprint.id}
                      projectId={props.id}
                      fetchTasks={fetchTasks}
                      onGoingSprint={false}
                      setSprintsData={setSprintsData}
                      />
                    ))}
                    {(sprintsData[0]?.future?.length > 0) ? (null) : (<h3>Brak przyszłych sprintów</h3>)}
                    </div>)}
              ></BoxSprintComponent>
            <BoxComponent header="Zakończone sprinty" body={isLoading ? (<Skeleton variant="rounded" 
                animation='wave'
                sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                :(<div>{sprintsData[0]?.ended?.map((sprint, index) => (
                  <SprintDashboardComponent 
                  key={sprint.id}
                  title={sprint.title}
                  sprintId={sprint.id}
                  projectId={props.id}
                  onGoingSprint={false}
                  fetchTasks={fetchTasks}
                  setSprintsData={setSprintsData}
                  />
              ))}
              {(sprintsData[0]?.ended?.length > 0) ? (null) : (<h3>Brak zakończonych sprintów</h3>)}
              </div>)}></BoxComponent>
        </div>
        <div style={buttonsStyle}>
            <DialogProjectInfo projectData={projectData}></DialogProjectInfo>
            <DialogCreateTask id={props.id}
                              fetchTasks={fetchTasks}>
            </DialogCreateTask>
            <DialogCreateSprint id={props.id}
                                fetchSprints={fetchSprints}
                                tasksData={tasksData}
                                fetchTasks={fetchTasks}>
            </DialogCreateSprint>
        </div>
    </div>
    </>);
}