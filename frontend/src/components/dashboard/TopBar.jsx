import LogoutBox from "./LogoutBox";
import LogoText from "./LogoText";
import UserInformation from "./UserInformation";
export default function TopBar(props){

    const {userInfo} = props;

    return(<>
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
    </>);
}