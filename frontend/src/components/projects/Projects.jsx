import { Button } from "@mui/material"
import ProjectComponent from "./ProjectComponent"
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";
import { useState, useEffect } from "react";


export default function Projects(props){

const [projectInfo, setProjectInfo] = useState({
  first_name: '',
  last_name: '',
  role: '',
  description: '',
  id: ""
});

const buttonStyle = {
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
        console.log(response.data)

      })
      .catch((error) => {
        console.log(error)
    });
  };

  useEffect(() => {
    fetchUserProjects(); 
  }, []); 

    return(<>
        <div className="dashboard-projects">
            <h2>Twoje projekty</h2>
            <div className="project-component-parent">
              
            {Object.entries(projectInfo).map(([key, value]) => (
                <ProjectComponent key={key}
                                  first_name={value.project_owner_first_name}
                                  last_name={value.project_owner_last_name}
                                  role={value.role}
                                  description={value.description}
                                  title = {value.title}
                                  project_owner_username = {value.project_owner_username}
                                  logged_user_username = {props.username}
                                  id = {value.id}>
                </ProjectComponent>
            ))}
            </div>
            <Button 
                    variant="outlined" 
                    style={buttonStyle}>
                Stwórz projekt
            </Button>
        </div>
    </>)
}