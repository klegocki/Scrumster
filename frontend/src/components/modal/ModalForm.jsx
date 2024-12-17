import { Modal, Box, Typography, Button, IconButton} from "@mui/material";


export default function ModalForm(props){

    const { open, setOpen, header, mainText } = props

    const handleClose = () => {
        setOpen(false); 
    };
    
    const boxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        borderRadius: '15px',
        boxShadow: 24,
        p: 4,
      };
    
      const headerStyle = {
        fontWeight: 'bold'
      }

      const exitButtonStyle = {
        float: "right",
        backgroundColor: "red",
        height: "30px",
        width: "30px",
        borderRadius: '5px'
      }

    return(<>
        <Modal
            open={open}
            
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={boxStyle}>
            <IconButton sx={{
                                width: 30,
                                height: 30,
                                float: 'right',
                                backgroundColor: 'hsl(0, 100%, 45%)', 
                                borderRadius: '10px',
                                color: 'black',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: 'hsl(0, 100%, 40%)', 
                                }
                            }}   
                        onClick={handleClose}          
                    >X</IconButton>
                <Typography id="modal-modal-title" variant="h6" component="h2" style={headerStyle}>
                    <h2>{header}</h2>

                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {mainText}
                </Typography>
            </Box>
        </Modal>
    </>);
}