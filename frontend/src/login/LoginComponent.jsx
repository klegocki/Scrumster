import { useRef, useState } from "react";
import './LoginComponent.css'
import { Button, Modal, Box, Typography} from "@mui/material";

function LoginComponent(){

    const loginTest= 'test@test.com';
    const passwordTest = 'test';
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const password = useRef('');
    const email = useRef('');

    const setPassword = (e) => {
        password.current = e.target.value;
    }

    const setEmail = (e) => {
        email.current = e.target.value;
        

    }

    const buttonLoginStyle = {
        marginTop: '10px',
        marginRight: '30px'

    }
    const buttonRegisterStyle = {
        marginTop: '10px',
        marginLeft: '30px',
        

    }
    const boxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const checkCredentails = () => {
        let sprawdzenie = ((email.current.trim() === loginTest) && (password.current.trim() === passwordTest)) ? true : false;
        console.log(sprawdzenie)
        return (sprawdzenie);
    }

    const handleLogin = () =>{
        if(checkCredentails()){

        }
        else{
            handleOpen();
        }
    }

    return(<>
        <div className="login-window">
            <h2>Zaloguj się</h2>
            <input type="email" placeholder="Podaj adres e-mail" className="input-login" onChange={setEmail}></input>
            <input type="password" placeholder="Podaj hasło" className="input-login" onChange={setPassword}></input>
            <div className="buttons-div">
                <Button  variant="outlined" style={buttonLoginStyle} onClick={() => handleLogin()}>Zaloguj</Button>
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        <Box sx={boxStyle}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Logowanie nie powiodło się
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Nieprawidłowy adres e-mail, lub hasło.
                            </Typography>
                        </Box>
                    </Modal>
                <Button  variant="outlined" style={buttonRegisterStyle}> Rejestracja</Button>
            </div>

        </div>
    
    </>);
}

export default LoginComponent;