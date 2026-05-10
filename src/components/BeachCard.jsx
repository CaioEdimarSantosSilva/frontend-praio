import {
  Box, Card, CardContent, Typography, Chip, Stack, Divider, Tooltip, Button,
} from '@mui/material';
import AirIcon          from '@mui/icons-material/Air';
import WbSunnyIcon      from '@mui/icons-material/WbSunny';
import OpacityIcon      from '@mui/icons-material/Opacity';
import LocationOnIcon   from '@mui/icons-material/LocationOn';
import WaterDropIcon    from '@mui/icons-material/WaterDrop';
import GrainIcon        from '@mui/icons-material/Grain';
import DirectionsIcon   from '@mui/icons-material/Directions';

import {
  getWeatherInfo, getAQIInfo, getUVInfo, getWaterQualityInfo,
} from '../services/beachService';

function StatRow({ icon, label, value, chip }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 0.6, minHeight: 34 }}>
      <Box sx={{ color: '#90a4ae', display: 'flex', alignItems: 'center', mr: 1, flexShrink: 0 }}>
        {icon}
      </Box>
      <Typography variant="caption" sx={{ color: '#78909c', width: 82, flexShrink: 0, fontSize: '0.78rem' }}>
        {label}
      </Typography>
      <Box sx={{ ml: 'auto' }}>
        {chip ?? (
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
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
      sx={{
        fontSize: '0.7rem', fontWeight: 700, height: 22,
        bgcolor: bg, color,
        border: `1px solid ${color}33`,
      }}
    />
  );
}

export default function BeachCard({ beach }) {
  const weather   = getWeatherInfo(beach.weatherCode);
  const aqiInfo   = getAQIInfo(beach.aqi);
  const uvInfo    = getUVInfo(beach.uvIndex);
  const waterInfo = getWaterQualityInfo(beach.precipitation, beach.weatherCode);

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${beach.lat},${beach.lon}&travelmode=driving`;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(24,95,165,0.12)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.25s, transform 0.25s',
        bgcolor: '#fff',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(24,95,165,0.16)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* ── Cabeçalho ── */}
      <Box
        sx={{
          background: 'linear-gradient(145deg, #021e3a 0%, #185FA5 100%)',
          px: 2.5, pt: 2.5, pb: 2.5,
          position: 'relative',
          minHeight: 155,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          borderRadius: '12px 12px 0 0',
        }}
      >
        {/* Badge qualidade da água */}
        <Chip
          label={`💧 ${waterInfo.label}`}
          size="small"
          sx={{
            position: 'absolute', top: 14, right: 14,
            fontSize: '0.68rem', fontWeight: 700, height: 24,
            bgcolor: waterInfo.bg, color: waterInfo.color,
            border: `1px solid ${waterInfo.color}44`,
          }}
        />

        {/* Clima + temperatura */}
        <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '2.4rem', lineHeight: 1 }}>
            {weather.icon}
          </Typography>
          {beach.temperature != null && (
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>
              {Math.round(beach.temperature)}°C
            </Typography>
          )}
          {beach.feelsLike != null && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', mb: 0.2 }}>
              ST {Math.round(beach.feelsLike)}°
            </Typography>
          )}
        </Stack>

        {/* Nome */}
        <Tooltip title={beach.name} placement="top" enterDelay={600}>
          <Typography
            sx={{
              color: '#fff', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}
          >
            {beach.name}
          </Typography>
        </Tooltip>

        {/* Localização */}
        <Stack direction="row" alignItems="center" spacing={0.3} sx={{ mt: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem' }}>
            {beach.city}{beach.state ? `, ${beach.state}` : ''} · {weather.label}
          </Typography>
        </Stack>
      </Box>

      {/* ── Stats ── */}
      <CardContent sx={{ flex: 1, px: 2.5, py: 1.5, '&:last-child': { pb: 2 } }}>
        <Stack divider={<Divider flexItem sx={{ borderColor: 'rgba(0,0,0,0.05)' }} />}>
          <StatRow
            icon={<OpacityIcon sx={{ fontSize: '1rem' }} />}
            label="Umidade"
            value={beach.humidity != null ? `${beach.humidity}%` : null}
          />
          <StatRow
            icon={<AirIcon sx={{ fontSize: '1rem' }} />}
            label="Vento"
            value={beach.windSpeed != null ? `${Math.round(beach.windSpeed)} km/h` : null}
          />
          <StatRow
            icon={<WbSunnyIcon sx={{ fontSize: '1rem' }} />}
            label="UV"
            chip={
              <QualityChip
                label={`${uvInfo.label}${beach.uvIndex != null ? ` (${beach.uvIndex.toFixed(1)})` : ''}`}
                color={uvInfo.color}
                bg={uvInfo.bg}
              />
            }
          />
          <StatRow
            icon={<WaterDropIcon sx={{ fontSize: '1rem' }} />}
            label="Qualidade ar"
            chip={
              <QualityChip
                label={`${aqiInfo.label}${beach.aqi != null ? ` (${beach.aqi})` : ''}`}
                color={aqiInfo.color}
                bg={aqiInfo.bg}
              />
            }
          />
          {beach.pm25 != null && (
            <StatRow
              icon={<GrainIcon sx={{ fontSize: '1rem' }} />}
              label="PM 2.5"
              value={`${beach.pm25.toFixed(1)} µg/m³`}
            />
          )}
        </Stack>

        {/* Botão Google Maps */}
        <Button
          component="a"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          fullWidth
          startIcon={<DirectionsIcon />}
          sx={{
            mt: 2.5,
            background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #042c53 0%, #185FA5 100%)' },
            fontWeight: 600,
            borderRadius: 2,
            py: 1,
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(24,95,165,0.25)',
          }}
        >
          Ir à praia
        </Button>
      </CardContent>
    </Card>
  );
}
