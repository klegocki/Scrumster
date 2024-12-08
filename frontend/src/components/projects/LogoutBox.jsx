import { Button } from '@mui/material';
import LogoutButton from '../logout/LogoutButton.jsx'
import ModalComponent from '../modal/ModalComponent.jsx'
import { useState } from 'react';

export default function LogoutBox(){
    const [open, setOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState("");
    const handleOpen = (header, mainText) => {
        setOpen(true);
        setModalHeader(prevModalHeader => prevModalHeader = header);
        setModalMainText(prevModalMainText => prevModalMainText = mainText);
    };

    const buttonStyle= {
        margin: '15px',
        width: '120px',
    }
    
    const handleClose = () => setOpen(false);



    return(<>
        <div className="logout-box">
            <Button 
                    variant='outlined' 
                    onClick={handleOpen}
                    style={buttonStyle}>
                Ustawienia
            </Button>
            <LogoutButton></LogoutButton>
        </div>
    </>)
}