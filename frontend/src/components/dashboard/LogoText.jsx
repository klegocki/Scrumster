import ReturnComponent from "./ReturnComponent";

export default function LogoText(props){


    const leftParagraphStyle = {
    }

    const rightParagraphStyle = {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',        

    }

    const logoStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',        
    }

    return(<>
    <div className="logo-text">
    <div style={logoStyle}>
            <img src="/static/frontend/ScrumSter.svg" alt="scrumsterLogo"></img>
            <ReturnComponent></ReturnComponent>
        </div>

        <p style={rightParagraphStyle}>{props.textLeft} {props.textRight}</p>
    </div>
    </>);
}