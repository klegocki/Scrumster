import UserInformation from "../components/projects/UserInformation";
import LogoutBox from "../components/projects/LogoutBox";
import LogoText from "../components/projects/LogoText";
import Projects from "../components/projects/Projects";

export default function MainApplication(){

    const mainDashboardText = "Panel Główny";

    return(<>
    <div className="dashboard-top">
        <UserInformation></UserInformation>
        <LogoText text1="Panel" text2="Główny"></LogoText>
        <LogoutBox></LogoutBox>
    </div>
    <div className="dashboard-bottom">
        <Projects></Projects>
    </div>
    </>);
}