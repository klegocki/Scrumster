import ReturnComponent from "./ReturnComponent";

export default function LogoText(props){


    const leftParagraphStyle = {
        justifyContent: 'right'
    }

    const rightParagraphStyle = {
        justifyContent: 'left'
    }

    const logoStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        
    }

    return(<>
    <div className="logo-text">
        <p style={leftParagraphStyle}>{props.textLeft}</p>
        <div style={logoStyle}>
            <img src="/static/frontend/ScrumSter.svg" alt="scrumsterLogo"></img>
            <ReturnComponent></ReturnComponent>
        </div>
        <p style={rightParagraphStyle}>{props.textRight}</p>
    </div>
    </>);
}