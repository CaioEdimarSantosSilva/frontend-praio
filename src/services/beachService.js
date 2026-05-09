const NOMINATIM   = 'https://nominatim.openstreetmap.org';
const OVERPASS    = 'https://overpass-api.de/api/interpreter';
const OPEN_METEO  = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Mapa de nomes de estado → sigla
const STATE_CODES = {
  Acre:'AC',Alagoas:'AL',Amapá:'AP',Amazonas:'AM',Bahia:'BA',Ceará:'CE',
  'Distrito Federal':'DF','Espírito Santo':'ES',Goiás:'GO',Maranhão:'MA',
  'Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG',Pará:'PA',
  Paraíba:'PB',Paraná:'PR',Pernambuco:'PE',Piauí:'PI','Rio de Janeiro':'RJ',
  'Rio Grande do Norte':'RN','Rio Grande do Sul':'RS',Rondônia:'RO',Roraima:'RR',
  'Santa Catarina':'SC','São Paulo':'SP',Sergipe:'SE',Tocantins:'TO',
};

// ── helpers de exibição ────────────────────────────────────────────────────

export function getWeatherInfo(code) {
  if (code == null) return { label: 'N/D', icon: '🌡️' };
  if (code === 0)  return { label: 'Céu limpo',           icon: '☀️' };
  if (code <= 2)   return { label: 'Parcialmente nublado', icon: '⛅' };
  if (code === 3)  return { label: 'Nublado',              icon: '☁️' };
  if (code <= 49)  return { label: 'Névoa',                icon: '🌫️' };
  if (code <= 59)  return { label: 'Garoa',                icon: '🌦️' };
  if (code <= 69)  return { label: 'Chuva',                icon: '🌧️' };
  if (code <= 79)  return { label: 'Neve',                 icon: '❄️' };
  if (code <= 84)  return { label: 'Pancadas',             icon: '🌦️' };
  if (code <= 99)  return { label: 'Tempestade',           icon: '⛈️' };
  return { label: 'N/D', icon: '🌡️' };
}

export function getAQIInfo(aqi) {
  if (aqi == null) return { label: 'N/D',       color: '#757575', bg: '#f5f5f5' };
  if (aqi <= 50)   return { label: 'Boa',        color: '#2e7d32', bg: '#e8f5e9' };
  if (aqi <= 100)  return { label: 'Moderada',   color: '#e65100', bg: '#fff3e0' };
  if (aqi <= 150)  return { label: 'Ruim',       color: '#c62828', bg: '#ffebee' };
  return             { label: 'Péssima',         color: '#6a1b9a', bg: '#f3e5f5' };
}

export function getUVInfo(uv) {
  if (uv == null) return { label: 'N/D',        color: '#757575', bg: '#f5f5f5' };
  if (uv <= 2)    return { label: 'Baixo',       color: '#2e7d32', bg: '#e8f5e9' };
  if (uv <= 5)    return { label: 'Moderado',    color: '#f57f17', bg: '#fffde7' };
  if (uv <= 7)    return { label: 'Alto',        color: '#e65100', bg: '#fff3e0' };
  if (uv <= 10)   return { label: 'Muito Alto',  color: '#c62828', bg: '#ffebee' };
  return            { label: 'Extremo',          color: '#6a1b9a', bg: '#f3e5f5' };
}

export function getWaterQualityInfo(precipitation, weatherCode) {
  if (precipitation == null) return { label: 'N/D',      color: '#757575', bg: '#f5f5f5' };
  if (precipitation > 5 || weatherCode >= 80)
    return { label: 'Imprópria', color: '#c62828', bg: '#ffebee' };
  if (precipitation > 1 || weatherCode >= 60)
    return { label: 'Atenção',   color: '#e65100', bg: '#fff3e0' };
  return   { label: 'Própria',   color: '#2e7d32', bg: '#e8f5e9' };
}

// ── API: Nominatim ─────────────────────────────────────────────────────────

async function getCityCoords(cityName) {
  const q = encodeURIComponent(cityName.trim() + ', Brasil');
  const url = `${NOMINATIM}/search?q=${q}&format=json&limit=5&countrycodes=br&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'pt-BR,pt;q=0.9', 'User-Agent': 'PraioApp/1.0' },
  });
  if (!res.ok) throw new Error('Erro na geocodificação');
  const data = await res.json();

  // Preferir resultado do tipo cidade/município
  const city = data.find(d =>
    ['city','town','village','municipality'].includes(d.addresstype) ||
    ['city','town','village','municipality'].includes(d.type)
  ) || data[0];

  if (!city) throw new Error('Cidade não encontrada. Tente "Praia Grande, SP"');
  return city;
}

// ── API: Overpass ──────────────────────────────────────────────────────────

/** Busca praias DENTRO da área administrativa da cidade (mais preciso) */
async function getBeachesInArea(osmType, osmId) {
  let areaId;
  if (osmType === 'relation') areaId = 3600000000 + parseInt(osmId);
  else if (osmType === 'way') areaId = 2400000000 + parseInt(osmId);
  else return []; // nodes não têm área

  const query = `[out:json][timeout:30];area(${areaId})->.a;(node["natural"="beach"](area.a);way["natural"="beach"](area.a););out center 20;`;
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.elements || [];
}

/** Fallback: raio pequeno (15 km) em volta das coordenadas */
async function getBeachesNearRadius(lat, lon) {
  const query = `[out:json][timeout:30];(node["natural"="beach"](around:15000,${lat},${lon});way["natural"="beach"](around:15000,${lat},${lon}););out center 20;`;
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error('Erro ao buscar praias');
  const data = await res.json();
  return data.elements || [];
}

// ── API: Open-Meteo ────────────────────────────────────────────────────────

async function fetchWeather(lat, lon) {
  const url = `${OPEN_METEO}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation` +
    `&timezone=America%2FSao_Paulo`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro clima');
  return res.json();
}

async function fetchAirQuality(lat, lon) {
  const url = `${AIR_QUALITY}?latitude=${lat}&longitude=${lon}` +
    `&current=pm2_5,pm10,uv_index,us_aqi&timezone=America%2FSao_Paulo`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

// ── Export principal ───────────────────────────────────────────────────────

export async function searchBeachesByCity(cityName) {
  // 1. Geocodificar
  const cityData = await getCityCoords(cityName);
  const cityLat  = parseFloat(cityData.lat);
  const cityLon  = parseFloat(cityData.lon);

  const addr        = cityData.address || {};
  const cityDisplay = addr.city || addr.town || addr.village || addr.municipality || cityName;
  const stateRaw    = addr.state_code?.toUpperCase() || addr['ISO3166-2-lvl4']?.split('-')[1] || '';
  const stateDisplay = stateRaw || STATE_CODES[addr.state] || addr.state || '';

  // 2. Praias dentro da cidade (área OSM) → fallback raio 15 km
  let elements = await getBeachesInArea(cityData.osm_type, cityData.osm_id);
  if (!elements.length) elements = await getBeachesNearRadius(cityLat, cityLon);
  if (!elements.length) throw new Error('Nenhuma praia encontrada nessa cidade.');

  // 3. Normalizar coordenadas
  const beaches = elements
    .map((el, i) => ({
      id:   el.id,
      name: el.tags?.name || el.tags?.['name:pt'] || null,
      lat:  el.type === 'node' ? el.lat : el.center?.lat,
      lon:  el.type === 'node' ? el.lon : el.center?.lon,
      city: cityDisplay,
      state: stateDisplay,
    }))
    .filter((b) => b.lat && b.lon && b.name) // descarta sem nome real
    .slice(0, 8);

  if (!beaches.length) throw new Error('Praias encontradas mas sem coordenadas válidas.');

  // 4. Enriquecer com clima + qualidade do ar (paralelo)
  return Promise.all(
    beaches.map(async (beach) => {
      try {
        const [weather, air] = await Promise.all([
          fetchWeather(beach.lat, beach.lon),
          fetchAirQuality(beach.lat, beach.lon),
        ]);
        const c = weather.current || {};
        const a = air?.current   || {};
        return {
          ...beach,
          temperature:   c.temperature_2m,
          feelsLike:     c.apparent_temperature,
          humidity:      c.relative_humidity_2m,
          windSpeed:     c.wind_speed_10m,
          weatherCode:   c.weather_code,
          precipitation: c.precipitation,
          uvIndex:       a.uv_index,
          aqi:           a.us_aqi,
          pm25:          a.pm2_5,
        };
      } catch {
        return { ...beach };
      }
    })
  );
}
