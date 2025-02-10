import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";

export default function ReturnComponent(){

    const { projectId, sprintId} = useParams();
    const navigate = useNavigate();


    const handleGoingBack = () => {

        if(projectId == null){
            setIsAbleToGoBack(false)
        }
        else if (projectId != null && sprintId == null){
            navigate(`/app/projects`);        
        }
        else if (sprintId != null && projectId != null){
            navigate(`/app/project/${projectId}`);

        }

    }

    return(<>
    {projectId ? (
            <Tooltip 
                title="Powrót do poprzedniej strony" 
                placement="bottom"
                arrow
            >
                <IconButton sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: 'hsl(214, 97%, 75%)',
                            borderRadius: '5px',
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: '2rem',
                            '&:hover': {
                                backgroundColor: 'hsl(214, 97%, 70%)',
                            }}}  
                            className="project-component-remove-button"
                            onClick={handleGoingBack}>
                    <ArrowBackOutlinedIcon/>
                </IconButton>
            </Tooltip>

    ) : (null)}

    </>)
}