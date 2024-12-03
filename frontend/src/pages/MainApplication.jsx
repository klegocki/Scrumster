import UserInformation from "../components/dashboard/UserInformation";
import LogoutBox from "../components/dashboard/LogoutBox";
import LogoText from "../components/dashboard/LogoText";

export default function MainApplication(){

    const mainDashboardText = "Panel Główny";

    return(<>
    <div className="dashboard-top">
        <UserInformation></UserInformation>
        <LogoText text="Panel Główny"></LogoText>
        <LogoutBox></LogoutBox>
    </div>
    </>);
}