
export default function LogoText({text}){

    return(<>
    <div className="logo-text">
        <img src="/static/frontend/ScrumSter.svg" alt="scrumsterLogo"></img>
        <p>{text}</p>
    </div>
    </>);
}