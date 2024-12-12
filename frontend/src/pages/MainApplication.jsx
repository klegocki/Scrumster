import UserInformation from "../components/projects/UserInformation";
import LogoutBox from "../components/projects/LogoutBox";
import LogoText from "../components/projects/LogoText";
import Projects from "../components/projects/Projects";
import axios from "axios";
import { getCsrfToken } from "../functions/utils";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MainApplication(){

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
      username: '',
      first_name: '',
      last_name: '',
      email: ''
    });

    const mainDashboardText = "Panel Główny";

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
    <div>
    <div className="dashboard-top">
        <UserInformation
            username={userInfo.username}
            first_name={userInfo.first_name}
            email={userInfo.email}
            last_name={userInfo.last_name}
        ></UserInformation>
        <LogoText text1="Panel" text2="Główny"></LogoText>
        <LogoutBox></LogoutBox>
    </div>
    <div className="dashboard-bottom">
        <Projects username={userInfo.username}></Projects>
    </div>
    </div>
    </>);
}