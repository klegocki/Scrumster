import { Button } from '@mui/material';
import LogoutButton from '../logout/LogoutButton.jsx'
import { useState, useEffect } from 'react';
import { Skeleton } from "@mui/material";
import ModalForm from '../modal/ModalForm.jsx';

export default function LogoutBox(){
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true)

    const handleOpen = () => {
        setOpen(true);
    };

    const buttonStyle= {
        margin: '15px',
        width: '120px',
    }
    
    useEffect(()=>{
        setTimeout(()=>{
          setIsLoading(false);
        },2000)
      },[])


    return(<>
        <div className="logout-box">
        {isLoading ? (<Skeleton variant="rounded" 
                              animation='wave'
                              sx={{ width: '120px', height: '30px', margin: '15px'}}></Skeleton>) 
                              : 
                              (<Button  variant='outlined' 
                                        onClick={handleOpen}
                                        style={buttonStyle}>
                                    Ustawienia
                               </Button>)
        }
        {isLoading ? (<Skeleton variant="rounded" 
                              animation='wave'
                              sx={{ width: '120px', height: '30px',margin: '15px'}}></Skeleton>) 
                              : 
                              (<LogoutButton></LogoutButton>)
        }
            
            {open ? (<ModalForm header='test'
                                    body='test 2'
                                    setOpen={setOpen}
                                    open={open}></ModalForm>) : (null)}
        </div>
    </>)
}