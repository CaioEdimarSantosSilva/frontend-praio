import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, InputBase, Container, Stack,
  CircularProgress, Alert, Skeleton,
} from '@mui/material';
import SearchIcon           from '@mui/icons-material/Search';
import WifiTetheringIcon    from '@mui/icons-material/WifiTethering';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Header      from '../components/Header';
import Footer      from '../components/Footer';
import AuthDialog  from '../components/AuthDialog';
import BeachCard   from '../components/BeachCard';
import { getUser } from '../services/authService';
import { searchBeachesByCity, reverseGeocode } from '../services/beachService';

const POPULAR_TAGS = ['Copacabana, RJ', 'Itanhaém, SP', 'Jericoacoara, CE'];

const BG_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80';

// Alturas do header para offset (deve bater com Header.jsx)
const HEADER_HEIGHT = { xs: '60px', md: '76px' };

function BeachCardSkeleton() {
  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(24,95,165,0.1)', bgcolor: '#fff' }}>
      <Skeleton variant="rectangular" height={150} sx={{ bgcolor: 'rgba(24,95,165,0.07)' }} />
      <Box sx={{ p: 2.5 }}>
        {[100, 80, 80, 70].map((w, i) => (
          <Skeleton key={i} height={24} width={`${w}%`} sx={{ mb: 1, bgcolor: 'rgba(24,95,165,0.05)' }} />
        ))}
      </Box>
    </Box>
  );
}

export default function Home() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const user       = getUser();
  const resultsRef = useRef(null);

  const [query,      setQuery]      = useState('');
  const [beaches,    setBeaches]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [searched,   setSearched]   = useState(false);
  const [geoLoading,  setGeoLoading]  = useState(false);
  const [geoCity,     setGeoCity]     = useState('');
  const [geoAttempted, setGeoAttempted] = useState(false);

  // Auto-detect user location on first load
  useEffect(() => {
    if (!navigator.geolocation) return;
    setGeoAttempted(true);
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const city = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setGeoCity(city);
          await handleSearch(city);
        } catch {
          // silently ignore — user sees the intro state
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        // permission denied or error — just hide the spinner
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dialogOpen = location.pathname === '/login' || location.pathname === '/cadastro';
  const defaultTab = location.pathname === '/cadastro' ? 1 : 0;

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError('');
    setBeaches([]);
    setSearched(true);
    setTimeout(scrollToResults, 200);
    try {
      const results = await searchBeachesByCity(q);
      setBeaches(results);
    } catch (err) {
      setError(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onLogin={() => navigate('/login')}
        onCadastro={() => navigate('/cadastro')}
      />

      {/* Offset para header fixo */}
      <Box sx={{ height: HEADER_HEIGHT, flexShrink: 0 }} />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: { xs: 'calc(100vh - 60px)', md: 'calc(100vh - 76px)' },
          overflow: 'hidden',
        }}
      >
        {/* Foto de fundo */}
        <Box
          component="img"
          src={BG_IMAGE}
          alt=""
          aria-hidden
          sx={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 40%',
            zIndex: 0,
          }}
        />

        {/* Overlay azul escuro */}
        <Box
          sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, rgba(2,16,34,0.78) 0%, rgba(4,44,83,0.68) 50%, rgba(24,95,165,0.52) 100%)',
            zIndex: 1,
          }}
        />

        {/* Fade inferior */}
        <Box
          sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 120,
            background: 'linear-gradient(to top, #E6F1FB 0%, transparent 100%)',
            zIndex: 2,
          }}
        />

        <Container
          maxWidth="md"
          sx={{ position: 'relative', zIndex: 3, py: { xs: 8, md: 10 }, textAlign: 'center' }}
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

          {/* Título */}
          <Typography
            component="h1"
            sx={{
              color: '#fff',
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: 2.5,
              textShadow: '0 2px 16px rgba(0,0,0,0.35)',
            }}
          >
            Conheça a Qualidade<br />
            das Nossas Praias
          </Typography>

          {/* Subtítulo */}
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.78)',
              fontSize: { xs: '1rem', md: '1.15rem' },
              mb: 4,
              lineHeight: 1.7,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            Informações em tempo real sobre qualidade do ar, água e condições das praias brasileiras
          </Typography>

          {/* Barra de pesquisa */}
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ fontSize: '0.95rem', color: 'text.primary', py: 0.25 }}
            />
            <Button
              variant="contained"
              onClick={() => handleSearch()}
              disabled={loading}
              sx={{
                ml: 1, px: { xs: 2, sm: 3 }, flexShrink: 0,
                background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #042c53 0%, #185FA5 100%)' },
                '&.Mui-disabled': { opacity: 0.6 },
              }}
            >
              {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Buscar'}
            </Button>
          </Box>

          {/* Tags populares */}
          <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
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
          </Box>

          {/* Botão Explorar (funcional) */}
          <Box
            onClick={scrollToResults}
            sx={{
              mt: { xs: 5, md: 7 },
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              opacity: 0.65,
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 1 },
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: '#fff', letterSpacing: '0.15em', fontWeight: 600, fontSize: '0.7rem' }}
            >
              EXPLORAR
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: '#fff', fontSize: '1.6rem', animation: 'bounce 2s infinite' }} />
          </Box>
        </Container>
      </Box>

      {/* ── Resultados ──────────────────────────────────────────────────── */}
      <Box
        ref={resultsRef}
        sx={{ flex: 1, bgcolor: '#E6F1FB', py: { xs: 5, md: 8 } }}
      >
        <Container maxWidth="lg">

          {/* Detectando localização */}
          {geoLoading && !searched && (
            <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
              <CircularProgress size={36} sx={{ color: '#185FA5', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#042c53', fontWeight: 600, mb: 0.5 }}>
                Detectando sua localização…
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Buscando as praias mais próximas de você
              </Typography>
            </Box>
          )}

          {/* Estado inicial — só aparece se geolocalização não foi tentada */}
          {!searched && !loading && !geoLoading && !geoAttempted && (
            <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: '#042c53', mb: 1.5, fontSize: { xs: '1.6rem', md: '2rem' } }}
              >
                🏖️ Descubra praias brasileiras
              </Typography>
              <Typography sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
                Digite o nome de uma cidade e veja as praias da região com dados de clima,
                qualidade do ar e condições do mar em tempo real.
              </Typography>

              <Stack direction="row" justifyContent="center" flexWrap="wrap" sx={{ mt: 4, gap: 1.5 }}>
                {[
                  { icon: '☀️', label: 'Clima atual' },
                  { icon: '💨', label: 'Qualidade do ar' },
                  { icon: '🌊', label: 'Condição da água' },
                  { icon: '🕶️', label: 'Índice UV' },
                ].map(({ icon, label }) => (
                  <Chip
                    key={label}
                    label={`${icon}  ${label}`}
                    sx={{
                      bgcolor: '#fff',
                      border: '1px solid rgba(24,95,165,0.15)',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      px: 1,
                      py: 0.5,
                      height: 'auto',
                      boxShadow: '0 2px 8px rgba(24,95,165,0.08)',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Loading */}
          {loading && (
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Skeleton height={36} width={220} sx={{ mb: 1, bgcolor: 'rgba(24,95,165,0.07)', borderRadius: 2 }} />
                <Skeleton height={24} width={160} sx={{ bgcolor: 'rgba(24,95,165,0.05)', borderRadius: 2 }} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, minWidth: { sm: 260 } }}>
                    <BeachCardSkeleton />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Erro */}
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

          {/* Cards de praias */}
          {!loading && !error && beaches.length > 0 && (
            <Box>
              <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#042c53', mb: 1 }}>
                  {geoCity && query === geoCity ? '📍 Praias perto de você' : 'Praias encontradas'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${beaches.length} resultado${beaches.length !== 1 ? 's' : ''}`}
                    size="small"
                    sx={{ bgcolor: 'rgba(24,95,165,0.1)', color: '#185FA5', fontWeight: 600 }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    · dados em tempo real
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                {beaches.map((beach) => (
                  <Box
                    key={beach.id}
                    sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, minWidth: { sm: 260 } }}
                  >
                    <BeachCard beach={beach} />
                  </Box>
                ))}
              </Box>

              <Typography
                variant="caption"
                sx={{ display: 'block', textAlign: 'center', mt: 5, color: 'text.secondary', opacity: 0.7 }}
              >
                Localização: OpenStreetMap · Clima & Qualidade do ar: Open-Meteo
              </Typography>
            </Box>
          )}

          {/* Sem resultados */}
          {!loading && !error && searched && beaches.length === 0 && (
            <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
              <Typography variant="h2" sx={{ mb: 2 }}>🏝️</Typography>
              <Typography variant="h6" sx={{ color: '#042c53', fontWeight: 700, mb: 1 }}>
                Nenhuma praia encontrada para "{query}"
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Tente incluir o estado — ex: "Santos, SP" ou "Natal, RN"
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

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(8px); }
        }
      `}</style>
    </Box>
  );
}
