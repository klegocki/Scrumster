import { Button } from "@mui/material";
import BoxComponent from "../dashboard/BoxComponent";
import { getCsrfToken } from "../../functions/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import TaskBoxComponent from "./TaskBoxComponent";

export default function ProjectBody(props){

    const [projectData, setProjectData] = useState({});

    const titleStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
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
            console.log(response.data)
            setProjectData(prevProjectData => prevProjectData = response.data)
          })
          .catch((error) => {
        });
      };

      useEffect(() => {
        fetchProject()
      },[])

    return(<>
    <div className="project-dashboard-body">
        <h2 className="project-body-title" style={titleStyle}>
            aaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aa
        </h2>
        <div className="project-boxes">
            <BoxComponent header="Backlog produktu" body={<div>{projectData.tasks?.map((task, index) => (
                <TaskBoxComponent 
                key={task.id || index}
                title={task.title}
                id={task.id}
                setProjectData={setProjectData}
                />
            ))}</div>}></BoxComponent>
            <BoxComponent header="Obecne sprinty"></BoxComponent>
            <BoxComponent header="Zakończone sprinty"></BoxComponent>
        </div>
        <div style={buttonsStyle}>
            <Button variant="outlined">Informacje o projekcie</Button>
            <Button variant="outlined">Dodaj zadanie</Button>
            <Button variant="outlined">Zaplanuj sprint</Button>
        </div>
    </div>

    </>);

}