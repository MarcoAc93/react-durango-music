import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_TOTAL_STUDETS_PER_COURSE } from '../../queries'
import { DrawerFilter, Error, PageLoader } from '../../components';
import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Tune } from '@mui/icons-material';

import { getPeriodsWithYear } from '../../utils';
import { Filters } from '../Students';
import { daysToSpanish } from '../NewStudent/constants';

const FreeSpaces = () => {
  const authorization = localStorage.getItem('token');
  const [period, setPeriod] = useState<string>();
  const [periods, setPeriods] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({ profesor: '', class: '', time: '', days: [] });
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { data, loading, error } = useQuery(GET_TOTAL_STUDETS_PER_COURSE, {
    context: { headers: { authorization } },
    variables: { input: { period } } // variable para seleccionar el periodo
  });
  const [freeSpaces, setFreeSpaces] = useState(data?.getFreeSpaces || []);

  const handleFilters = (type: string, value: string) => setFilters(currValue => ({ ...currValue, [type]: value }));
  const toggleDrawer = () => setOpenDrawer(currState => !currState);

  const handleDayClick = (selectedDay: string, values: string[]) => {
    const group1 = ['monday', 'tuesday', 'wednesday'];
    const group2 = ['thursday', 'friday'];
    const group3 = ['saturday'];

    const determineGroup = (day: string) => {
      if (group1.includes(day)) return group1;
      if (group2.includes(day)) return group2;
      if (group3.includes(day)) return group3;
      return [];
    };
    const currentGroup = determineGroup(selectedDay);
    let newDays = values.filter(day => currentGroup.includes(day));
    const allInGroupSelected = currentGroup.every(day => newDays.includes(day));
    if (allInGroupSelected) {
      newDays = newDays.filter(day => !currentGroup.includes(day));
    } else {
      newDays = [...newDays.filter(day => !currentGroup.includes(day)), ...currentGroup];
    }
    setFilters(currValue => ({ ...currValue, days: newDays }));
  };

  useEffect(() => {
    const periods = getPeriodsWithYear();
    setPeriods(periods);
  }, []);

  useEffect(() => {
    if (data?.getFreeSpaces?.length > 0) {
      const freeSpaces = data?.getFreeSpaces.filter((space: { course: any }) => 
        (!filters.profesor || space.course.profesor === filters.profesor) &&
        (!filters.class || space.course.name === filters.class) &&
        (!filters.time || space.course.time === filters.time) &&
        // @ts-ignore
        (filters.days.length === 0 || space.course.days.some(day => filters.days.map(dayInEnglish => daysToSpanish[dayInEnglish]).includes(day)))
      );
      setFreeSpaces(freeSpaces);
    }
  }, [filters.class, filters.profesor, filters.time, data?.getFreeSpaces?.length, data?.getFreeSpaces, filters.days]);

  if (loading) return <PageLoader />
  if (error) return <Error title='Ups... error en el servidor' description={error.message} />
  const freeSpacesData = filters.class || filters.profesor || filters.time || filters.days.length > 0 ? freeSpaces : data?.getFreeSpaces;

  return (
    <Grid container gap={3}>
      <Grid item xs={12} md={3} gap={3}>
        <FormControl fullWidth>
          <InputLabel id='input-label-class'>Periodo</InputLabel>
          <Select
            label='Periodo'
            labelId='input-label-class'
            id='select-label-class'
            name='class'
            onChange={(event) => setPeriod(event.target.value as string)}
            value={period}
          >
            {periods.map(element => (
              <MenuItem value={element} key={element}>
                {element}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item sm={1} onClick={toggleDrawer} alignContent='center'>
        <Tune color='primary' />
      </Grid>

      <Grid container gap={3}>
        {freeSpacesData?.map((el: any) => (
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {el.course.name} - {el.course.profesor}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {el.course.days.join(' ,')}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {el.course.time}
              </Typography>
              <Typography variant="body2">
                Espacios libres {5 - el.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
      <DrawerFilter
        filters={filters}
        handleFilters={handleFilters}
        handleDayClick={handleDayClick}
        openDrawer={openDrawer}
        clearFilters={() => setFilters({ class: '', days: [], profesor: '', time: '' })}
        toggleDrawer={toggleDrawer}
      />
    </Grid>
  )
}

export default FreeSpaces