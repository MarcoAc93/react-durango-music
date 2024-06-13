import { useState } from 'react';
import { Button, styled, TextField, CircularProgress } from '@mui/material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { AUTH_USER, AUTHORIZATION } from '../../queries';

const Root = styled('div')(({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '0px 16px',
  maxWidth: 768
}));

const ContentContainer = styled('div')(({
  textAlign: 'center'
}));
  
const FormContainer = styled('div')(({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '75%'
}));

const Login = () => {
  const [authUser] = useLazyQuery(AUTH_USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = () => {
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
        console.log(error)
      },
    })
  };

  if (loading) return <CircularProgress />;

  return (
    <Root>
      <ContentContainer>
        <h1>Durango Music</h1>
        <h2>Iniciar sesion</h2>
      </ContentContainer>
      <FormContainer>
        <TextField variant='outlined' size='small' placeholder='Email' fullWidth onChange={handleEmail} value={email} />
        <TextField variant='outlined' size='small' placeholder='Contraseña' fullWidth onChange={handlePassword} value={password} type='password' />
        <Button variant='contained' sx={{ ":last-child": { mt: 1 }}} onClick={handleSubmit}>Ingresar</Button>
      </FormContainer>
    </Root>
  );
};

export default Login;
