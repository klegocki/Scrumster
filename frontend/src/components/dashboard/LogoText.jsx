
export default function LogoText(props){


    const leftParagraphStyle = {
        justifyContent: 'right'
    }

    const rightParagraphStyle = {
        justifyContent: 'left'
    }

    return(<>
    <div className="logo-text">
        <p style={leftParagraphStyle}>{props.textLeft}</p>
            <img src="/static/frontend/ScrumSter.svg" alt="scrumsterLogo"></img>
        <p style={rightParagraphStyle}>{props.textRight}</p>
    </div>
    </>);
}