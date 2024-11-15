import { Modal, Box, Typography} from "@mui/material";



export default function ModalComponent({open, handleClose, header, mainText}){


    const boxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius: '25px',
        boxShadow: 24,
        p: 4,
      };

    return(<>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={boxStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {header}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {mainText}
                </Typography>
            </Box>
        </Modal>
    </>);
}