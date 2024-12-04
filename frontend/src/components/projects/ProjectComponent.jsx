import { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProjectComponent(props){

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

    return(<>
        <div className="project-component-child">
            <div style={leftDiv}>
                <div style={parentBoxStyle}>
                    <div style={childBoxStyle}>
                        Właściciel projektu:<br/>
                        <strong>{props.first_name} {props.last_name}</strong>
                    </div>
                    <div style={childBoxStyle}>
                        Twoja rola:<br/>
                        <strong>{props.role}</strong>
                    </div>

                </div>
                <div className="project-description-box">
                    Opis:<br/>
                    {props.description}
                </div>
            </div>
            <div style={rightDiv}>

                <IconButton style={buttonEnterStyle}>
                    <SendIcon />
                </IconButton>

                <IconButton style={buttonRemoveStyle}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    </>);
}