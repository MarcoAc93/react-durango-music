import { Button, ButtonGroup, Drawer, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react'
import { COURSES, DAYS, PROFESORS, TIMES } from '../../pages/NewStudent/constants';

type Props = {
  openDrawer?: boolean
  filters: { profesor: string; class: string; time: string; days: string[] };
  toggleDrawer?: () => void;
  handleFilters: (name: string, value: string) => void;
  handleDayClick: (value: string, days: string[]) => void;
  clearFilters: () => void;
}

const DrawerFilter = ({ filters, handleDayClick, handleFilters, openDrawer, toggleDrawer, clearFilters }: Props) => {
  return (
    <Drawer open={openDrawer} anchor='right' onClose={toggleDrawer}>
      <Grid container columns={12} sx={{ width: 300, p: 1 }} gap={1}>
        <Grid item xs={12} gap={1}>
          <FormControl fullWidth>
            <InputLabel id='input-label-profesor'>Profesor</InputLabel>
            <Select
              label='profesor'
              labelId='input-label-profesor'
              id='select-label-profesor'
              name='profesor'
              onChange={(event) => handleFilters(event.target.name, event.target.value as string)}
              value={filters.profesor}
            >
              {PROFESORS.map(element => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} gap={1}>
          <FormControl fullWidth>
            <InputLabel id='input-label-class'>Curso</InputLabel>
            <Select
              label='class'
              labelId='input-label-class'
              id='select-label-class'
              name='class'
              onChange={(event) => handleFilters(event.target.name, event.target.value as string)}
              value={filters.class}
            >
              {COURSES.map(element => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} gap={1}>
          <FormControl fullWidth>
            <InputLabel id='input-label-time'>Horario</InputLabel>
            <Select
              label='time'
              labelId='input-label-time'
              id='select-label-time'
              name='time'
              onChange={(event) => handleFilters(event.target.name, event.target.value as string)}
              value={filters.time}
            >
              {TIMES.map(element => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup size='large' fullWidth sx={{ minHeight: '100%' }}>
            {DAYS.map(element => (
              <Button
                key={element.value}
                onClick={() => handleDayClick(element.value, filters.days)}
                variant={filters.days.includes(element.value) ? 'contained' : 'outlined'}
              >
                {element.display}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Button variant='text' color='secondary' fullWidth onClick={clearFilters}>Limpiar filtros</Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default DrawerFilter;
