import { TextField, Typography, Divider, Select, MenuItem, Button, FormControl, ButtonGroup, InputLabel, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { FieldArray, Formik, Form, ErrorMessage } from 'formik';

import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Title } from '../../components';
import { ChipContainer, ContainerPage, InputWrapperColumn, InputWrapperRow, ButtonContainer, HeaderWrapper, InputWrapper } from './styles';
import { Course, FormValues } from './types'
import { COURSES, DAYS, PROFESORS, TIMES } from './constants';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre del alumno requerido'),
  lastName: Yup.string().required('Apellido del alumno requerido'),
  email: Yup.string().email('Email invalido'),
  cellphone: Yup.string().required('El numero es requerido'),
  age: Yup.string(),
  tutorName: Yup.string(),
  tutorContactNumber: Yup.string(),
  courses: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Selecciona el curso'),
      profesor: Yup.string().required('Selecciona el profesor'),
      time: Yup.string().required('Selecciona la hora'),
      days: Yup.array().min(1).required('Selecciona al menos 1 dia')
    }),
  ),
});

const NewStudent = () => {
  const navigate = useNavigate();
  const initialValues: FormValues = {
    name: '',
    lastName: '',
    email: '',
    cellphone: '',
    age: '',
    tutorName: '',
    tutorContactNumber: '',
    course: '', // Temp field for adding new course
    profesor: '', // Temp field for adding new course
    time: '', // Temp field for adding new course
    days: [] as string[], // Temp field for adding new course
    courses: [] as unknown as [Course]
  };

  const handleGoBack = () => navigate('/dashboard');

  const generateCourseString = (courseInfo: Course) => {
    // @ts-ignore
    return `Curso de ${courseInfo.name} con ${courseInfo.profesor} a las ${courseInfo.time} los dias ${courseInfo.days.map(el => daysToSpanish[el]).join(', ')}`
  };

  const addCourse = (values: FormValues, push: any, setFieldValue: any) => {
    if (values.course && values.profesor && values.time && values.days.length > 0) {
      push({
        name: values.course,
        profesor: values.profesor,
        time: values.time,
        days: values.days
      });
      setFieldValue('course', '');
      setFieldValue('profesor', '');
      setFieldValue('time', '');
      setFieldValue('days', []);
    }
  }

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
        <ContainerPage>
          <Form>
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && touched.name && <Typography variant='body1' color='red'>{errors.name}</Typography>}
                </InputWrapper>

                <InputWrapper>
                  <Typography variant='body1'>Apellidos</Typography>
                  <TextField
                    label='Apellidos del alumno'
                    fullWidth
                    name='lastName'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                  />
                  {errors.lastName && touched.lastName && <Typography variant='body1' color='red'>{errors.lastName}</Typography>}
                </InputWrapper>

                <InputWrapper>
                  <Typography variant='body1'>Email</Typography>
                  <TextField
                    label='Email del alumno'
                    fullWidth
                    name='email'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && <Typography variant='body1' color='red'>{errors.email}</Typography>}
                </InputWrapper>
                
                <InputWrapper>
                  <Typography variant='body1'>Telefono</Typography>
                  <TextField
                    label='Telefono de contacto'
                    fullWidth
                    name='cellphone'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.cellphone}
                  />
                  {errors.cellphone && touched.cellphone && <Typography variant='body1' color='red'>{errors.cellphone}</Typography>}
                </InputWrapper>
                
                <InputWrapper>
                  <Typography variant='body1'>Edad</Typography>
                  <TextField
                    label='Edad del alumno'
                    fullWidth
                    name='age'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.age}
                  />
                </InputWrapper>
              </InputWrapperColumn>
            </div>

            <Divider sx={{ margin: '16px 0px' }} />

            <div>
              <Typography variant='h5' sx={{ marginBottom: 1 }}>Curso</Typography>
              <FieldArray name="courses">
                  {({ push, remove }) => (
                    <>
                      <InputWrapperRow>
                        <FormControl sx={{ minWidth: 120 }}>
                          <InputLabel id="course">Curso</InputLabel>
                          <Select
                            labelId="course"
                            id="course-select-helper"
                            name="course"
                            value={values.course}
                            onChange={(event) => setFieldValue('course', event.target.value)}
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
                            name="profesor"
                            value={values.profesor}
                            onChange={(event) => setFieldValue('profesor', event.target.value)}
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
                            name="time"
                            value={values.time}
                            onChange={(event) => setFieldValue('time', event.target.value)}
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
                              onClick={() => {
                                const newDays = values.days.includes(element.value)
                                  ? values.days.filter(day => day !== element.value)
                                  : [...values.days, element.value];
                                setFieldValue('days', newDays);
                              }}
                              variant={values.days.includes(element.value) ? 'contained' : 'outlined'}
                            >
                              {element.display}
                            </Button>
                          ))}
                        </ButtonGroup>

                        <Button variant='contained' size='large' onClick={() => addCourse(values, push, setFieldValue)}>
                          <AddBoxRoundedIcon fontSize='large' />
                        </Button>
                      </InputWrapperRow>

                      <ChipContainer sx={{ '& .MuiChip-root': { alignSelf: 'flex-start' } }}>
                        {values.courses.map((course, idx) => (
                          <Chip
                            key={`${course.name}-${idx}`}
                            variant='outlined'
                            label={generateCourseString(course)}
                            onDelete={() => remove(idx)}
                          />
                        ))}
                      </ChipContainer>
                      <ErrorMessage name="courses">
                        {msg => <Typography variant='body1' color='red'>{msg}</Typography>}
                      </ErrorMessage>
                    </>
                  )}
                </FieldArray>
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
                    name='tutorName'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tutorName}
                  />
                </InputWrapper>
                
                <InputWrapper>
                  <Typography variant='body1'>Contacto</Typography>
                  <TextField
                    label='Telefono del padre/tutor'
                    fullWidth
                    name='tutorContactNumber'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tutorContactNumber}
                  />
                </InputWrapper>
              </InputWrapperColumn>
            </div>
            
            <Divider sx={{ margin: '16px 0px' }} />

            <ButtonContainer>
              <Button variant='contained' color='error' onClick={handleGoBack}>Cancelar</Button>
              <Button variant='contained' color='primary' type='submit'>Guardar</Button>
            </ButtonContainer>
          </Form>
        </ContainerPage>
      )}
    </Formik>
  )
};

export default NewStudent;
