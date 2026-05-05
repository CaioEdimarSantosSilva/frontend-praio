import { AppBar, Toolbar, Box, Button, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getUser, logout } from '../services/authService';

const navLinks = ['Recomendação Inteligente', 'Praias', 'Sobre'];

export default function Header({ onLogin, onCadastro }) {
  const navigate = useNavigate();
  const user = getUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="relative" elevation={0} sx={{ bgcolor: '#042c53' }}>
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 56, md: 64 } }}>
          <Box
            component="img"
            src="/logos/logo_branca.png"
            alt="PRAIÔ"
            sx={{ height: { xs: 34, md: 40 }, cursor: 'pointer', mr: 'auto' }}
            onClick={() => navigate('/')}
          />

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
              {navLinks.map((label) => (
                <Button
                  key={label}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {user ? (
              <>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', display: { xs: 'none', sm: 'block' } }}>
                  Olá, {user.nome?.split(' ')[0]}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLogout}
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onLogin}
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
                >
                  Entrar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={onCadastro}
                  sx={{ bgcolor: '#185FA5', '&:hover': { bgcolor: '#378ADD' } }}
                >
                  Cadastrar
                </Button>
              </>
            )}

            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff', ml: 0.5 }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            {navLinks.map((label) => (
              <ListItem key={label} disablePadding>
                <ListItemButton onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
