import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

export default function UserInformation(props) {

  const [isLoading, setIsLoading] = useState(true);

  const paragraphStyle = {
    fontWeight: 'bold'
  };
  useEffect(()=>{
    setTimeout(()=>{
      setIsLoading(false);
    },2000)
  },[])

  return (
    <div className="user-information-component">
      <div className="user-image">
        {isLoading ? (<Skeleton variant="circular" 
                                animation='wave'
                                sx={{ width: '90px', height: '90px' }}></Skeleton>) 
                                : 
                                (<img src="/static/frontend/userImage.svg" alt="userImage" />)
        }
        
      </div>
      <div className="user-info">

      {isLoading ? (<Skeleton variant="text" 
                              animation='wave'
                              sx={{ width: '180px', height: '50px'  }}></Skeleton>) 
                              : 
                              (<><p style={paragraphStyle}>Nazwa użytkownika:</p>
                                 <p>{props.username}</p></>)
        }

      {isLoading ? (<Skeleton variant="text" 
                              animation='wave'
                              sx={{ width: '180px', height: '50px' }}></Skeleton>) 
                              : 
                              (<><p style={paragraphStyle}>Imię i nazwisko:</p>
                                 <p>{props.first_name} {props.last_name}</p></>)
        }
      </div>
    </div>
  );
}
