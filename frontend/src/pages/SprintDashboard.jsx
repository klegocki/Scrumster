import axios from "axios";
import { getCsrfToken } from "../functions/utils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TopBar from "../components/dashboard/TopBar";
import MainBox from "../components/dashboard/MainBox";
import { useParams } from 'react-router-dom';
import SprintBody from "../components/sprintDashboard/SprintBody";

export default function SprintDashboard(){
    const { sprintId, projectId} = useParams();

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
      username: '',
      first_name: '',
      last_name: '',
      email: ''
    });


    const fetchUserInfo = () => {
        axios
          .get("/api/users/loggedInUser", {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCsrfToken(),
            },
            withCredentials: true 
          })
          .then((response) => {
            setUserInfo({
              username: response.data.username,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              email: response.data.email
            });
          })
          .catch((error) => {
            navigate('/login');
          });
      };
    
      useEffect(() => {
        fetchUserInfo(); 
      }, []); 

    return(<>
    
      <TopBar userInfo={userInfo}
              fetchUserInfo={fetchUserInfo}
              textLeft="Panel"
              textRight="Sprintu"></TopBar>
      <MainBox content={<SprintBody projectId={projectId}
                                    sprintId={sprintId}>
                        </SprintBody>}>
        
      </MainBox>

    </>);
}