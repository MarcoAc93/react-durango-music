import { useState } from 'react';
import { TextField, Typography, Divider, Select, MenuItem, Button, FormControl, ButtonGroup, InputLabel, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Title } from '../../components';
import { ContainerPage, InputWrapperColumn, InputWrapperRow, ButtonGroupContainer, ButtonContainer, HeaderWrapper, InputWrapper } from './styles';

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
];

const TIMES = [
  '5pm - 6pm',
  '6pm - 7pm',
  '7pm - 8pm',
  '8pm - 9pm',
]

const DAYS = [
  { value: 'monday', display: 'L' },
  { value: 'tuesday', display: 'M' },
  { value: 'wednesday', display: 'M' },
  { value: 'thursday', display: 'J' },
  { value: 'friday', display: 'V' },
  { value: 'saturday', display: 'S' },
]

type Student = {
  name: string;
  lastName: string;
  email: string;
  cellphone: string;
  age: string;
}

enum Time {
  FIVE_TO_SIX = '5pm - 6pm',
  SIX_TO_SEVEN = '6pm - 7pm',
  SEVEN_TO_EIGHT = '7pm - 8pm',
  EIGHT_TO_NINE = '8pm - 9pm'
}

type DaysOfWeekInput = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

type Course = {
  name: string;
  profesor: string;
  time: Time
  days: DaysOfWeekInput
}

type Tutor = {
  name: string;
  contactNumber: string;
}

const NewStudent = () => {
  const navigate = useNavigate();

  const [course, setCourse] = useState('');
  const [profesor, setProfesor] = useState('');
  const [time, setTime] = useState('');
  const [studentInfo, setStudentInfo] = useState<Student>({ name: '', lastName: '', email: '', cellphone: '', age: '' });
  const [tutorInfo, setTutorInfo] = useState<Tutor>({ name: '', contactNumber: '' });
  const [days, setDays] = useState<string[]>([]);

  const handleCourse = (event: SelectChangeEvent<string>) => setCourse(event.target.value);
  const handleProfesor = (event: SelectChangeEvent<string>) => setProfesor(event.target.value);
  const handleTime = (event: SelectChangeEvent<string>) => setTime(event.target.value);
  const handleGoBack = () => navigate('/dashboard');

  const handleStudentInput = (event: React.ChangeEvent<HTMLInputElement>) => setStudentInfo(prevState => ({
    ...prevState,
    [event.target.name]: event.target.value
  }));

  const handleTutorInput = (event: React.ChangeEvent<HTMLInputElement>) => setTutorInfo(prevState => ({
    ...prevState,
    [event.target.name]: event.target.value
  }));

  const handleDays = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter(item => item !== day));
      return;
    }
    setDays([...days, day]);
  };

  const handleSubmit = () => {
    console.log({ studentInfo, tutorInfo });
  }

  return (
    <ContainerPage>
      <HeaderWrapper>
        <ChevronLeftIcon fontSize='large' onClick={handleGoBack} />
        <Title variant='h2' noWrap>Agregar Nuevo Alumno</Title>
      </HeaderWrapper>

      <div>
        <Typography variant='h5'>Informacion del alumno</Typography>
        <InputWrapperColumn>
          <InputWrapper>
            <Typography variant='body1'>Nombre/s</Typography>
            <TextField
              label='Nombre del alumno'
              fullWidth
              name='name'
              onChange={handleStudentInput}
              value={studentInfo.name}
            />
          </InputWrapper>

          <InputWrapper>
            <Typography variant='body1'>Apellidos</Typography>
            <TextField
              label='Apellidos del alumno'
              fullWidth
              name='lastName'
              onChange={handleStudentInput}
              value={studentInfo.lastName}
            />
          </InputWrapper>

          <InputWrapper>
            <Typography variant='body1'>Email</Typography>
            <TextField
              label='Email del alumno'
              fullWidth
              name='email'
              onChange={handleStudentInput}
              value={studentInfo.email}
            />
          </InputWrapper>
          
          <InputWrapper>
            <Typography variant='body1'>Telefono</Typography>
            <TextField
              label='Telefono de contacto'
              fullWidth
              name='cellphone'
              onChange={handleStudentInput}
              value={studentInfo.cellphone}
            />
          </InputWrapper>
          
          <InputWrapper>
            <Typography variant='body1'>Edad</Typography>
            <TextField label='Edad del alumno' fullWidth />
          </InputWrapper>
        </InputWrapperColumn>
      </div>

      <Divider sx={{ margin: '16px 0px' }} />

      <div>
        <Typography variant='h5' sx={{ marginBottom: 1}}>Curso</Typography>
        <InputWrapperRow>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="course">Curso</InputLabel>
            <Select
              labelId="course"
              id="course-select-helper"
              label='Curso'
              value={course}
              onChange={handleCourse}
            >
              {COURSES.map(element => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="profesor">Profesor</InputLabel>
            <Select
              labelId="profesor"
              id="profesor-select-helper"
              label='Profesor'
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

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="time">Horario</InputLabel>
            <Select
              labelId="time"
              id="time-select-helper"
              label='Horario'
              value={time}
              onChange={handleTime}
            >
              {TIMES.map(element => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant='contained' size='large'>
            <AddBoxRoundedIcon fontSize='large' />
          </Button>
        </InputWrapperRow>

        <ButtonGroupContainer>
          <ButtonGroup size='large'>
            {DAYS.map(element => (
              <Button
                key={element.value}
                onClick={() => handleDays(element.value)}
                variant={days.find(item => item === element.value) ? 'contained' : 'outlined'}
              >
                {element.display}
              </Button>
            ))}
          </ButtonGroup>
        </ButtonGroupContainer>
      </div>

      <Divider sx={{ margin: '16px 0px' }} />

      <div>
        <Typography variant='h5'>Informacion del tutor</Typography>
        <InputWrapperColumn>
          <InputWrapper>
            <Typography variant='body1'>Nombre completo</Typography>
            <TextField
              label='Nombre del padre/tutor'
              fullWidth
              name='name'
              onChange={handleTutorInput}
              value={tutorInfo.name}
            />
          </InputWrapper>
          
          <InputWrapper>
            <Typography variant='body1'>Contacto</Typography>
            <TextField
              label='Telefono del padre/tutor'
              fullWidth
              name='contactNumber'
              onChange={handleTutorInput}
              value={tutorInfo.contactNumber}
            />
          </InputWrapper>
        </InputWrapperColumn>
      </div>
      
      <Divider sx={{ margin: '16px 0px' }} />

      <ButtonContainer>
        <Button variant='contained' color='error'>Cancelar</Button>
        <Button variant='contained' color='primary' onClick={handleSubmit}>Guardar</Button>
      </ButtonContainer>

    </ContainerPage>
  )
};

export default NewStudent;
