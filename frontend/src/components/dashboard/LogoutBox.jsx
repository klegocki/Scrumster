import { Button } from '@mui/material';
import LogoutButton from '../logout/LogoutButton.jsx'
import ModalComponent from '../modal/ModalComponent.jsx'
import { useState } from 'react';
import ModalForm from '../modal/ModalForm.jsx';

export default function LogoutBox(){
    const [open, setOpen] = useState(false);


    const handleOpen = () => {
        setOpen(true);
    };

    const buttonStyle= {
        margin: '15px',
        width: '120px',
    }
    



    return(<>
        <div className="logout-box">
            <Button 
                    variant='outlined' 
                    onClick={handleOpen}
                    style={buttonStyle}>
                Ustawienia
            </Button>
            <LogoutButton></LogoutButton>
            {open ? (<ModalForm header='test'
                                    body='test 2'
                                    setOpen={setOpen}
                                    open={open}></ModalForm>) : (null)}
        </div>
    </>)
}