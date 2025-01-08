import LogoutBox from "./LogoutBox";
import LogoText from "./LogoText";
import UserInformation from "./UserInformation";
export default function TopBar(props){

    const {userInfo, textLeft, textRight} = props;

    return(<>
        <div className="dashboard-top">
            <UserInformation
                username={userInfo.username}
                first_name={userInfo.first_name}
                email={userInfo.email}
                last_name={userInfo.last_name}
            ></UserInformation>
            <LogoText   
                textLeft={textLeft}
                textRight={textRight} 
            ></LogoText>
            <LogoutBox
                fetchUserInfo={props.fetchUserInfo}>
            </LogoutBox>
        </div>
    </>);
}