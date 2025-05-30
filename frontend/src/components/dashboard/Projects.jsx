import ProjectComponent from "./ProjectComponent"
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import { useState, useEffect } from "react";
import DialogJoinProject from "../dialog/DialogJoinProject"
import DialogCreateProject from "../dialog/DialogCreateProject";
import { Skeleton } from "@mui/material";


export default function Projects(props){

  const [isLoading, setIsLoading] = useState(true);
  const [projectInfo, setProjectInfo] = useState({});



  const fetchUserProjects = () => {
      axios
        .get("/api/projects/get", {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true 
        })
        .then((response) => {
          setProjectInfo(prevProjectInfo => prevProjectInfo=response.data);
        })
        .catch((error) => {
      });
    };

  useEffect(() => {
    fetchUserProjects(); 
    setTimeout(()=>{
      setIsLoading(false);
    },2000)
  }, []); 

    return(<>
        <div className="dashboard-bottom">
          <div className="dashboard-projects2">
            <h2>Twoje projekty</h2>
            <div className="project-component-parent">
              
              {isLoading ? (<Skeleton variant="rectangle" 
                                      animation='wave'
                                      sx={{ width: '100%', height: '100%' }}></Skeleton>) 
                                      :
                                       (projectInfo.length ? (<div>{Object.entries(projectInfo).map(([key, value]) => (
                  <ProjectComponent key={key}
                                    first_name={value.project_owner_first_name}
                                    last_name={value.project_owner_last_name}
                                    role={value.role}
                                    altRole={value.altRole}
                                    description={value.description}
                                    title = {value.title}
                                    project_owner_username = {value.project_owner_username}
                                    logged_user_username = {props.username}
                                    id = {value.id}
                                    setProjectInfo = {setProjectInfo}>
                  </ProjectComponent>
            ))}</div>) : (<h3>Użytkownik nie posiada lub nie jest przypisany do żadnego projektu.</h3>))
              
              }
            
            </div>
            <div className="all-dashboards-buttons">
              {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '15%', 
                                      height: '50px',  
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center', }}></Skeleton>) 
                    :(<DialogCreateProject fetchUserProjects={fetchUserProjects}></DialogCreateProject>)
              }
              {isLoading ? (<Skeleton variant="rounded" 
                                animation='wave'
                                sx={{ width: '15%', 
                                      height: '50px',  
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center', }}></Skeleton>) 
                    :(<DialogJoinProject fetchUserProjects={fetchUserProjects}></DialogJoinProject>)
              }
            
            </div>
          </div>
        </div>
    </>)
}