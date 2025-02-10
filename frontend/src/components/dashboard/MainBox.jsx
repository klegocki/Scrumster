
export default function MainBox(props){
    
    return(<>
        <div className="dashboard-bottom">
            <div className="dashboard-projects">
                {props.content}
            </div>
        </div>
    </>)
}