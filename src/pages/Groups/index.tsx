import { Accordion, AccordionDetails, AccordionSummary, Button, ButtonGroup, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Theme, Typography, useMediaQuery, Checkbox } from '@mui/material';
import { useQuery } from '@apollo/client';
import { Title } from '../../components';
import { DAYS, TIMES } from '../NewStudent/constants';
import { GET_STUDENTS_BY_CLASSES } from '../../queries';

const Groups = () => {
  const isMobile = useMediaQuery<Theme>(({ breakpoints }) => breakpoints.down('md'))
  const authorization = localStorage.getItem('token');
  const { data, loading, error } = useQuery(GET_STUDENTS_BY_CLASSES, {
    variables: { className: 'Guitarra' },
    context: { headers: { authorization } }
  });

  return (
    <Grid container gap={4}>
      <Grid item>
        <Title>Cursos</Title>
      </Grid>
      <Grid container columns={12} gap={2}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="time-input-label">Horario</InputLabel>
            <Select
              labelId="time-input-label"
              id="time-select"
              value=""
              label="Horario"
              onChange={() => {}}
            >
              {TIMES.map(time => (
                <MenuItem value={time} key={time}>{time}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <ButtonGroup size='large' fullWidth sx={{ minHeight: '100%' }}>
            {DAYS.map(element => (
              <Button key={element.value} variant={'contained'}>
                {element.display}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
      </Grid>

      <Grid container columns={12} gap={2}>
        <Grid item sm={4}>
          <Card>
            {isMobile && (
              <CardContent>
                <Typography>Horario: 5pm - 6pm</Typography>
                <Accordion>
                  <AccordionSummary>
                    Alumno 1
                  </AccordionSummary>
                  <AccordionDetails>
                  <ButtonGroup size='small'>
                    {DAYS.map(element => (
                      <Button key={element.value} variant={'outlined'}>
                        {element.display}
                      </Button>
                    ))}
                  </ButtonGroup>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Alumno 2
                  </AccordionSummary>
                  <AccordionDetails>
                  <ButtonGroup size='small'>
                    {DAYS.map(element => (
                      <Button key={element.value} variant={'outlined'}>
                        {element.display}
                      </Button>
                    ))}
                  </ButtonGroup>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Alumno 3
                  </AccordionSummary>
                  <AccordionDetails>
                  <ButtonGroup size='small'>
                    {DAYS.map(element => (
                      <Button key={element.value} variant={'outlined'}>
                        {element.display}
                      </Button>
                    ))}
                  </ButtonGroup>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Alumno 4
                  </AccordionSummary>
                  <AccordionDetails>
                  <ButtonGroup size='small'>
                    {DAYS.map(element => (
                      <Button key={element.value} variant={'outlined'}>
                        {element.display}
                      </Button>
                    ))}
                  </ButtonGroup>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary>
                    Alumno 5
                  </AccordionSummary>
                  <AccordionDetails>
                  <ButtonGroup size='small'>
                    {DAYS.map(element => (
                      <Button key={element.value} variant={'outlined'}>
                        {element.display}
                      </Button>
                    ))}
                  </ButtonGroup>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            )}
            {!isMobile && (
              <CardContent>
                <Grid container columns={12} alignItems="center">
                  <Grid item sm={6}>
                    <Typography>Horario: 5pm - 6pm</Typography>
                  </Grid>
                  <Grid container columns={12} sm={6}>
                    <Grid item sm={2} textAlign="center">L</Grid>
                    <Grid item sm={2} textAlign="center">M</Grid>
                    <Grid item sm={2} textAlign="center">M</Grid>
                    <Grid item sm={2} textAlign="center">J</Grid>
                    <Grid item sm={2} textAlign="center">V</Grid>
                    <Grid item sm={2} textAlign="center">S</Grid>
                  </Grid>
                </Grid>
                <Grid container columns={12} alignItems="center" marginTop={2}>
                  <Grid item sm={6}>
                    <Typography>Alumno 1</Typography>
                  </Grid>
                  <Grid container columns={12} sm={6}>
                    <Grid item sm={2} textAlign="center">
                      <Checkbox sx={{ "&.MuiCheckbox-root": { padding: 0 } }} />
                    </Grid>
                    <Grid item sm={2} textAlign="center">
                      <Checkbox sx={{ "&.MuiCheckbox-root": { padding: 0 } }} />
                    </Grid>
                    <Grid item sm={2} textAlign="center">
                      <Checkbox sx={{ "&.MuiCheckbox-root": { padding: 0 } }} />
                    </Grid>
                    <Grid item sm={2} textAlign="center">
                      <Checkbox sx={{ "&.MuiCheckbox-root": { padding: 0 } }} />
                    </Grid>
                    <Grid item sm={2} textAlign="center">
                      <Checkbox sx={{ "&.MuiCheckbox-root": { padding: 0 } }} />
                    </Grid>
                    <Grid item sm={2} textAlign="center">
                      <Checkbox sx={{ "&.MuiCheckbox-root": { padding: 0 } }} />
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Groups;
