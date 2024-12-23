import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DialogRemoveLeaveProject(props) {

  const {header, body, handleEvent, openParent, handleClose} = props;


  return (
    <>
      <Dialog
        open={openParent}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
            <DialogTitle id="alert-dialog-title">
                {header}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {body}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Odrzuć</Button>
            <Button onClick={handleEvent} autoFocus>
                Potwierdź
            </Button>
            </DialogActions>
        </Dialog>
      </>
  );
}
