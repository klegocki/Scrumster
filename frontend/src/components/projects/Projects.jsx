import { Button } from "@mui/material"
import ProjectComponent from "./ProjectComponent"

export default function Projects(){

const mockInfo = {
    0:{
        first_name: "Kamil",
        last_name: "Kornacki",
        role: "Scrum Master",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    1:{
        first_name: "Jurek",
        last_name: "Witecki",
        role: "Product Owner",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    }

const buttonStyle = {
    marginBottom: '15px',
}

    return(<>
        <div className="dashboard-projects">
            <h2>Twoje projekty</h2>
            <div className="project-component-parent">
            {Object.entries(mockInfo).map(([key, value]) => (
                <ProjectComponent key={key}
                                  first_name={value.first_name}
                                  last_name={value.last_name}
                                  role={value.role}
                                  description={value.description}>
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