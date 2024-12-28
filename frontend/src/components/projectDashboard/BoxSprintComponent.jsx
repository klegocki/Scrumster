
export default function BoxSprintComponent(props){
    const boxComponentHeaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    return(<>
        <div className="box-component">
            <h3 style={boxComponentHeaderStyle}>Obecny sprint</h3>
            <div className="box-ongoing-sprint-component-body">
                {props.ongoingSprints}
            </div>
            <h3 style={boxComponentHeaderStyle}>Przyszłe sprinty</h3>
            <div className="box-future-sprint-component-body">
                {props.futureSprints}
            </div>
        </div>
    </>);
}