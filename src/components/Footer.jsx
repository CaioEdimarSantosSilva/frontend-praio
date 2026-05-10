import { Box, Typography, Stack, Link, Divider, IconButton, Chip, Tooltip, Button, Card, CardContent } from '@mui/material';
import InstagramIcon     from '@mui/icons-material/Instagram';
import FacebookIcon      from '@mui/icons-material/Facebook';
import TwitterIcon       from '@mui/icons-material/Twitter';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import AirIcon           from '@mui/icons-material/Air';
import WbSunnyIcon       from '@mui/icons-material/WbSunny';
import OpacityIcon       from '@mui/icons-material/Opacity';
import LocationOnIcon    from '@mui/icons-material/LocationOn';
import WaterDropIcon     from '@mui/icons-material/WaterDrop';
import GrainIcon         from '@mui/icons-material/Grain';
import DirectionsIcon    from '@mui/icons-material/Directions';
import { getWeatherInfo, getAQIInfo, getUVInfo, getWaterQualityInfo } from '../services/beachService';

// ── Dados simulados ────────────────────────────────────────────────────────────
const FEATURED_BEACH = {
  id: 'featured',
  name: 'Praia de Ipanema',
  city: 'Rio de Janeiro',
  state: 'RJ',
  lat: -22.9868,
  lon: -43.1929,
  temperature: 29,
  feelsLike: 31,
  humidity: 68,
  windSpeed: 14,
  weatherCode: 1,
  precipitation: 0,
  uvIndex: 6.8,
  aqi: 38,
  pm25: 7.4,
};

const NAV_LINKS = {
  Navegação: [
    { label: 'Como funciona',          path: '#' },
    { label: 'Praias',                 path: '#' },
    { label: 'Recomendação Inteligente', path: '#' },
    { label: 'Alertas',                path: '#' },
  ],
  Empresa: [
    { label: 'Sobre nós', path: '#' },
    { label: 'Blog',      path: '#' },
    { label: 'Imprensa',  path: '#' },
    { label: 'Contato',   path: '#' },
  ],
};

const SOCIALS = [
  { icon: <InstagramIcon fontSize="small" />, label: 'Instagram', href: 'https://www.instagram.com/accounts/login/' },
  { icon: <FacebookIcon  fontSize="small" />, label: 'Facebook',  href: 'https://www.facebook.com/login/'           },
  { icon: <TwitterIcon   fontSize="small" />, label: 'X',         href: 'https://x.com/login'                       },
];

// ── Helpers do card ────────────────────────────────────────────────────────────
function StatRow({ icon, label, value, chip }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 0.5, minHeight: 30 }}>
      <Box sx={{ color: '#90a4ae', display: 'flex', alignItems: 'center', mr: 1, flexShrink: 0 }}>
        {icon}
      </Box>
      <Typography variant="caption" sx={{ color: '#78909c', width: 76, flexShrink: 0, fontSize: '0.75rem' }}>
        {label}
      </Typography>
      <Box sx={{ ml: 'auto' }}>
        {chip ?? (
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
            {value ?? '—'}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function QualityChip({ label, color, bg }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{ fontSize: '0.68rem', fontWeight: 700, height: 20, bgcolor: bg, color, border: `1px solid ${color}33` }}
    />
  );
}

// ── Card da praia recomendada ──────────────────────────────────────────────────
function FeaturedBeachCard({ beach }) {
  const weather   = getWeatherInfo(beach.weatherCode);
  const aqiInfo   = getAQIInfo(beach.aqi);
  const uvInfo    = getUVInfo(beach.uvIndex);
  const waterInfo = getWaterQualityInfo(beach.precipitation, beach.weatherCode);
  const mapsUrl   = `https://www.google.com/maps/dir/?api=1&destination=${beach.lat},${beach.lon}&travelmode=driving`;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
      }}
    >
      {/* Cabeçalho */}
      <Box
        sx={{
          background: 'linear-gradient(145deg, #021e3a 0%, #185FA5 100%)',
          px: 2, pt: 2, pb: 2,
          position: 'relative',
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          borderRadius: '12px 12px 0 0',
        }}
      >
        {/* Badge "Praia Recomendada" – topo esquerdo */}
        <Box
          sx={{
            position: 'absolute', top: 12, left: 12,
            bgcolor: 'rgba(255,215,0,0.15)',
            border: '1px solid rgba(255,215,0,0.35)',
            borderRadius: 1.5,
            px: 0.8, py: 0.3,
          }}
        >
          <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: '#FFD700', letterSpacing: '0.04em' }}>
            Praia Recomendada
          </Typography>
        </Box>

        {/* Badge qualidade da água – topo direito */}
        <Chip
          label={`💧 ${waterInfo.label}`}
          size="small"
          sx={{
            position: 'absolute', top: 12, right: 12,
            fontSize: '0.66rem', fontWeight: 700, height: 22,
            bgcolor: waterInfo.bg, color: waterInfo.color,
            border: `1px solid ${waterInfo.color}44`,
          }}
        />

        {/* Temperatura */}
        <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 0.5 }}>
          <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{weather.icon}</Typography>
          {beach.temperature != null && (
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.7rem', lineHeight: 1 }}>
              {Math.round(beach.temperature)}°C
            </Typography>
          )}
          {beach.feelsLike != null && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', mb: 0.2 }}>
              ST {Math.round(beach.feelsLike)}°
            </Typography>
          )}
        </Stack>

        <Tooltip title={beach.name} placement="top" enterDelay={600}>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>
            {beach.name}
          </Typography>
        </Tooltip>
        <Stack direction="row" alignItems="center" spacing={0.3} sx={{ mt: 0.4 }}>
          <LocationOnIcon sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem' }}>
            {beach.city}{beach.state ? `, ${beach.state}` : ''} · {weather.label}
          </Typography>
        </Stack>
      </Box>

      {/* Stats */}
      <CardContent sx={{ px: 2, py: 1, '&:last-child': { pb: 1.5 } }}>
        <Stack divider={<Divider flexItem sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />}>
          <StatRow icon={<OpacityIcon sx={{ fontSize: '0.9rem' }} />} label="Umidade"
            value={beach.humidity != null ? `${beach.humidity}%` : null} />
          <StatRow icon={<AirIcon sx={{ fontSize: '0.9rem' }} />} label="Vento"
            value={beach.windSpeed != null ? `${Math.round(beach.windSpeed)} km/h` : null} />
          <StatRow icon={<WbSunnyIcon sx={{ fontSize: '0.9rem' }} />} label="UV"
            chip={<QualityChip label={`${uvInfo.label}${beach.uvIndex != null ? ` (${beach.uvIndex.toFixed(1)})` : ''}`} color={uvInfo.color} bg={uvInfo.bg} />} />
          <StatRow icon={<WaterDropIcon sx={{ fontSize: '0.9rem' }} />} label="Qualidade ar"
            chip={<QualityChip label={`${aqiInfo.label}${beach.aqi != null ? ` (${beach.aqi})` : ''}`} color={aqiInfo.color} bg={aqiInfo.bg} />} />
          {beach.pm25 != null && (
            <StatRow icon={<GrainIcon sx={{ fontSize: '0.9rem' }} />} label="PM 2.5"
              value={`${beach.pm25.toFixed(1)} µg/m³`} />
          )}
        </Stack>
        <Button
          component="a"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          fullWidth
          startIcon={<DirectionsIcon />}
          sx={{
            mt: 2,
            background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #042c53 0%, #185FA5 100%)' },
            fontWeight: 600,
            borderRadius: 2,
            py: 0.9,
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(24,95,165,0.25)',
          }}
        >
          Ir à praia
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: '#042c53', color: '#fff' }}>
      <Box sx={{ px: { xs: 3, md: '13%' }, pt: { xs: 6, md: 8 }, pb: 0 }}>

        {/* ── 3 colunas principais ── */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 6, md: 4 },
          }}
        >
          {/* ── Col 1: Marca ── */}
          <Box
            sx={{
              flex: '0 0 300px',
              width: { xs: '100%', md: 300 },
              maxWidth: { xs: 380, md: 300 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box component="img" src="/logos/logo_azul.png" alt="PRAIÔ"
              sx={{ height: 140, width: 'auto' }} />
            <Typography
              sx={{
                fontFamily: '"Raleway", sans-serif',
                fontWeight: 900,
                fontSize: '1.35rem',
                color: '#fff',
                letterSpacing: '0.04em',
                mt: 1,
                mb: 2,
              }}
            >
              PRAIÔ
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.8, mb: 3 }}>
              Monitoramento em tempo real da qualidade das praias brasileiras — clima, ar e água numa só plataforma.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', width: '100%', display: 'flex' }}>
              {SOCIALS.map(({ icon, label, href }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  size="small"
                  sx={{
                    color: 'rgba(255,255,255,0.45)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 2,
                    p: 0.75,
                    '&:hover': { color: '#fff', borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.08)' },
                    transition: 'all 0.2s',
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* ── Col 2: Navegação ── */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
              pt: { xs: 0, md: '130px' },
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 4, sm: 8 }}
              alignItems={{ xs: 'center', sm: 'flex-start' }}
            >
              {Object.entries(NAV_LINKS).map(([title, items]) => (
                <Box key={title} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: 'rgba(255,255,255,0.35)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      fontSize: '0.72rem',
                      display: 'block',
                      mb: 2.5,
                    }}
                  >
                    {title}
                  </Typography>
                  <Stack spacing={1.6}>
                    {items.map(({ label, path }) => (
                      <Link
                        key={label}
                        href={path}
                        underline="none"
                        sx={{
                          color: 'rgba(255,255,255,0.55)',
                          fontSize: '0.95rem',
                          transition: 'color 0.15s',
                          '&:hover': { color: '#fff' },
                        }}
                      >
                        {label}
                      </Link>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* ── Col 3: Praia Recomendada ── */}
          <Box
            sx={{
              flex: '0 1 300px',
              width: { xs: '100%', sm: 300, md: 'auto' },
            }}
          >
            <FeaturedBeachCard beach={FEATURED_BEACH} />
          </Box>
        </Box>

      </Box>

      {/* ── Rodapé inferior – largura total ── */}
      <Box sx={{ mt: { xs: 6, md: 9 } }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 2 },
            pb: { xs: 4, md: 5 },
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
            © {year} PRAIÔ — Todos os direitos reservados
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WifiTetheringIcon sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
              Dados: OpenStreetMap · Open-Meteo
            </Typography>
          </Box>
        </Box>
      </Box>

    </Box>
  );
}
