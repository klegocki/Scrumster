import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function DialogTaskInfo(props) {
    const { task, open, setOpen } = props;
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Informacje o zadaniu</DialogTitle>
                <DialogContent dividers={true}>
                <Typography variant="subtitle1">Obecny stan zadania</Typography>

                        <Box
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '20px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            <Typography variant="h6" sx={{ marginBottom: '12px', fontWeight: 'bold', color: '#333' }}>
                                {task.title}
                            </Typography>
                            <Box
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Użytkownik:
                                    <br />
                                    {task.user ? (
                                        <>
                                            {task.user?.first_name} {task.user?.last_name} <br />
                                            {task.user?.email} <br />
                                            {task.user?.role}
                                        </>
                                    ) : (
                                        'Brak przypisanego użytkownika'
                                    )}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Sprint:
                                    <br />
                                    {task.sprint ? (
                                        <>
                                            {task.sprint}
                                        </>
                                    ) : (
                                        'Brak przypisanego sprintu'
                                    )}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: '16px',
                                    marginBottom: '16px',
                                }}
                            >
                                <Box
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        backgroundColor: '#fff',
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                        Status:
                                        <br />
                                        {task.status}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        backgroundColor: '#fff',
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                        Data utworzenia:
                                        <br />
                                        {task.created}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        backgroundColor: '#fff',
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                        Czas na zadanie:
                                        <br />
                                        {task.estimated_hours ? task.estimated_hours + "h": "Nie określono"}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Opis:
                                    <br />
                                    {task.description}
                                </Typography>
                            </Box>

                        </Box>
                    <Typography variant="subtitle1" style={{
                        marginTop: '10px'
                    }}>Historia zadania</Typography>

                    {task.tasks_history.length == 0 ? (
                        <Typography variant="body2" sx={{ color: '#555' }}>Brak historii zadania</Typography>

                    ) : (null)}

                    {task.tasks_history.map((history, index) => (
                        <Box
                            key={index}
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '20px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            <Typography variant="h6" sx={{ marginBottom: '12px', fontWeight: 'bold', color: '#333' }}>
                                {history.title}
                            </Typography>
                            <Box
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Użytkownik:
                                    <br />
                                    {history.user ? (
                                        <>
                                            {history.user?.first_name} {history.user?.last_name} <br />
                                            {history.user?.email}
                                        </>
                                    ) : (
                                        'Brak przypisanego użytkownika'
                                    )}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Sprint:
                                    <br />
                                    {history.sprint ? (
                                        <>
                                            {history.sprint}
                                        </>
                                    ) : (
                                        'Brak przypisanego sprintu'
                                    )}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: '16px',
                                    marginBottom: '16px',
                                }}
                            >
                                <Box
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        backgroundColor: '#fff',
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                        Status:
                                        <br />
                                        {history.status}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        backgroundColor: '#fff',
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                        Data zmiany:
                                        <br />
                                        {history.changed_at}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        backgroundColor: '#fff',
                                        flex: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: '#555' }}>
                                        Czas na zadanie:
                                        <br />
                                        {history.estimated_hours ? history.estimated_hours + "h" : "Nie określono"}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                    backgroundColor: '#fff',
                                }}
                            >
                                <Typography variant="body2" sx={{ color: '#555' }}>
                                    Opis:
                                    <br />
                                    {history.description}
                                </Typography>
                            </Box>

                        </Box>
                    ))}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Zamknij</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
