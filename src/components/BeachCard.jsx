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
  getWeatherInfo,
  getAQIInfo,
  getUVInfo,
  getWaterQualityInfo,
} from '../services/beachService';

function StatRow({ icon, label, value, chip }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 0.55, minHeight: 32 }}>
      <Box sx={{ color: '#90a4ae', display: 'flex', alignItems: 'center', mr: 1, flexShrink: 0 }}>
        {icon}
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', width: 80, flexShrink: 0 }}>
        {label}
      </Typography>
      <Box sx={{ ml: 'auto' }}>
        {chip ?? (
          <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
            {value ?? '—'}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export default function BeachCard({ beach }) {
  const weather    = getWeatherInfo(beach.weatherCode);
  const aqiInfo    = getAQIInfo(beach.aqi);
  const uvInfo     = getUVInfo(beach.uvIndex);
  const waterInfo  = getWaterQualityInfo(beach.precipitation, beach.weatherCode);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(24,95,165,0.14)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.22s, transform 0.22s',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(24,95,165,0.18)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      {/* ── Cabeçalho ── */}
      <Box
        sx={{
          background: 'linear-gradient(140deg, #021e3a 0%, #185FA5 100%)',
          px: 2.5, pt: 2.5, pb: 2,
          position: 'relative',
          minHeight: 148,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Badge qualidade da água */}
        <Chip
          label={`Água: ${waterInfo.label}`}
          size="small"
          sx={{
            position: 'absolute', top: 12, right: 12,
            fontSize: '0.68rem', fontWeight: 700, height: 22,
            bgcolor: waterInfo.bg, color: waterInfo.color,
            border: `1px solid ${waterInfo.color}44`,
          }}
        />

        {/* Ícone clima + temperatura */}
        <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 0.75 }}>
          <Typography sx={{ fontSize: '2.2rem', lineHeight: 1 }}>
            {weather.icon}
          </Typography>
          {beach.temperature != null && (
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.9rem', lineHeight: 1 }}>
              {Math.round(beach.temperature)}°C
            </Typography>
          )}
        </Stack>

        {/* Nome da praia */}
        <Tooltip title={beach.name} placement="top" enterDelay={500}>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#fff', fontWeight: 700, lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}
          >
            {beach.name}
          </Typography>
        </Tooltip>

        {/* Localização */}
        <Stack direction="row" alignItems="center" spacing={0.3} sx={{ mt: 0.4 }}>
          <LocationOnIcon sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
            {beach.city}{beach.state ? `, ${beach.state}` : ''}
          </Typography>
        </Stack>

        {/* Condição + sensação */}
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.25, fontSize: '0.72rem' }}>
          {weather.label}
          {beach.feelsLike != null && ` · Sensação ${Math.round(beach.feelsLike)}°C`}
        </Typography>
      </Box>

      {/* ── Stats ── */}
      <CardContent sx={{ flex: 1, px: 2.5, py: 1.5, '&:last-child': { pb: 2 } }}>
        <Stack divider={<Divider flexItem sx={{ borderColor: 'rgba(0,0,0,0.06)' }} />}>

          <StatRow
            icon={<OpacityIcon sx={{ fontSize: '0.95rem' }} />}
            label="Umidade"
            value={beach.humidity != null ? `${beach.humidity}%` : null}
          />

          <StatRow
            icon={<AirIcon sx={{ fontSize: '0.95rem' }} />}
            label="Vento"
            value={beach.windSpeed != null ? `${Math.round(beach.windSpeed)} km/h` : null}
          />

          <StatRow
            icon={<WbSunnyIcon sx={{ fontSize: '0.95rem' }} />}
            label="UV"
            chip={
              <Chip
                label={`${uvInfo.label}${beach.uvIndex != null ? ` (${beach.uvIndex.toFixed(1)})` : ''}`}
                size="small"
                sx={{ fontSize: '0.68rem', fontWeight: 700, height: 22, bgcolor: uvInfo.bg, color: uvInfo.color }}
              />
            }
          />

          <StatRow
            icon={<WaterDropIcon sx={{ fontSize: '0.95rem' }} />}
            label="Qualidade ar"
            chip={
              <Chip
                label={`${aqiInfo.label}${beach.aqi != null ? ` (${beach.aqi})` : ''}`}
                size="small"
                sx={{ fontSize: '0.68rem', fontWeight: 700, height: 22, bgcolor: aqiInfo.bg, color: aqiInfo.color }}
              />
            }
          />

          {beach.pm25 != null && (
            <StatRow
              icon={<GrainIcon sx={{ fontSize: '0.95rem' }} />}
              label="PM 2.5"
              value={`${beach.pm25.toFixed(1)} µg/m³`}
            />
          )}

        </Stack>

        {/* Botão Google Maps */}
        <Button
          component="a"
          href={`https://www.google.com/maps/dir/?api=1&destination=${beach.lat},${beach.lon}&travelmode=driving`}
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
          }}
        >
          Ir à praia
        </Button>
      </CardContent>
    </Card>
  );
}
