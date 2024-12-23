import ProjectComponent from "./ProjectComponent"
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import { useState, useEffect } from "react";
import DialogJoinProject from "../dialog/DialogJoinProject"
import DialogCreateProject from "../dialog/DialogCreateProject";


export default function Projects(props){

const [projectInfo, setProjectInfo] = useState({

});

const buttonStyle = {
  width: '80%',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '15px',
}

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
  }, []); 

    return(<>
            <h2>Twoje projekty</h2>
            <div className="project-component-parent">
              {projectInfo.length ? (<div>{Object.entries(projectInfo).map(([key, value]) => (
                <ProjectComponent key={key}
                                  first_name={value.project_owner_first_name}
                                  last_name={value.project_owner_last_name}
                                  role={value.role}
                                  description={value.description}
                                  title = {value.title}
                                  project_owner_username = {value.project_owner_username}
                                  logged_user_username = {props.username}
                                  id = {value.id}
                                  setProjectInfo = {setProjectInfo}>
                </ProjectComponent>
            ))}</div>) : (<h3>Użytkownik nie posiada lub nie jest przypisany do żadnego projektu.</h3>)}
            
            </div>
            <div style={buttonStyle}>
              <DialogCreateProject fetchUserProjects={fetchUserProjects}></DialogCreateProject>
              <DialogJoinProject fetchUserProjects={fetchUserProjects}></DialogJoinProject>
            </div>
    </>)
}