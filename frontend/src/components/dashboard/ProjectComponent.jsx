import { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { getCsrfToken } from "../../functions/utils";
import DialogRemoveLeaveProject from "../dialog/DialogRemoveLeaveProject";
import ModalComponent from "../modal/ModalComponent";

export default function ProjectComponent(props){

    const [openModal, setOpenModal] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [modalMainText, setModalMainText] = useState("");
    const handleOpenModal = (header, mainText) => {
        setModalHeader(prevModalHeader => prevModalHeader = header);
        setModalMainText(prevModalMainText => prevModalMainText = mainText);
        setOpenModal(true);

    };
    
    const handleCloseModal = () => setOpenModal(false);

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const header = useRef('');
    const body = useRef('');
    const [handleEvent, setHandleEvent] = useState(null)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let data = {
        description: props.description,
        role: props.role,
        first_name: props.first_name,
        last_name: props.last_name,
        title: props.title,
        id: props.id
        
    };

    const id = data.id;

    if(data.description == null || data.description.trim() == ""){
        data.description = "Brak opisu."
    }

    if(data.role == null || data.role.trim() == ""){
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
        width: "calc(100% - 10px)",
        height: "65px",
        margin: "5px",
        maxWidth: '700px',
        padding: "10px",
        boxSizing: "border-box",

    };
    

    const rightDiv = {
        width: '20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const leftDiv = {
        width: '80%',
        overflow: 'hidden',
        wordWrap: 'break-word',
        boxSizing: 'border-box',
    };
    

    const deleteProjectRequest = () => {

        const payload = {
            id: id,
        }

        axios
        .post("/api/projects/delete", payload,{
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true 
        })
        .then((response) => {
            props.setProjectInfo(prevProjectInfo => prevProjectInfo.filter((currentProject)=>currentProject.id !== id))
            handleClose();
            handleOpenModal("Usunięcie projektu.", response.data.message);
        })
        .catch((error) => {
            handleClose();
            handleOpenModal("Usunięcie projektu.", error.response.data.message);

        });
    }

    const leaveProjectRequest = () => {

        const payload = {
            id: id,
        }

        axios
        .post("/api/projects/leave", payload,{
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken(),
          },
          withCredentials: true 
        })
        .then((response) => {
            props.setProjectInfo(prevProjectInfo => prevProjectInfo.filter((currentProject)=>currentProject.id !== id))
            handleClose();
            handleOpenModal("Opuszczenie projektu.", response.data.message);

        })
        .catch((error) => {
            handleClose();
            handleOpenModal("Opuszczenie projektu.", error.response.data.message);

        });
    }

    
    const handleRemoveButton = () => {


        if(props.logged_user_username == props.project_owner_username){

            header.current = "Usunięcie projektu."
            body.current = "Czy chcesz usunąć projekt? Proces jest nieodwracalny."
            setHandleEvent(() => deleteProjectRequest);
        }
        else{

            header.current = "Opuszczenie projektu."
            body.current = "Czy chcesz opuścić projekt?"
            setHandleEvent(() => leaveProjectRequest);
        }
        handleOpen()

    }

    const navigateToProject = () => {
        navigate(`/app/project/${id}`);
    }
    
    
    return(<>
        <div className="project-component-child">
            <div style={leftDiv}>

                    <div style={childBoxStyle} className="project-top-boxes">
                    <strong>Tytuł projektu:</strong><br/>
                        {data.title}
                    </div>

                    <div style={childBoxStyle} className="project-top-boxes">
                    <strong>Właściciel projektu:</strong><br/>
                        {data.first_name} {data.last_name}
                    </div>

                    <div style={childBoxStyle} className="project-top-boxes">
                    <strong>Twoja rola:</strong><br/>
                        {data.role}
                    </div>
                

                <div className="project-description-box">
                <strong>Opis:</strong><br/>
                    {data.description}
                </div>

            </div>
            <div style={rightDiv}>

                <IconButton     sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '10px',
                                    margin: '20px',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '2rem',
                                    backgroundColor: 'hsl(125, 100%, 42%)',
                                    '&:hover': {
                                        backgroundColor: 'hsl(125, 100%, 37%)',
                                    }
                                }} 
                                className="project-component-enter-button"
                                onClick={navigateToProject}>
                    <SendIcon />
                </IconButton>

                <IconButton    sx={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: 'hsl(0, 100%, 43%)',
                                    borderRadius: '10px',
                                    margin: '20px',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '2rem',
                                    '&:hover': {
                                        backgroundColor: 'hsl(0, 100%, 37%)',
                                    }
                                }}  
                                className="project-component-remove-button"
                                onClick={handleRemoveButton}>
                    <DeleteIcon />
                </IconButton>
            </div>

        </div>
        <DialogRemoveLeaveProject   header={header.current}
                                    body={body.current}
                                    handleEvent={handleEvent}
                                    openParent={open}
                                    handleClose={handleClose}>
        </DialogRemoveLeaveProject>
        <ModalComponent   open={openModal} 
                        handleClose={handleCloseModal} 
                        header={modalHeader} 
                        mainText={modalMainText}>
      </ModalComponent>
    </>);
}