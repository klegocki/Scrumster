import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DialogProjectInfo(props) {


    const {projectData, projectTasks, projectSprints} = props

    console.log(projectData)
    console.log(projectTasks)
    console.log(projectSprints)

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const usersStyle = {

    }

    return (
        <>
        <Button variant="outlined" onClick={handleClickOpen()}>Informacje o projekcie</Button>
        <Dialog
            open={open}
            onClose={handleClose}
            scroll='paper'
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Informacje o projekcie</DialogTitle>
            <DialogContent dividers={true}>
            <DialogContentText
                id="scroll-dialog-description"
                tabIndex={-1}
            >
                <div className='dialog-project-info'>
                    <div className='dialog-project-info-title'>
                        {projectData.title}
                    </div>
                    <div className='dialog-project-info-description'>
                        Opis:<br/>
                        {projectData.description ? (projectData.description) : ("Projekt nie posiada opisu")}
                    </div>
                    <label>Kod zaproszeniowy: </label>
                    <div
                        className='dialog-project-info-invite-code'
                        onClick={() => {
                            navigator.clipboard.writeText(projectData.invite_code);
                            alert("Kod zaproszeniowy został skopiowany do schowka.");
                        }}
                    >
                        {projectData.invite_code}
                    </div>
                    <div style={usersStyle}>
                        Zespół:<br/>
                        <div className='dialog-project-info-user'>
                        Administrator projektu:
                            <p>
                            {projectData.project_owner ? (
                            projectData.project_owner.first_name + " " +
                            projectData.project_owner.last_name )
                            : ("Scrum master nie jest przypisany")}
                            </p>
                            <p>
                            {projectData.project_owner ? (
                            projectData.project_owner.email)
                            : (null)}
                            </p>

                        </div>
                        <div className='dialog-project-info-user'>
                        Scrum master:
                            <p>
                            {projectData.scrum_master ? (
                            projectData.scrum_master.first_name + " " +
                            projectData.scrum_master.last_name )
                            : ("Scrum master nie jest przypisany")}
                            </p>
                            <p>
                            {projectData.scrum_master ? (
                            projectData.scrum_master.email)
                            : (null)}
                            </p>
                        </div>
                        <div className='dialog-project-info-user'>
                            Product owner:
                            <p>
                            {projectData.product_owner ? (
                            projectData.product_owner.first_name + " " +
                            projectData.product_owner.last_name )
                            : ("Product owner nie jest przypisany")}
                            </p>
                            <p>
                            {projectData.product_owner ? (
                            projectData.product_owner.email)
                            : (null)}
                            </p>
                        </div>
                        {projectData.project_users ? (projectData.project_users.map((value, index) =>(
                            <div className='dialog-project-info-user' key={index}>
                                {value.role ? (value.role) : ("Deweloper:")}
                                <p>
                                {value.first_name + " " +
                                value.last_name} 
                                </p>
                                <p>
                                {value.email}
                                </p>
                            </div>
                        ))) : (null)}
                    </div>
                </div>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Zamknij</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}
