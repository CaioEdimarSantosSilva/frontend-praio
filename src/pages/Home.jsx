import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, InputBase, Container, Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthDialog from '../components/AuthDialog';
import { getUser } from '../services/authService';

const popularTags = ['Guarujá, SP', 'Ipanema, RJ', 'Jericoacoara, CE'];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const dialogOpen = location.pathname === '/login' || location.pathname === '/cadastro';
  const defaultTab = location.pathname === '/cadastro' ? 1 : 0;

  const handleOpenLogin = () => navigate('/login');
  const handleOpenCadastro = () => navigate('/cadastro');
  const handleCloseAuth = () => navigate('/');
  const handleLoginSuccess = () => navigate('/');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onLogin={handleOpenLogin} onCadastro={handleOpenCadastro} />

      {/* Hero */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: { xs: '80vh', md: '88vh' },
          overflow: 'hidden',
          background: `
            linear-gradient(
              160deg,
              #021e3a 0%,
              #042c53 30%,
              #0a4a7c 60%,
              #185FA5 85%,
              #1a6fbe 100%
            )
          `,
        }}
      >
        {/* Decorative wave layers */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(ellipse 120% 60% at 70% 120%, rgba(55,138,221,0.35) 0%, transparent 60%),
              radial-gradient(ellipse 80% 50% at -10% 80%, rgba(4,44,83,0.6) 0%, transparent 70%)
            `,
          }}
        />

        {/* Subtle wave at bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: 'linear-gradient(to top, rgba(2,16,34,0.5) 0%, transparent 100%)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 6, md: 10 } }}>
          <Stack spacing={{ xs: 2.5, md: 3 }} maxWidth={680}>
            {/* Real-time badge */}
            <Box>
              <Chip
                icon={<WifiTetheringIcon sx={{ fontSize: '0.85rem !important', color: '#7ecfff !important' }} />}
                label="Monitorando em tempo real"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  fontSize: '0.78rem',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  pl: 0.5,
                }}
              />
            </Box>

            {/* Headline */}
            <Typography
              component="h1"
              sx={{
                color: '#fff',
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.6rem', lg: '4rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Conheça a Qualidade das Nossas Praias
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                maxWidth: 520,
                lineHeight: 1.6,
              }}
            >
              Informações em tempo real sobre qualidade do ar, água e condições das praias brasileiras
            </Typography>

            {/* Search bar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.97)',
                borderRadius: 3,
                px: 2,
                py: 0.75,
                maxWidth: 540,
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
              <InputBase
                placeholder="Buscar por praia ou cidade..."
                fullWidth
                sx={{ fontSize: '0.95rem', color: 'text.primary', py: 0.25 }}
              />
              <Button
                variant="contained"
                size="medium"
                sx={{
                  ml: 1,
                  px: { xs: 2, sm: 3 },
                  flexShrink: 0,
                  bgcolor: '#185FA5',
                  background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #042c53 0%, #185FA5 100%)' },
                }}
              >
                Buscar
              </Button>
            </Box>

            {/* Popular tags */}
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                Popular:
              </Typography>
              {popularTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  clickable
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '0.75rem',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.18)', color: '#fff' },
                  }}
                />
              ))}
            </Stack>

            {/* CTA for guests */}
            {!user && (
              <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOpenCadastro}
                  sx={{
                    px: 4,
                    background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #042c53 0%, #185FA5 100%)' },
                    boxShadow: '0 4px 16px rgba(24,95,165,0.5)',
                  }}
                >
                  Criar conta gratuita
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleOpenLogin}
                  sx={{
                    px: 3,
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.4)',
                    '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  Entrar
                </Button>
              </Stack>
            )}

            {user && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Bem-vindo de volta, <strong style={{ color: '#fff' }}>{user.nome?.split(' ')[0]}</strong>!
                Explore as praias ou busque por localização.
              </Typography>
            )}
          </Stack>
        </Container>
      </Box>

      <Footer />

      <AuthDialog
        open={dialogOpen}
        defaultTab={defaultTab}
        onClose={handleCloseAuth}
        onLoginSuccess={handleLoginSuccess}
      />
    </Box>
  );
}
