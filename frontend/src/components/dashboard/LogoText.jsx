
export default function LogoText({text1, text2}){


    const leftParagraphStyle = {
        justifyContent: 'right'
    }

    const rightParagraphStyle = {
        justifyContent: 'left'
    }

    return(<>
    <div className="logo-text">
        <p style={leftParagraphStyle}>{text1}</p>
            <img src="/static/frontend/ScrumSter.svg" alt="scrumsterLogo"></img>
        <p style={rightParagraphStyle}>{text2}</p>
    </div>
    </>);
}