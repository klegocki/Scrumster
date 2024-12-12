import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../modal/ModalComponent";
import { getCsrfToken } from "../../functions/utils.jsx"


function LoginComponent(){

    const password = useRef('');
    const username = useRef('');
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [modalMainText, setModalMainText] = useState("");
    const handleOpen = (header, mainText) => {
        setOpen(true);
        setModalHeader(prevModalHeader => prevModalHeader = header);
        setModalMainText(prevModalMainText => prevModalMainText = mainText);
    };
    
    const handleClose = () => setOpen(false);


    const setPassword = (e) => {
        password.current = e.target.value;
    }

    const setUsername = (e) => {
        username.current = e.target.value;
        

    }

    const buttonLoginStyle = {
        marginTop: '10px',
        marginRight: '40px',
        width: '120px'

    }
    const buttonRegisterStyle = {
        marginTop: '10px',
        marginLeft: '40px',
        width: '120px'

    }


    const goToRegister = () => {
        navigate('/register');
    }

    const handleLogin = () =>{

        const payload = { 
            username: username.current, 
            password: password.current 
        };
        

        if(username.current.trim() === "" || password.current.trim() === "")
        {
            handleOpen("Logowanie nie powiodło się", "Proszę wpisać nazwę użytkownika lub hasło");
        }
        else
        {
        const payload = { 
            username: username.current, 
            password: password.current 
        };

        axios
          .post("/api/users/login", payload, {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCsrfToken(),
              
            },
            withCredentials: true 
          })
          .then((response) => {
            navigate('/app/projects');
          })
          .catch((error) => {
            handleOpen("Logowanie nie powiodło się", error.response.data.message ? error.response.data.message : "Nie udało połączyć się z serwerem");
          }); 
        }
    }
    

    return(<>

        <div className="login-window">
        <img src="/static/frontend/ScrumSter.svg" alt="ScrumSter" />


            <h2>Zaloguj się</h2>
            <label>Nazwa użytkownika</label>
            <input type="text" 
                   placeholder="Podaj nazwę użytkownika"   
                   className="input-login" 
                   onChange={setUsername}>
            </input>

            <label>Hasło</label>
            <input type="password" 
                   placeholder="Podaj hasło" 
                   className="input-login" 
                   onChange={setPassword}>
            </input>

            <div className="buttons-div">

                <Button  
                    variant="outlined" 
                    style={buttonLoginStyle} 
                    onClick={() => handleLogin()}>
                    Zaloguj
                </Button>

                    <ModalComponent open={open} 
                                    handleClose={handleClose} 
                                    header={modalHeader} 
                                    mainText={modalMainText}>
                    </ModalComponent>

                <Button variant="outlined" 
                        style={buttonRegisterStyle} 
                        onClick={goToRegister}> 
                        Rejestracja
                </Button>

            </div>

        </div>
    </>);
}

export default LoginComponent;