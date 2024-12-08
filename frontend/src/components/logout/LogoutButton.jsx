import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import ModalComponent from "../modal/ModalComponent";
import React, { useState } from "react";
import axios from "axios";
import { getCsrfToken } from "../../functions/utils";

export default function LogoutButton(){

    const [open, setOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const [modalMainText, setModalMainText] = useState("");
    const handleClose = () => setOpen(false);

    const handleOpen = (header, mainText) => {
        setOpen(true);
        setModalHeader(prevModalHeader => prevModalHeader = header);
        setModalMainText(prevModalMainText => prevModalMainText = mainText);
    };


    const buttonStyle= {
        margin: '15px',
        width: '120px',
    }

    const navigate = useNavigate();

    const handleLogout = () => {
        const csrfToken = getCsrfToken();
        axios.post(
            "/api/logoutUser",
            {}, 
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                withCredentials: true,
            }
        )
        .then(response => {
            navigate('/login');
        })
        .catch(error => {
            handleOpen("Błąd wylogowywania", error.response.data.message ? error.response.data.message : "Nie jesteś zalogowany.");
        });
    };
    

    return(<>
        <Button style={buttonStyle} variant="outlined" onClick={() => handleLogout()}>
            Wyloguj
        </Button>
        <ModalComponent open={open} handleClose={handleClose} header={modalHeader} mainText={modalMainText}></ModalComponent>
    </>)
}