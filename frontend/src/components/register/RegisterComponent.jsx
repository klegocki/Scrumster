import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../modal/ModalComponent";
import { getCsrfToken } from "../../functions/utils.jsx"

export default function RegisterComponent(){

    const password1 = useRef('');
    const password2 = useRef('');
    const username = useRef('');
    const email = useRef('');
    const firstName = useRef('');
    const lastName = useRef('');
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [modalMainText, setModalMainText] = useState("");

    const handleOpen = (header, mainText) => {
        setOpen(true);
        setModalHeader(prevModalHeader => prevModalHeader = header);
        setModalMainText(prevModalMainText => prevModalMainText = mainText);
    };

    const setPassword1 = (e) => {
        password1.current = e.target.value;
    }


    const setPassword2 = (e) => {
        password2.current = e.target.value;
    }


    const setUsername = (e) => {
        username.current = e.target.value;
        

    }
    const setEmail = (e) => {
        email.current = e.target.value;
        

    }
    const setFirstName = (e) => {
        firstName.current = e.target.value;
        

    }
    const setLastName = (e) => {
        lastName.current = e.target.value;
        

    }
    
    const handleClose = () => setOpen(false);


    const buttonLoginStyle = {
        marginTop: '10px',
        marginLeft: '40px',
        width: '120px'


    }
    const buttonRegisterStyle = {
        

        marginTop: '10px',
        marginRight: '40px',
        width: '120px'

    }

    const goToLogin = () => {
        navigate('/login');
    }

    const handleRegister = () =>{

        const payload = { 
            username: username.current, 
            password1: password1.current,
            password2: password2.current,
            email: email.current,
            first_name: firstName.current,
            last_name: lastName.current,
        };
        

        if(username.current.trim() === "" ||
           password1.current.trim() === "" ||
           password2.current.trim() === "" ||
           email.current.trim() === "" ||
           firstName.current.trim() === "" ||
           lastName.current.trim() === ""
          )
        {
            handleOpen("Rejestracja nie powiodła się", 
                       "Proszę uzupełnić wszystkie pola");
        }
        else
        {
        axios
          .post("/api/registerUser", JSON.stringify(payload), {
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

            handleOpen("Rejestracja nie powiodła się", error.response.data.message ? error.response.data.message : "Nie udało połączyć się z serwerem");
          }); 
        }
    }


    return(<>
     <div className="register-window">
        <img src="/static/frontend/ScrumSter.svg" alt="ScrumSter" />


            <h2>Zarejestruj się</h2>
            
            <label>Nazwa użytkownika</label>
            <input type="text" 
                   placeholder="Podaj nazwę użytkownika"   
                   className="input-register" 
                   onChange={setUsername}>
            </input>

            <label>Hasło</label>
            <input type="password" 
                   placeholder="Podaj hasło" 
                   className="input-register" 
                   onChange={setPassword1}>
            </input>

            <label>Powtórz hasło</label>
            <input type="password" 
                   placeholder="Podaj hasło ponownie" 
                   className="input-register" 
                   onChange={setPassword2}>
            </input>

            <label>Adres email</label>
            <input type="email" 
                   placeholder="Podaj adres email" 
                   className="input-register" 
                   onChange={setEmail}>
            </input>

            <label>Imię</label>
            <input type="text" 
                   placeholder="Podaj imię" 
                   className="input-register" 
                   onChange={setFirstName}>
            </input>

            <label>Nazwisko</label>
            <input type="text" 
                   placeholder="Podaj nazwisko" 
                   className="input-register" 
                   onChange={setLastName}>
            </input>
            

            <div className="buttons-div">

                <Button  
                    variant="outlined" 
                    style={buttonRegisterStyle} 
                    onClick={() => handleRegister()}>
                    Zarejestruj
                </Button>

                    <ModalComponent open={open} 
                                    handleClose={handleClose} 
                                    header={modalHeader} 
                                    mainText={modalMainText}>
                    </ModalComponent>

                <Button variant="outlined" 
                        style={buttonLoginStyle} 
                        onClick={goToLogin}> 
                        Logowanie
                </Button>

            </div>

        </div>
    </>);
}