import { Box, Typography, Container, Stack, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#042c53', py: 3 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
            © {new Date().getFullYear()} PRAIÔ — Todos os direitos reservados
          </Typography>
          <Stack direction="row" spacing={2}>
            {['Termos de Uso', 'Privacidade', 'Contato'].map((item) => (
              <Link
                key={item}
                href="#"
                underline="hover"
                sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}
              >
                {item}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
