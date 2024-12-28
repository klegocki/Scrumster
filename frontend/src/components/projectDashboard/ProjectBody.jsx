import { Button } from "@mui/material";
import BoxComponent from "../dashboard/BoxComponent";
import { getCsrfToken } from "../../functions/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import TaskBoxComponent from "./TaskBoxComponent";
import BoxSprintComponent from "./BoxSprintComponent";
import SpringDashboardComponent from "./SprintDashboardComponent";

export default function ProjectBody(props){

    const [tasksData, setTasksData] = useState([]);
    const [sprintsData, setSprintsData] = useState([]);

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
          .get("/api/projects/get/backlog", {
            params: payload,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCsrfToken(),
            },
            withCredentials: true 
          })
          .then((response) => {
            console.log(response.data)
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
            console.log(response.data)
            setSprintsData(prevSprintsData => prevSprintsData = response.data)
          })
          .catch((error) => {
        });
      };

      useEffect(() => {
        fetchProject()
        fetchSprints()
      },[])

    return(<>
    <div className="project-dashboard-body">
        <h2 className="project-body-title" style={titleStyle}>
            aaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aa
        </h2>
        <div className="project-boxes">
            <BoxComponent header="Backlog produktu" body={<div>{tasksData.map((task, index) => (
                <TaskBoxComponent 
                key={task.id || index}
                title={task.title}
                id={task.id}
                setProjectData={setTasksData}
                />
            ))}</div>}></BoxComponent>
            <BoxSprintComponent 
              ongoingSprints={<div>{sprintsData[0]?.ongoing?.map((task, index) => (
                  <SpringDashboardComponent 
                  key={task.id || index}
                  title={task.title}
                  id={task.id}
                  setProjectData={setSprintsData}
                  />
              ))}</div>}
              futureSprints={<div>{sprintsData[0]?.future?.map((task, index) => (
                <SpringDashboardComponent 
                key={task.id || index}
                title={task.title}
                id={task.id}
                setProjectData={setSprintsData}
                />
            ))}</div>}
              ></BoxSprintComponent>
            <BoxComponent header="Zakończone sprinty" body={<div>{sprintsData[0]?.ended?.map((task, index) => (
                <SpringDashboardComponent 
                key={task.id || index}
                title={task.title}
                id={task.id}
                setProjectData={setSprintsData}
                />
            ))}</div>}></BoxComponent>

        </div>
        <div style={buttonsStyle}>
            <Button variant="outlined">Informacje o projekcie</Button>
            <Button variant="outlined">Dodaj zadanie</Button>
            <Button variant="outlined">Zaplanuj sprint</Button>
        </div>
    </div>

    </>);

}