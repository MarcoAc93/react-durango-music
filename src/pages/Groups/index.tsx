import React from 'react'
import { Title } from '../../components'
import { Button, Card, CardActions, CardContent, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ReactComponent as GuitarIcon } from '../../assets/guitar-icon.svg';
import { ReactComponent as MicrophoneIcon } from '../../assets/microphone-icon.svg';
import { ReactComponent as KeyboardIcon } from '../../assets/keyboard-icon.svg';
import { ReactComponent as ViolinIcon } from '../../assets/violin-icon.svg';
import { ReactComponent as DrumsIcon } from '../../assets/drums-icon.svg';

const Groups = () => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate('/dashboard');
  const handleNavigation = (page: string) => navigate(`/dashboard/grupos/${page}`);

  return (
    <Grid container gap={5}>
      <Grid container>
        <Grid item>
          <ChevronLeftIcon fontSize='large' onClick={handleGoBack} />
        </Grid>
        <Grid item>
          <Title variant='h2' noWrap>Grupos</Title>
        </Grid>
      </Grid>

      <Grid container columns={12} gap={2}>
        <Grid item xs={12} sm={6} md={2}>
          <Card onClick={() => handleNavigation('guitarra')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <GuitarIcon width={70} height={70} />
            </CardContent>
            <CardActions sx={(theme) => ({ backgroundColor: theme.palette.primary.main })}>
              <Button variant='text' size="small" fullWidth sx={() => ({ color: 'white' })}>Guitarra</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card onClick={() => handleNavigation('canto')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <MicrophoneIcon width={70} height={70} />
            </CardContent>
            <CardActions sx={(theme) => ({ backgroundColor: theme.palette.primary.main })}>
              <Button variant='text' size="small" fullWidth sx={{ color: 'white' }}>Canto</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card onClick={() => handleNavigation('teclado')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <KeyboardIcon width={70} height={70} />
            </CardContent>
            <CardActions sx={(theme) => ({ backgroundColor: theme.palette.primary.main })}>
              <Button variant='text' size="small" fullWidth sx={{ color: 'white' }}>Teclado</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card onClick={() => handleNavigation('violin')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ViolinIcon width={70} height={70} />
            </CardContent>
            <CardActions sx={(theme) => ({ backgroundColor: theme.palette.primary.main })}>
              <Button variant='text' size="small" fullWidth sx={{ color: 'white' }}>Violin</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card onClick={() => handleNavigation('bateria')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <DrumsIcon width={70} height={70} />
            </CardContent>
            <CardActions sx={(theme) => ({ backgroundColor: theme.palette.primary.main })}>
              <Button variant='text' size="small" fullWidth sx={{ color: 'white' }}>Bateria</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Groups