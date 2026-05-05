import { useState, useEffect } from 'react';
import {
  Dialog, Box, Typography, Tab, Tabs, TextField, Button,
  Checkbox, FormControlLabel, Link, Divider, CircularProgress,
  InputAdornment, IconButton, Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { login, cadastro, saveUser } from '../services/authService';

export default function AuthDialog({ open, defaultTab = 0, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [showLoginSenha, setShowLoginSenha] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // Cadastro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [cadastroErrors, setCadastroErrors] = useState({});

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (!open) {
      setError('');
      setSuccess('');
      setLoginErrors({});
      setCadastroErrors({});
    }
  }, [open]);

  const changeTab = (newTab) => {
    setTab(newTab);
    setError('');
    setSuccess('');
  };

  const validateLogin = () => {
    const errs = {};
    if (!loginEmail) errs.loginEmail = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.loginEmail = 'Email inválido';
    if (!loginSenha) errs.loginSenha = 'Senha é obrigatória';
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCadastro = () => {
    const errs = {};
    if (!nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!email) errs.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email inválido';
    if (!senha) errs.senha = 'Senha é obrigatória';
    else if (senha.length < 6) errs.senha = 'Mínimo de 6 caracteres';
    if (!confirmSenha) errs.confirmSenha = 'Confirme a senha';
    else if (senha !== confirmSenha) errs.confirmSenha = 'Senhas não coincidem';
    if (!aceitoTermos) errs.aceitoTermos = 'Você deve aceitar os termos';
    setCadastroErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    setError('');
    try {
      const data = await login(loginEmail, loginSenha);
      if (data.success) {
        saveUser(data);
        setSuccess('Login realizado com sucesso!');
        setTimeout(() => {
          onLoginSuccess?.();
          onClose?.();
        }, 800);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async () => {
    if (!validateCadastro()) return;
    setLoading(true);
    setError('');
    try {
      const data = await cadastro(nome, email, senha);
      if (data.success) {
        setSuccess('Conta criada! Faça login para continuar.');
        setTimeout(() => {
          setLoginEmail(email);
          setSuccess('');
          setNome('');
          setEmail('');
          setSenha('');
          setConfirmSenha('');
          setAceitoTermos(false);
          changeTab(0);
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const buttonSx = {
    py: 1.5,
    fontSize: '1rem',
    background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
    '&:hover': { background: 'linear-gradient(135deg, #042c53 0%, #185FA5 100%)' },
    '&.Mui-disabled': { opacity: 0.7 },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden', maxWidth: 400, m: 2 } }}
    >
      {/* Dark header */}
      <Box
        sx={{
          bgcolor: '#042c53',
          pt: 4,
          pb: 6,
          px: 3,
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: 40,
            bgcolor: '#fff',
            borderRadius: '50% 50% 0 0 / 40px 40px 0 0',
          },
        }}
      >
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', top: 10, right: 10, color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box
          sx={{
            width: 84,
            height: 84,
            bgcolor: '#042c53',
            borderRadius: 3,
            border: '1.5px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5,
          }}
        >
          <Box
            component="img"
            src="/logos/logo_branca.png"
            alt="PRAIÔ"
            sx={{ width: '78%', objectFit: 'contain' }}
          />
        </Box>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>
          {tab === 0 ? 'Entre na sua conta' : 'Crie sua conta gratuita'}
        </Typography>
      </Box>

      {/* White body */}
      <Box sx={{ bgcolor: '#fff', position: 'relative', zIndex: 1 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => changeTab(v)}
          variant="fullWidth"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTabs-indicator': { height: 3, bgcolor: '#185FA5', borderRadius: '3px 3px 0 0' },
            '& .MuiTab-root': { color: 'text.secondary', fontWeight: 600, fontSize: '0.95rem' },
            '& .Mui-selected': { color: '#185FA5 !important' },
          }}
        >
          <Tab label="Entrar" />
          <Tab label="Cadastrar" />
        </Tabs>

        <Box sx={{ px: 3, pt: 2.5, pb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {tab === 0 ? (
            <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <TextField
                fullWidth
                placeholder="E-mail"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                error={!!loginErrors.loginEmail}
                helperText={loginErrors.loginEmail}
                size="medium"
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                placeholder="Senha"
                type={showLoginSenha ? 'text' : 'password'}
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                error={!!loginErrors.loginSenha}
                helperText={loginErrors.loginSenha}
                size="medium"
                sx={{ mb: 0.5 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowLoginSenha(!showLoginSenha)} edge="end" size="small">
                          {showLoginSenha ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                  label={<Typography variant="caption" color="text.secondary">Lembrar de mim</Typography>}
                />
                <Link href="#" underline="hover" variant="caption" sx={{ color: '#185FA5', fontWeight: 500 }}>
                  Esqueci a senha
                </Link>
              </Box>

              <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={buttonSx}>
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Entrar'}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">ou continue com</Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ color: 'text.primary', borderColor: 'divider', py: 1.25, gap: 1, fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <Box component="span" sx={{ fontWeight: 800, color: '#4285F4', fontSize: '1rem' }}>G</Box> Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ color: '#1877F2', borderColor: '#1877F2', py: 1.25, gap: 1, fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <Box component="span" sx={{ fontWeight: 900, fontSize: '1.15rem' }}>f</Box> Facebook
                </Button>
              </Box>

              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                Não tem conta?{' '}
                <Link onClick={() => changeTab(1)} sx={{ cursor: 'pointer', color: '#185FA5', fontWeight: 600 }} underline="hover">
                  Cadastre-se
                </Link>
              </Typography>
            </Box>
          ) : (
            <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleCadastro(); }}>
              <TextField
                fullWidth
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                error={!!cadastroErrors.nome}
                helperText={cadastroErrors.nome}
                size="medium"
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                placeholder="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!cadastroErrors.email}
                helperText={cadastroErrors.email}
                size="medium"
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                placeholder="Senha"
                type={showSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                error={!!cadastroErrors.senha}
                helperText={cadastroErrors.senha || 'Mínimo de 6 caracteres'}
                size="medium"
                sx={{ mb: 1.5 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowSenha(!showSenha)} edge="end" size="small">
                          {showSenha ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                placeholder="Confirmar senha"
                type={showConfirmSenha ? 'text' : 'password'}
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                error={!!cadastroErrors.confirmSenha}
                helperText={cadastroErrors.confirmSenha}
                size="medium"
                sx={{ mb: 1 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmSenha(!showConfirmSenha)} edge="end" size="small">
                          {showConfirmSenha ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={aceitoTermos}
                    onChange={(e) => setAceitoTermos(e.target.checked)}
                    sx={{ color: cadastroErrors.aceitoTermos ? 'error.main' : undefined }}
                  />
                }
                label={
                  <Typography variant="caption" color="text.secondary">
                    Aceito os{' '}
                    <Link href="#" sx={{ color: '#185FA5' }}>Termos de Uso</Link>
                    {' '}e a{' '}
                    <Link href="#" sx={{ color: '#185FA5' }}>Política de Privacidade</Link>
                  </Typography>
                }
              />
              {cadastroErrors.aceitoTermos && (
                <Typography variant="caption" color="error" sx={{ display: 'block', ml: 4, mt: -0.5 }}>
                  {cadastroErrors.aceitoTermos}
                </Typography>
              )}

              <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={{ ...buttonSx, mt: 2 }}>
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Criar conta'}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">ou cadastre com</Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ color: 'text.primary', borderColor: 'divider', py: 1.25, gap: 1, fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <Box component="span" sx={{ fontWeight: 800, color: '#4285F4', fontSize: '1rem' }}>G</Box> Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ color: '#1877F2', borderColor: '#1877F2', py: 1.25, gap: 1, fontSize: '0.875rem', fontWeight: 600 }}
                >
                  <Box component="span" sx={{ fontWeight: 900, fontSize: '1.15rem' }}>f</Box> Facebook
                </Button>
              </Box>

              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                Já tem conta?{' '}
                <Link onClick={() => changeTab(0)} sx={{ cursor: 'pointer', color: '#185FA5', fontWeight: 600 }} underline="hover">
                  Entre aqui
                </Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
