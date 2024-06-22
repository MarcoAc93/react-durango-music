import { useState } from 'react';
import { TextField, Typography, Divider, Select, MenuItem, Button, FormControl, ButtonGroup, InputLabel, Chip, Grid, useMediaQuery } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { FieldArray, Formik, Form, ErrorMessage } from 'formik';
import { useMutation } from '@apollo/client';

import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Title, Modal } from '../../components';
import { ChipContainer, ContainerPage, InputWrapperColumn, InputWrapperRow, ButtonContainer, HeaderWrapper, InputWrapper } from './styles';
import { Course, FormValues } from './types'
import { COURSES, DAYS, PROFESORS, TIMES, daysToSpanish, PERIODS } from './constants';
import { CREATE_STUDENT, ENROLL_STUDENT } from '../../queries';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nombre del alumno requerido'),
  lastName: Yup.string().required('Apellido del alumno requerido'),
  email: Yup.string().email('Email invalido'),
  cellphone: Yup.string().required('El numero es requerido').max(10, 'Maximo 10 caracteres'),
  age: Yup.string(),
  tutorName: Yup.string(),
  tutorContactNumber: Yup.string().max(10, 'Maximo 10 caracteres'),
  courses: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Selecciona el curso'),
      profesor: Yup.string().required('Selecciona el profesor'),
      time: Yup.string().required('Selecciona la hora'),
      days: Yup.array().min(1).required('Selecciona al menos 1 dia')
    }).required(),
  ),
  period: Yup.string().required('El periodo es requerido'),
  amount: Yup.string()
});

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
  days: [], // Temp field for adding new course
  courses: [] as unknown as [Course],
  period: '',
  amount: '',
};

const NewStudent = () => {
  const isMobile = useMediaQuery('sm');
  const navigate = useNavigate();
  const [createStudentMutation, { loading }] = useMutation(CREATE_STUDENT);
  const [enrollStudentMutation] = useMutation(ENROLL_STUDENT);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState({ title: '', description: '' });

  const handleGoBack = () => navigate('/dashboard');
  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setError({ title: '', description: '' });
    setOpenModal(false);
  }

  const generateCourseString = (courseInfo: Course) => {
    // @ts-ignore
    return `Curso de ${courseInfo.name} con ${courseInfo.profesor} a las ${courseInfo.time} los dias ${courseInfo.days?.map(el => daysToSpanish[el]).join(', ')}`
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
  };

  const onError = (error: any) => {
    setError({ title: 'Hubo un error...', description: error?.message })
    handleOpenModal();
  };

  const onCompleted = (data: any, formValues: FormValues) => {
    if (data.createStudent?.success) {
      // @ts-ignore
      formValues.courses.forEach(course => { course.days = course.days.map(day => daysToSpanish[day]) });
      enrollStudentMutation({
        variables: {
          input: {
            amount: Number(formValues.amount),
            payed: !formValues.amount ? false : true,
            period: formValues.period,
            studentId: data.createStudent.student.id,
            courses: formValues.courses
          },
        },
        onCompleted(data) {
          if (data?.enrollStudent?.success) setOpenModal(true)
        },
        onError
      })
    }
  };

  const onSubmit = (values: FormValues) => {
    console.log(values);
    createStudentMutation({
      variables: {
        input: {
          name: values.name,
          lastName: values.lastName,
          cellphone: values.cellphone,
          email: values.email,
          age: values.age,
          tutor: {
            name: values.tutorName,
            cellphone: values.tutorContactNumber,
          },
        },
      },
      onCompleted: (response) => onCompleted(response, values),
      onError,
    })
  };

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
          <Form>
            <ContainerPage>
              <HeaderWrapper>
                <ChevronLeftIcon fontSize='large' onClick={handleGoBack} />
                <Title variant='h2' noWrap>Inscribir Nuevo Alumno</Title>
              </HeaderWrapper>

              <div>
                <Typography variant='h5'>Informacion del alumno</Typography>
                <Grid container columns={12} flexDirection={!isMobile ? 'row': 'column'} gap={2}>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <TextField
                        label='Nombre del alumno'
                        fullWidth
                        name='name'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                      />
                      {errors.name && touched.name && <Typography variant='body1' color='red'>{errors.name}</Typography>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <TextField
                        label='Apellidos del alumno'
                        fullWidth
                        name='lastName'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                      />
                      {errors.lastName && touched.lastName && <Typography variant='body1' color='red'>{errors.lastName}</Typography>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <TextField
                        label='Email del alumno'
                        fullWidth
                        name='email'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                      {errors.email && touched.email && <Typography variant='body1' color='red'>{errors.email}</Typography>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <TextField
                        label='Telefono de contacto'
                        fullWidth
                        name='cellphone'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.cellphone}
                      />
                      {errors.cellphone && touched.cellphone && <Typography variant='body1' color='red'>{errors.cellphone}</Typography>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <TextField
                        label='Edad del alumno'
                        fullWidth
                        name='age'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.age}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Divider sx={{ margin: '16px 0px' }} />
              </div>

              <div>
                <Typography variant='h5'>Informacion del tutor</Typography>
                <Grid container columns={12} flexDirection={!isMobile ? 'row': 'column'} gap={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <TextField
                        label='Nombre del padre/tutor'
                        fullWidth
                        name='tutorName'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tutorName}
                      />
                      {errors.tutorContactNumber && touched.tutorContactNumber && <Typography variant='body1' color='red'>{errors.tutorContactNumber}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <TextField
                        label='Telefono del padre/tutor'
                        fullWidth
                        name='tutorContactNumber'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tutorContactNumber}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Divider sx={{ margin: '16px 0px' }} />
              </div>
              

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
                <Divider sx={{ margin: '8px 0px' }} />
              </div>

              <div>
                <Typography variant='h5' sx={{ marginBottom: 1 }}>Inscripción</Typography>
                <Grid container columns={12} flexDirection={!isMobile ? 'row': 'column'} gap={2}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label-period">Periodo</InputLabel>  
                      <Select
                        labelId="demo-simple-select-label-period"
                        id="demo-simple-select-period"
                        name='period'
                        value={values.period}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {PERIODS.map(element => (
                          <MenuItem key={element} value={element}>{element}</MenuItem>
                        ))}
                      </Select>
                      {errors.period && touched.period && <Typography variant='body1' color='red'>{errors.period}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <TextField
                        label='Cantidad de inscripción'
                        fullWidth
                        name='amount'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.amount}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
              <Divider />

              <ButtonContainer>
                <Button variant='contained' color='error' onClick={handleGoBack}>Cancelar</Button>
                <LoadingButton variant='contained' color='primary' type='submit' loading={loading}>Guardar</LoadingButton>
              </ButtonContainer>
            </ContainerPage>
          </Form>
        )}
      </Formik>
      <Modal
        open={openModal}
        title={!error.title ? 'Alumno agregado correctamente' : error.title}
        description={!error.description ? 'El alumno a sido agregado correctamente' : error.description}
        handleClose={handleCloseModal}
      />
    </>
  )
};

export default NewStudent;
