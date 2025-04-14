import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 450,
  margin: 'auto',
  marginTop: theme.spacing(8),
  textAlign: 'center',
}));

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Research Bridge
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to the Research Bridge
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ mb: 2 }}
          >
            Login
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Homepage;