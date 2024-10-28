import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4A90E2', padding: '10px 50px' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          margin: '0 auto',
        }}
      >
      
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Pacifico', cursive",
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          Order App
        </Typography>

        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ fontWeight: 'bold', borderRadius: '20px', padding: '8px 20px' }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
