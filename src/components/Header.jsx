import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer,
  List, ListItem, ListItemButton, ListItemText, useMediaQuery, Typography,
} from '@mui/material';
import MenuIcon         from '@mui/icons-material/Menu';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, logout } from '../services/authService';

const NAV_LINKS = [
  { label: 'Início',                   path: '/' },
  { label: 'Recomendação Inteligente', path: '/recomendacao' },
  { label: 'Praias',                   path: '/praias' },
  { label: 'Sobre',                    path: '/sobre' },
];

export default function Header({ onLogin, onCadastro }) {
  const navigate    = useNavigate();
  const location    = useLocation();
  const user        = getUser();
  const isMobile    = useMediaQuery('(max-width:768px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <AppBar
        position="relative"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          color: '#1a2e44',
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, md: '15%' },
            py: { xs: 1.5, md: 2 },
            minHeight: { xs: 64, md: 80 },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* ── Coluna esquerda: Logo ── */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover img': { opacity: 0.85 },
                '&:hover .brand-text': { color: '#0d4a8a' },
              }}
            >
              <Box
                component="img"
                src="/logos/logo_branca.png"
                alt="PRAIÔ"
                sx={{
                  height: { xs: 42, md: 58 },
                  width: 'auto',
                  display: 'block',
                  transition: 'opacity 0.2s',
                }}
              />
              <Typography
                className="brand-text"
                sx={{
                  fontFamily: '"Raleway", sans-serif',
                  fontWeight: 900,
                  fontSize: { xs: '1.35rem', md: '1.6rem' },
                  color: '#185fa5',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  transition: 'color 0.2s',
                  userSelect: 'none',
                }}
              >
                PRAIÔ
              </Typography>
            </Box>
          </Box>

          {/* ── Coluna central: Navegação ── */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
              {NAV_LINKS.map(({ label, path }) => {
                const active = isActive(path);
                return (
                  <Button
                    key={label}
                    onClick={() => navigate(path)}
                    sx={{
                      color:      active ? '#185FA5' : '#546e7a',
                      fontWeight: active ? 600 : 400,
                      fontSize:   '0.975rem',
                      borderRadius: 3,
                      px: 1.75,
                      border: active
                        ? '1.5px solid rgba(24,95,165,0.28)'
                        : '1.5px solid transparent',
                      bgcolor: active ? 'rgba(24,95,165,0.07)' : 'transparent',
                      transition: 'all 0.15s',
                      '&:hover': {
                        bgcolor:      'rgba(24,95,165,0.08)',
                        color:        '#185FA5',
                        borderColor:  'rgba(24,95,165,0.18)',
                        borderRadius: 3,
                      },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* ── Coluna direita: Auth ── */}
          <Box sx={{ flex: 1, display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
            {user ? (
              <>
                <Typography
                  sx={{ color: '#546e7a', fontSize: '0.975rem', display: { xs: 'none', sm: 'block' } }}
                >
                  Olá, {user.nome?.split(' ')[0]}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    color: '#185FA5',
                    borderColor: 'rgba(24,95,165,0.4)',
                    borderRadius: 3,
                    fontSize: '0.975rem',
                    '&:hover': { borderColor: '#185FA5', bgcolor: 'rgba(24,95,165,0.05)' },
                  }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  startIcon={<PersonOutlinedIcon />}
                  onClick={onLogin}
                  sx={{
                    color: '#546e7a',
                    borderRadius: 3,
                    fontWeight: 500,
                    fontSize: '0.975rem',
                    '&:hover': { bgcolor: 'rgba(24,95,165,0.07)', color: '#185FA5' },
                  }}
                >
                  Entrar
                </Button>
                <Button
                  variant="contained"
                  onClick={onCadastro}
                  sx={{
                    bgcolor: '#042c53',
                    borderRadius: 3,
                    fontSize: '0.975rem',
                    px: 2,
                    '&:hover': { bgcolor: '#185FA5' },
                  }}
                >
                  Cadastrar
                </Button>
              </>
            )}

            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: '#042c53', ml: 0.5 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Drawer mobile ── */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            {NAV_LINKS.map(({ label, path }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  selected={isActive(path)}
                  onClick={() => { navigate(path); setDrawerOpen(false); }}
                  sx={{
                    borderRadius: 2, mx: 1,
                    '&.Mui-selected': { bgcolor: 'rgba(24,95,165,0.1)', color: '#185FA5' },
                  }}
                >
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
