import { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";

export default function ProjectComponent(props){


    let data = {
        description: props.description,
        role: props.role,
        first_name: props.first_name,
        last_name: props.last_name,
        title: props.title,
        
    };

    if(data.description == "" || data.description == null){
        data.description = "Brak opisu."
    }

    if(data.role == "" || data.role == null){
        data.role = "Brak roli"
    }

    const buttonRemoveStyle = {
        width: '50px',
        height: '50px',
        backgroundColor: 'red',
        borderRadius: '10px',
        margin: '20px',
        color: 'black',
        fontWeight: 'bold',
        fontSize: '2rem',
    }
    const buttonEnterStyle = {
        width: '50px',
        height: '50px',
        backgroundColor: 'green',
        borderRadius: '10px',
        margin: '20px',
        color: 'black',
        fontWeight: 'bold',
        fontSize: '2rem',
    }

    const parentBoxStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', 

    }

    const childBoxStyle = {
        backgroundColor: "hsl(128, 55%, 76%)",
        fontFamily: "Arial, Helvetica, sans-serif",
        border: "solid 3px hsl(128, 55%, 70%)",
        borderRadius: "10px",
        width: "50%",
        height: "35px",
        margin: "5px",
        padding: "10px",
    }

    const rightDiv = {
        width: '15%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const leftDiv = {
        width: '85%',
    }

    const payload = {
        id: props.id,

    }
    
    const handleRemoveButton = () => {
        if(props.logged_user_username == props.project_owner_username){
            axios
            .post("/api/projects/delete", payload,{
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCsrfToken(),
              },
              withCredentials: true 
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
        }
        else{
            console.log("Ten projekt nie jest twój")

        }
    }

    return(<>
        <div className="project-component-child">
            <div style={leftDiv}>

                <div style={parentBoxStyle}>
                    <div style={childBoxStyle}>
                        Tytuł projektu:<br/>
                        <strong>{data.title}</strong>
                    </div>
                    <div style={childBoxStyle}>
                        Właściciel projektu:<br/>
                        <strong>{data.first_name} {data.last_name}</strong>
                    </div>
                    <div style={childBoxStyle}>
                        Twoja rola:<br/>
                        <strong>{data.role}</strong>
                    </div>
                </div>

                <div className="project-description-box">
                    Opis:<br/>
                    {data.description}
                </div>

            </div>
            <div style={rightDiv}>

                <IconButton style={buttonEnterStyle}>
                    <SendIcon />
                </IconButton>

                <IconButton style={buttonRemoveStyle} onClick={handleRemoveButton}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    </>);
}