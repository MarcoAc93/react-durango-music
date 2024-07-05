import { useState } from 'react';
import { Button, TextField, CircularProgress, Grid, Typography, FormControl, AlertColor } from '@mui/material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { Toast } from '../../components';
import { AUTH_USER, AUTHORIZATION } from '../../queries';

const Login = () => {
  const [authUser] = useLazyQuery(AUTH_USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastState, setToastState] = useState({ open: false, message: '', type: '' as AlertColor | undefined })
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { loading } = useQuery(AUTHORIZATION, {
    variables: { token: token ?? '' },
    onCompleted(data) {
      if (data.authorization?.id) navigate('/dashboard');
    },
  });

  const handleEmail = (event: any) => setEmail(event.target.value);
  const handlePassword = (event: any) => setPassword(event.target.value);
  const onCloseToast = () => setToastState({ open: false, message: '', type: undefined });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    authUser({
      variables: {
        input: { email, password }
      },
      onCompleted: (data) => {
        const { authUser } = data;
        localStorage.setItem('token', authUser.token);
        navigate('/dashboard');
      },
      onError(error) {
        setToastState({ open: true, message: error.message, type: 'error' });
      },
    })
  };

  if (loading) return <CircularProgress />;

  return (
    <form>
      <Grid container columns={12} justifyContent="center" gap={3}>
        <Grid item xs={12} textAlign="center">
          <Typography variant='h3'>Escuela Durango Music</Typography>
          <Typography variant='h5'>Iniciar sesion</Typography>
        </Grid>
        <Grid container columns={{ xs: 12, sm: 6 }} justifyContent="center" paddingInline={2}>
          <Grid item gap={2}>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <TextField variant='outlined' size='small' placeholder='Email' onChange={handleEmail} value={email} />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <TextField variant='outlined' size='small' placeholder='Contraseña' onChange={handlePassword} value={password} type='password' />
            </FormControl>
            <FormControl fullWidth>
              <Button variant='contained' onClick={handleSubmit} type="submit">Ingresar</Button>
            </FormControl>
          </Grid>
        </Grid>
        <Toast open={toastState.open} message={toastState.message} type={toastState.type} onClose={onCloseToast} />
      </Grid>
    </form>
  );
};

export default Login;
