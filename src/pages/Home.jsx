import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, InputBase, Container, Stack,
  Grid, CircularProgress, Alert, Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthDialog from '../components/AuthDialog';
import BeachCard from '../components/BeachCard';
import { getUser } from '../services/authService';
import { searchBeachesByCity } from '../services/beachService';

const POPULAR_TAGS = ['Copacabana, RJ', 'Itanhaém, SP', 'Jericoacoara, CE'];

// Unsplash beach photo (free to use)
const BG_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80';

function BeachCardSkeleton() {
  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(24,95,165,0.12)' }}>
      <Skeleton variant="rectangular" height={140} sx={{ bgcolor: 'rgba(24,95,165,0.08)' }} />
      <Box sx={{ p: 2.5 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={28} sx={{ mb: 0.5, bgcolor: 'rgba(24,95,165,0.06)' }} />
        ))}
      </Box>
    </Box>
  );
}

export default function Home() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const user      = getUser();
  const resultsRef = useRef(null);

  const [query,   setQuery]   = useState('');
  const [beaches, setBeaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [searched, setSearched] = useState(false);

  const dialogOpen   = location.pathname === '/login' || location.pathname === '/cadastro';
  const defaultTab   = location.pathname === '/cadastro' ? 1 : 0;

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError('');
    setBeaches([]);
    setSearched(true);

    // Scroll to results after a short delay
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    try {
      const results = await searchBeachesByCity(q);
      setBeaches(results);
    } catch (err) {
      setError(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onLogin={() => navigate('/login')}
        onCadastro={() => navigate('/cadastro')}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: { xs: '82vh', md: '90vh' },
          overflow: 'hidden',
        }}
      >
        {/* Background photo */}
        <Box
          component="img"
          src={BG_IMAGE}
          alt=""
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            zIndex: 0,
          }}
        />

        {/* Dark blue overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, rgba(2,16,34,0.72) 0%, rgba(4,44,83,0.65) 50%, rgba(24,95,165,0.55) 100%)',
            zIndex: 1,
          }}
        />

        {/* Bottom fade */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: 'linear-gradient(to top, rgba(230,241,251,1) 0%, transparent 100%)',
            zIndex: 2,
          }}
        />

        <Container
          maxWidth="md"
          sx={{
            position: 'relative',
            zIndex: 3,
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          {/* Badge */}
          <Chip
            icon={<WifiTetheringIcon sx={{ fontSize: '0.85rem !important', color: '#7ecfff !important' }} />}
            label="Monitoramento em tempo real"
            size="small"
            sx={{
              mb: 3,
              bgcolor: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 500,
              fontSize: '0.78rem',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              pl: 0.5,
            }}
          />

          {/* Headline */}
          <Typography
            component="h1"
            sx={{
              color: '#fff',
              fontSize: { xs: '2.4rem', sm: '3rem', md: '3.8rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: 2,
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            Conheça a Qualidade<br />
            das Nossas Praias
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.78)',
              fontSize: { xs: '1rem', md: '1.15rem' },
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Informações em tempo real sobre qualidade do ar, água e<br />
            condições das praias brasileiras
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
              maxWidth: 560,
              mx: 'auto',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
            <InputBase
              placeholder="Busque por uma praia ou cidade..."
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ fontSize: '0.95rem', color: 'text.primary', py: 0.25 }}
            />
            <Button
              variant="contained"
              size="medium"
              onClick={() => handleSearch()}
              disabled={loading}
              sx={{
                ml: 1,
                px: { xs: 2, sm: 3 },
                flexShrink: 0,
                background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #042c53 0%, #185FA5 100%)' },
                '&.Mui-disabled': { bgcolor: '#ccc' },
              }}
            >
              {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Buscar'}
            </Button>
          </Box>

          {/* Popular tags */}
          <Stack direction="row" alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ mt: 2.5, gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
              Popular:
            </Typography>
            {POPULAR_TAGS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                clickable
                onClick={() => handleSearch(tag)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(6px)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.22)', color: '#fff' },
                }}
              />
            ))}
          </Stack>

          {/* Scroll hint */}
          <Box
            sx={{
              mt: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              opacity: 0.6,
            }}
          >
            <Typography variant="caption" sx={{ color: '#fff', letterSpacing: '0.15em', fontWeight: 600, fontSize: '0.7rem' }}>
              EXPLORAR
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: '#fff', fontSize: '1.4rem', animation: 'bounce 2s infinite' }} />
          </Box>
        </Container>
      </Box>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <Box
        ref={resultsRef}
        sx={{ flex: 1, bgcolor: '#E6F1FB', py: { xs: 4, md: 6 } }}
      >
        <Container maxWidth="lg">
          {/* Not searched yet → show intro */}
          {!searched && !loading && (
            <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#042c53', mb: 1 }}>
                🏖️ Descubra praias brasileiras
              </Typography>
              <Typography sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto' }}>
                Digite o nome de uma cidade acima e veja as praias da região com dados de
                clima, qualidade do ar e condições do mar em tempo real.
              </Typography>

              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mt: 3, gap: 1.5 }}>
                {[
                  { icon: '☀️', label: 'Clima atual' },
                  { icon: '💨', label: 'Qualidade do ar' },
                  { icon: '🌊', label: 'Condição da água' },
                  { icon: '🕶️', label: 'Índice UV' },
                ].map(({ icon, label }) => (
                  <Chip
                    key={label}
                    label={`${icon} ${label}`}
                    sx={{
                      bgcolor: '#fff',
                      border: '1px solid rgba(24,95,165,0.15)',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      px: 0.5,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Loading skeletons */}
          {loading && (
            <Box>
              <Skeleton height={36} width={280} sx={{ mb: 3, bgcolor: 'rgba(24,95,165,0.08)' }} />
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <BeachCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Error */}
          {error && !loading && (
            <Alert
              severity="warning"
              sx={{ borderRadius: 2, maxWidth: 600, mx: 'auto' }}
              action={
                <Button color="inherit" size="small" onClick={() => handleSearch()}>
                  Tentar novamente
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Results */}
          {!loading && !error && beaches.length > 0 && (
            <Box>
              <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#042c53' }}>
                  Praias encontradas
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {beaches.length} resultado{beaches.length !== 1 ? 's' : ''} · dados ao vivo
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                {beaches.map((beach) => (
                  <Grid key={beach.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <BeachCard beach={beach} />
                  </Grid>
                ))}
              </Grid>

              <Typography
                variant="caption"
                sx={{ display: 'block', textAlign: 'center', mt: 4, color: 'text.secondary' }}
              >
                Localização: OpenStreetMap · Clima: Open-Meteo · Qualidade do ar: Open-Meteo AQI
              </Typography>
            </Box>
          )}

          {/* Searched but no results */}
          {!loading && !error && searched && beaches.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Nenhuma praia encontrada para "<strong>{query}</strong>"
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Tente adicionar o estado, ex: "Santos, SP" ou "Natal, RN"
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Footer />

      <AuthDialog
        open={dialogOpen}
        defaultTab={defaultTab}
        onClose={() => navigate('/')}
        onLoginSuccess={() => navigate('/')}
      />

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </Box>
  );
}
