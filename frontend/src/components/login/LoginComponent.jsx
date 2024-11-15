import { useRef, useState } from "react";
import './LoginComponent.css'
import axios from "axios";
import { Button, Modal, Box, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../modal/ModalComponent";

function LoginComponent(){

    const [open, setOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [modalMainText, setModalMainText] = useState("");
    const password = useRef('');
    const username = useRef('');
    const navigate = useNavigate();

    const handleOpen = (header, mainText) => {
        setOpen(true);
        setModalHeader(prevModalHeader => prevModalHeader = header);
        setModalMainText(prevModalMainText => prevModalMainText = mainText);
    };
    
    const handleClose = () => setOpen(false);


    const setPassword = (e) => {
        password.current = e.target.value;
    }

    const setEmail = (e) => {
        username.current = e.target.value;
        

    }

    const buttonLoginStyle = {
        marginTop: '10px',
        marginRight: '30px'

    }
    const buttonRegisterStyle = {
        marginTop: '10px',
        marginLeft: '30px',
        

    }


    const goToRegister = () => {
        navigate('/register');
    }

    const handleLogin = () =>{
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
          .post("/api/loginUser", JSON.stringify(payload), {
            headers: {
              "Content-Type": "application/json",
              
            },
            withCredentials: true 
          })
          .then((response) => {
            navigate('app/dashboard');
          })
          .catch((error) => {
            console.log(error)
            handleOpen("Logowanie nie powiodło się", error.response.data.message);
          }); 
        }

        }
    

    return(<>
        <div className="login-window">

            <h2>Zaloguj się</h2>

            <input type="email" 
                   placeholder="Podaj nazwę użytkownika"   
                   className="input-login" onChange={setEmail}>
            </input>

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