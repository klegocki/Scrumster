
export default function BoxComponent(props){
    
    const boxComponentHeaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    return(<>
        <div className="box-component">
            <h3 style={boxComponentHeaderStyle}>{props.header}</h3>
            <div className="box-component-body">
                {props.body}
            </div>
        </div>
    </>);
}