import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer,
  Typography, List, ListItem, Divider, useMediaQuery, useScrollTrigger,
} from '@mui/material';
import MenuIcon          from '@mui/icons-material/Menu';
import CloseIcon         from '@mui/icons-material/Close';
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
  const isMobile    = useMediaQuery('(max-width:900px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fecha drawer ao trocar de rota
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // Fecha drawer ao redimensionar para desktop
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // ── Logo + Brand ──
  const Brand = () => (
    <Box
      onClick={() => navigate('/')}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        cursor: 'pointer', textDecoration: 'none',
        '&:hover img': { opacity: 0.8 },
        '&:hover .brand-text': { color: '#0d4a8a' },
      }}
    >
      <Box
        component="img"
        src="/logos/logo_branca.png"
        alt="PRAIÔ"
        sx={{ height: { xs: 42, md: 52 }, width: 'auto', display: 'block', transition: 'opacity 0.2s' }}
      />
      <Typography
        className="brand-text"
        sx={{
          fontFamily: '"Raleway", sans-serif',
          fontWeight: 900,
          fontSize: { xs: '1.25rem', md: '1.5rem' },
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
  );

  // ── Auth buttons ──
  const AuthButtons = ({ mobile = false }) =>
    user ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: mobile ? 'column' : 'row', width: mobile ? '100%' : 'auto' }}>
        <Typography sx={{ color: '#546e7a', fontSize: '0.9rem' }}>
          Olá, <strong>{user.nome?.split(' ')[0]}</strong>
        </Typography>
        <Button
          variant="outlined"
          fullWidth={mobile}
          onClick={handleLogout}
          sx={{
            color: '#185FA5', borderColor: 'rgba(24,95,165,0.4)', borderRadius: 3,
            fontSize: '0.975rem',
            '&:hover': { borderColor: '#185FA5', bgcolor: 'rgba(24,95,165,0.05)' },
          }}
        >
          Sair
        </Button>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', gap: 1, flexDirection: mobile ? 'column' : 'row', width: mobile ? '100%' : 'auto' }}>
        <Button
          startIcon={!mobile && <PersonOutlinedIcon />}
          fullWidth={mobile}
          onClick={() => { onLogin?.(); setDrawerOpen(false); }}
          sx={{
            color: '#546e7a', borderRadius: 3, fontWeight: 500, fontSize: '0.975rem',
            ...(mobile && { border: '1px solid rgba(24,95,165,0.25)', py: 1.2 }),
            '&:hover': { bgcolor: 'rgba(24,95,165,0.07)', color: '#185FA5' },
          }}
        >
          Entrar
        </Button>
        <Button
          variant="contained"
          fullWidth={mobile}
          onClick={() => { onCadastro?.(); setDrawerOpen(false); }}
          sx={{
            bgcolor: '#042c53', borderRadius: 3, fontSize: '0.975rem',
            px: mobile ? undefined : 2.5,
            py: mobile ? 1.2 : undefined,
            '&:hover': { bgcolor: '#185FA5' },
          }}
        >
          Cadastrar
        </Button>
      </Box>
    );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          color: '#1a2e44',
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3, md: '10%' },
            py: { xs: 1, md: 1.5 },
            minHeight: { xs: 60, md: 76 },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* ── Esquerda: Logo ── */}
          <Box sx={{ flex: 1 }}>
            <Brand />
          </Box>

          {/* ── Centro: Nav (desktop) ── */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                      border:  active ? '1.5px solid rgba(24,95,165,0.28)' : '1.5px solid transparent',
                      bgcolor: active ? 'rgba(24,95,165,0.07)' : 'transparent',
                      transition: 'all 0.15s',
                      '&:hover': {
                        bgcolor: 'rgba(24,95,165,0.08)',
                        color: '#185FA5',
                        borderColor: 'rgba(24,95,165,0.18)',
                      },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* ── Direita: Auth (desktop) / Hambúrguer (mobile) ── */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            {!isMobile && <AuthButtons />}
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  color: '#042c53',
                  border: '1px solid rgba(4,44,83,0.15)',
                  borderRadius: 2,
                  p: 0.75,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Drawer Mobile ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '80vw',
            maxWidth: 320,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Drawer header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Brand />
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#546e7a' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Nav links */}
        <List sx={{ px: 1.5, py: 1.5, flex: 1 }}>
          {NAV_LINKS.map(({ label, path }) => {
            const active = isActive(path);
            return (
              <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
                <Button
                  fullWidth
                  onClick={() => navigate(path)}
                  sx={{
                    justifyContent: 'flex-start',
                    color:      active ? '#185FA5' : '#1a2e44',
                    fontWeight: active ? 700 : 500,
                    fontSize:   '1rem',
                    borderRadius: 2,
                    px: 2,
                    py: 1.2,
                    bgcolor: active ? 'rgba(24,95,165,0.08)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(24,95,165,0.06)', color: '#185FA5' },
                  }}
                >
                  {label}
                </Button>
              </ListItem>
            );
          })}
        </List>

        {/* Auth at bottom */}
        <Box sx={{ px: 2.5, py: 2.5, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <AuthButtons mobile />
        </Box>
      </Drawer>
    </>
  );
}
