import React, { useState } from 'react';
import { TextField, Typography, Divider, Select, MenuItem, Button, FormControl, ButtonGroup } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Title } from '../../components';
import { ContainerPage, InputWrapperColumn, InputWrapperRow, ButtonGroupContainer, ButtonContainer, HeaderWrapper } from './styles';

const COURSES = [
  'Guitarra',
  'Canto',
  'Teclado',
  'Violin'
];

const PROFESORS = [
  'Eliut',
  'Alicia',
  'Jose',
  'Enrique',
  'Gustavo'
]

const NewStudent = () => {
  const [course, setCourse] = useState('');
  const [profesor, setProfesor] = useState('');

  const handleCourses = (value: any) => setCourse(value.target.value)
  const handleProfesor = (value: any) => setProfesor(value.target.value)

  return (
    <ContainerPage>
      <HeaderWrapper>
        <ChevronLeftIcon fontSize='large' />
        <Title variant='h2' noWrap>Agregar Nuevo Alumno</Title>
      </HeaderWrapper>

      <div>
        <Typography variant='h5'>Informacion del alumno</Typography>
        <InputWrapperColumn>
          <div>
            <Typography variant='body1'>Nombre/s</Typography>
            <TextField label='Nombre del alumno' size='small' fullWidth />
          </div>

          <div>
            <Typography variant='body1'>Apellidos</Typography>
            <TextField label='Apellidos del alumno' size='small' fullWidth />
          </div>

          <div>
            <Typography variant='body1'>Email</Typography>
            <TextField label='Email del alumno' size='small' fullWidth />
          </div>
          
          <div>
            <Typography variant='body1'>Telefono</Typography>
            <TextField label='Telefono de contacto' size='small' fullWidth />
          </div>
          
          <div>
            <Typography variant='body1'>Edad</Typography>
            <TextField label='Edad del alumno' size='small' fullWidth />
          </div>
        </InputWrapperColumn>
      </div>

      <Divider sx={{ margin: '16px 0px' }} />

      <div>
        <Typography variant='h5'>Curso</Typography>
        <InputWrapperRow>
          <FormControl fullWidth>
            <Select
              size='small'
              value={course}
              displayEmpty
              onChange={handleCourses}
            >
              {COURSES.map(element => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Select
              size='small'
              displayEmpty
              value={profesor}
              onChange={handleProfesor}
            >
              {PROFESORS.map(element => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant='contained'>
            <AddIcon />
          </Button>
        </InputWrapperRow>

        <ButtonGroupContainer>
          <ButtonGroup size='large'>
            <Button>L</Button>
            <Button>M</Button>
            <Button>M</Button>
            <Button>J</Button>
            <Button>V</Button>
            <Button>S</Button>
          </ButtonGroup>
        </ButtonGroupContainer>
      </div>

      <Divider sx={{ margin: '16px 0px' }} />

      <div>
        <Typography variant='h5'>Informacion del tutor</Typography>
        <InputWrapperColumn>
          <div>
            <Typography variant='body1'>Nombre completo</Typography>
            <TextField label='Nombre del padre/tutor' size='small' fullWidth />
          </div>
          
          <div>
            <Typography variant='body1'>Contacto</Typography>
            <TextField label='Telefono del padre/tutor' size='small' fullWidth />
          </div>
        </InputWrapperColumn>
      </div>
      
      <Divider sx={{ margin: '16px 0px' }} />

      <ButtonContainer>
        <Button variant='contained' color='error'>Cancelar</Button>
        <Button variant='contained' color='primary'>Guardar</Button>
      </ButtonContainer>

    </ContainerPage>
  )
};

export default NewStudent;
