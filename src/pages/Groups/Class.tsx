import { Accordion, AccordionDetails, AccordionSummary, Button, ButtonGroup, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Theme, Typography, useMediaQuery, Checkbox } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Title, PageLoader, Error } from '../../components';
import { DAYS, daysToSpanish, GROUP_DAYS, PROFESORS } from '../NewStudent/constants';

import { GET_STUDENTS_BY_CLASSES } from '../../queries';
import { capitalizeFirstLetter } from '../../utils';
import { useState } from 'react';

const Groups = () => {
  const isMobile = useMediaQuery<Theme>(({ breakpoints }) => breakpoints.down('md'))
  const authorization = localStorage.getItem('token');
  const navigate = useNavigate();
  const params = useParams();
  const className = capitalizeFirstLetter(params.className!);
  const [profesor, setProfesor] = useState('Eliut');
  const [selectedDays, setSelectedDays] = useState(GROUP_DAYS.group1);

  // @ts-ignore
  const days = selectedDays.map(day => daysToSpanish[day])
  const { data, loading, error } = useQuery(GET_STUDENTS_BY_CLASSES, {
    variables: { className, profesor, days },
    fetchPolicy: 'network-only',
    context: { headers: { authorization } }
  });

  const handleGoBack = () => navigate('/dashboard/grupos');

  const handleDayClick = (day: string) => {
    let groupKey = 'group1';
    if (GROUP_DAYS.group2.includes(day)) groupKey = 'group2';
    else if (GROUP_DAYS.group3.includes(day)) groupKey = 'group3';

    const otherGroupsKeys = Object.keys(GROUP_DAYS).filter(k => k !== groupKey);
      let filteredDays = selectedDays;
      otherGroupsKeys.forEach(k => {
        // @ts-ignore
        filteredDays = filteredDays.filter(d => !GROUP_DAYS[k].includes(d));
      });
      // @ts-ignore
      setSelectedDays([...filteredDays, ...GROUP_DAYS[groupKey]]);
  };

  if (loading || !data?.getStudentsByClass) <PageLoader />
  if (error) <Error description={error.message} />

  const classes = data?.getStudentsByClass?.classes || [];
  return (
    <Grid container gap={4}>
      <Grid container>
        <Grid item>
          <ChevronLeftIcon fontSize='large' onClick={handleGoBack} />
        </Grid>
        <Grid item>
          <Title variant='h2' noWrap>Grupos de {className}</Title>
        </Grid>
      </Grid>
      <Grid container columns={12} gap={2}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="teacher-input-label">Maestro</InputLabel>
            <Select
              labelId="teacher-input-label"
              id="teacher-select"
              value={profesor}
              label="Maestro"
              onChange={(event) => setProfesor(event.target.value)}
            >
              {PROFESORS.map(profesor => (
                <MenuItem value={profesor} key={profesor}>{profesor}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <ButtonGroup size='large' fullWidth sx={{ minHeight: '100%' }}>
            {DAYS.map(element => (
              <Button key={element.value} variant={selectedDays.includes(element.value) ? 'contained' : 'outlined'} onClick={() => handleDayClick(element.value)}>
                {element.display}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
      </Grid>

      <Grid container columns={12} gap={2}>
        {classes.map((element: { hour: string; students: any[]; }) => (
          <Grid item sm={4} key={element.hour as string}>
            <Card>
              {isMobile && (
                <CardContent>
                  <Typography>Horario: {element.hour}</Typography>
                  {element.students.map((student: { name: string; }, idx: number) => (
                    <Accordion key={student.name}>
                      <AccordionSummary>
                        {idx + 1} {student.name}
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
                  ))}
                </CardContent>
              )}
              {!isMobile && (
                <CardContent>
                  <Grid container columns={12} alignItems="center">
                    <Grid item sm={6}>
                      <Typography>Horario: {element.hour}</Typography>
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
                  {element.students.map((student: { name: string; }, idx) => (
                    <Grid container columns={12} alignItems="center" marginTop={2} key={student.name}>
                      <Grid item sm={6}>
                        <Typography>{idx + 1} {student.name}</Typography>
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
                  ))}
                </CardContent>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export default Groups;
