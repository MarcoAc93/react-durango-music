import { useState } from 'react';
import { TextField, Typography, Divider, Select, MenuItem, Button, FormControl, ButtonGroup, InputLabel, SelectChangeEvent, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Title } from '../../components';
import { ChipContainer, ContainerPage, InputWrapperColumn, InputWrapperRow, ButtonContainer, HeaderWrapper, InputWrapper } from './styles';

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

const daysToSpanish = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miercoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sabado'
}

const OBJECT_DAYS = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false
};

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

type Course = {
  name: string;
  profesor: string;
  time: Time
  days: string[];
}

type Tutor = {
  name: string;
  contactNumber: string;
}

const NewStudent = () => {
  const navigate = useNavigate();

  const [course, setCourse] = useState('');
  const [profesor, setProfesor] = useState('');
  const [time, setTime] = useState<Time>(Time.FIVE_TO_SIX);
  const [studentInfo, setStudentInfo] = useState<Student>({ name: '', lastName: '', email: '', cellphone: '', age: '' });
  const [tutorInfo, setTutorInfo] = useState<Tutor>({ name: '', contactNumber: '' });
  const [days, setDays] = useState<string[]>([]);
  const [courseInfo, setCourseInfo] = useState<Course[]>([]);

  const handleCourse = (event: SelectChangeEvent<string>) => setCourse(event.target.value);
  const handleProfesor = (event: SelectChangeEvent<string>) => setProfesor(event.target.value);
  const handleTime = (event: SelectChangeEvent<Time>) => setTime(event.target.value as Time);
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

  const generateDaysObject = (daysArray: string[]) => {
    // @ts-ignore
    daysArray.forEach(day => { if (OBJECT_DAYS[day]) { OBJECT_DAYS[day] = true; } });
    return days;
  }

  const generateCourseString = (courseInfo: Course) => {
    // @ts-ignore
    return `Curso de ${courseInfo.name} con ${courseInfo.profesor} a las ${courseInfo.time} los dias ${courseInfo.days.map(el => daysToSpanish[el]).join(', ')}`
  };

  const handleAddCourse = () => {
    const daysObject = generateDaysObject(days);
    const courseObject: Course = { name: course, profesor, time, days: daysObject };
    setCourseInfo(prevState => [...prevState, courseObject]);
    setCourse('');
    setProfesor('');
    setTime('' as Time);
    setDays([]);
  };

  const removeCourse = (index: number) => {
    if (index > -1) {
      setCourseInfo(currentState => {
        const newState = currentState.filter((_el, idx) => idx !== index);
        return newState;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ studentInfo, tutorInfo, courseInfo });
  }

  return (
    <ContainerPage onSubmit={handleSubmit}>
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
            <TextField
              label='Edad del alumno'
              fullWidth
              name='age'
              onChange={handleStudentInput}
              value={studentInfo.age}
            />
          </InputWrapper>
        </InputWrapperColumn>
      </div>

      <Divider sx={{ margin: '16px 0px' }} />

      <div>
        <Typography variant='h5' sx={{ marginBottom: 1 }}>Curso</Typography>
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

          <Button variant='contained' size='large' onClick={handleAddCourse}>
            <AddBoxRoundedIcon fontSize='large' />
          </Button>
        </InputWrapperRow>

        <ChipContainer sx={{ '& .MuiChip-root': { alignSelf: 'flex-start'} }}>
          {courseInfo.map((course, idx) => (
            <Chip key={`${course.name}-${idx}`} variant='outlined' label={generateCourseString(course)} onDelete={() => removeCourse(idx)} />
          ))}
        </ChipContainer>
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
        <Button variant='contained' color='primary' type='submit'>Guardar</Button>
      </ButtonContainer>

    </ContainerPage>
  )
};

export default NewStudent;
