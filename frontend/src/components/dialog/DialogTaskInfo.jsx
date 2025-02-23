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
        <Dialog
            open={open}
            onClose={handleClose}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            maxWidth="sm"    
            fullWidth 
        >

            <DialogTitle
                id="scroll-dialog-title"
                sx={{
                    fontSize: '1rem',
                    p: 1 
                }}
            >
                Informacje o zadaniu
            </DialogTitle>


            <DialogContent
                dividers
                sx={{ p: 1 }}
            >
                <Typography variant="subtitle2" sx={{ fontSize: '0.95rem' }}>
                    Obecny stan zadania
                </Typography>

                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        p: 0.5,          
                        mb: 0.5,         
                        boxShadow: 1,
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 0.5,
                            fontWeight: 'bold',
                            color: '#333',
                            fontSize: '0.95rem'
                        }}
                    >
                        {task.title}
                    </Typography>

                    <Box
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            p: 0.5,
                            mb: 0.5,
                            backgroundColor: '#fff'
                        }}
                    >
                        <Typography variant="body2" sx={{ color: '#555', fontSize: '0.9rem' }}>
                            Użytkownik:{' '}
                            {task.user
                                ? `${task.user.first_name} ${task.user.last_name} (${task.user.email})`
                                : 'Brak przypisanego użytkownika'}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            p: 0.5,
                            mb: 0.5,
                            backgroundColor: '#fff'
                        }}
                    >
                        <Typography variant="body2" sx={{ color: '#555', fontSize: '0.9rem' }}>
                            {task?.git_link ? (
                                <a
                                    href={
                                        task?.git_link?.startsWith('http')
                                            ? task.git_link
                                            : `https://${task.git_link}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Przejdź do strony kontroli wersji
                                </a>
                            ) : (
                                'Brak linku do strony kontroli wersji'
                            )}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                flex: 1,
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                p: 0.5,
                                backgroundColor: '#fff',
                                fontSize: '0.9rem'
                            }}
                        >
                            Sprint: {task.sprint || 'Brak przypisanego sprintu'}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                flex: 1,
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                p: 0.5,
                                backgroundColor: '#fff',
                                fontSize: '0.9rem'
                            }}
                        >
                            Status: {task.status}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                flex: 1,
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                p: 0.5,
                                backgroundColor: '#fff',
                                fontSize: '0.9rem'
                            }}
                        >
                            Data utworzenia: {task.created}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                flex: 1,
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                p: 0.5,
                                backgroundColor: '#fff',
                                fontSize: '0.9rem'
                            }}
                        >
                            Czas na zadanie:{' '}
                            {task.estimated_hours ? `${task.estimated_hours}h` : 'Nie określono'}
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            p: 0.5,
                            backgroundColor: '#fff',
                            fontSize: '0.9rem'
                        }}
                    >
                        Opis: {task.description}
                    </Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ mt: 0.5, fontSize: '0.95rem' }}>
                    Historia zadania
                </Typography>

                {task.tasks_history.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.9rem' }}>
                        Brak historii zadania
                    </Typography>
                ) : (
                    task.tasks_history.map((history, index) => (
                        <Box
                            key={index}
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                p: 0.5,
                                mb: 0.5,
                                boxShadow: 1,
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '4px',
                                    p: 0.5,
                                    backgroundColor: '#fff',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Użytkownik:{' '}
                                {history.user
                                    ? `${history.user.first_name} ${history.user.last_name} (${history.user.email})`
                                    : 'Brak przypisanego użytkownika'}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        flex: 1,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '4px',
                                        p: 0.5,
                                        backgroundColor: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {history.sprint || 'Brak przypisanego sprintu'}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        flex: 1,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '4px',
                                        p: 0.5,
                                        backgroundColor: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Status: {history.status}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        flex: 1,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '4px',
                                        p: 0.5,
                                        backgroundColor: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Data zmiany: {history.changed_at}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        flex: 1,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '4px',
                                        p: 0.5,
                                        backgroundColor: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Czas na zadanie:{' '}
                                    {history.estimated_hours
                                        ? `${history.estimated_hours}h`
                                        : 'Nie określono'}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </DialogContent>

            <DialogActions sx={{ p: 1 }}>
                <Button onClick={handleClose} size="small">
                    Zamknij
                </Button>
            </DialogActions>
        </Dialog>
    );
}
