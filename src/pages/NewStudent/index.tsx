import { useState } from 'react';
import { TextField, Typography, Divider, Select, MenuItem, Button, FormControl, ButtonGroup, InputLabel, Chip, Grid, useMediaQuery } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { FieldArray, Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import { useMutation, useQuery } from '@apollo/client';

import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Title, Modal, PageLoader, Error } from '../../components';
import { ChipContainer, ContainerPage, HeaderWrapper } from './styles';
import { Course, FormValuesEnrollment, FormValuesStudentInfo, ModalState } from './types'
import { COURSES, DAYS, PROFESORS, TIMES, daysToSpanish, PERIODS } from './constants';
import { CREATE_STUDENT, ENROLL_STUDENT, GET_STUDENT, UPDATE_STUDENT } from '../../queries';

const validationSchemaStudentInfo = Yup.object().shape({
  name: Yup.string().required('Nombre del alumno requerido'),
  lastName: Yup.string().required('Apellido del alumno requerido'),
  email: Yup.string().email('Email invalido'),
  cellphone: Yup.string().required('El numero es requerido').max(10, 'Maximo 10 caracteres').min(10, 'Minimo 10 caracteres'),
  age: Yup.string(),
  tutorName: Yup.string(),
  tutorContactNumber: Yup.string().max(10, 'Maximo 10 caracteres').min(10, 'Minimo 10 caracteres'),
});

const validatonSchemaEnrollment = Yup.object().shape({
  course: Yup.string().required('Selecciona el curso'),
  profesor: Yup.string().required('Selecciona el profesor'),
  time: Yup.string().required('Selecciona la hora'),
  days: Yup.array().min(1, 'Selecciona al menos 1 dia').required('Selecciona al menos 1 dia'),
  period: Yup.string().required('El periodo es requerido'),
  amount: Yup.string(),
});

const initialValuesStudentInfo: FormValuesStudentInfo = {
  name: '',
  lastName: '',
  email: '',
  cellphone: '',
  age: '',
  tutorName: '',
  tutorContactNumber: '',
};

const initialValuesEnrollment: FormValuesEnrollment = {
  course: '', // Temp field for adding new course
  profesor: '', // Temp field for adding new course
  time: '', // Temp field for adding new course
  days: [], // Temp field for adding new course
  courses: [] as unknown as [Course],
  period: '',
  amount: '',
}

const NewStudent = () => {
  const { studentId } = useParams();
  const isMobile = useMediaQuery('sm');
  const navigate = useNavigate();
  const authorization = localStorage.getItem('token');

  const [createStudentMutation, { loading }] = useMutation(CREATE_STUDENT, {
    refetchQueries: ['GetStudents'],
    context: { headers: { authorization } },
  });
  const [enrollStudentMutation, { loading: loadingEnroll }] = useMutation(ENROLL_STUDENT, {
    context: { headers: { authorization } },
  });
  const [updateStudentMutation] = useMutation(UPDATE_STUDENT, {
    refetchQueries: ['GetStudents'],
    context: { headers: { authorization } },
  });
  const skipGetStudent = studentId ? false : true;
  const { data: studentData, loading: studentLoading, error: studentError } = useQuery(GET_STUDENT, {
    skip: skipGetStudent,
    variables: { studentId },
    context: { headers: { authorization } },
  });

  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, title: '', description: '' });
  const [newStudentId, setNewStudentId] = useState<string>();
  const [editStudent, setEditStudent] = useState<boolean>(!!studentId ?? false);

  const handleGoBack = () => navigate('/dashboard');
  const toggleEdit = () => setEditStudent(currentState => !currentState);
  const handleCloseModal = () => {
    setModalState({ isOpen: false, description: '', title: '' });
    if (studentId && studentData.getStudent.id) toggleEdit();
  };

  // @ts-ignore
  const generateCourseString = (courseInfo: Course) => `Curso de ${courseInfo.name} con ${courseInfo.profesor} a las ${courseInfo.time} los dias ${courseInfo.days?.map(el => daysToSpanish[el]).join(', ')}`;

  const addCourse = (values: FormValuesEnrollment, push: any) => {
    if (values.course && values.profesor && values.time && values.days?.length > 0) {
      push({ ...values });
    }
  };

  const onError = (error: any) => setModalState({ isOpen: true, title: 'Hubo un error...', description: error?.message });

  const createNewStudent = (values: FormValuesStudentInfo, resetForm?: any) => {
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
      onCompleted: (response) => {
        if (response.createStudent.success) {
          setModalState({ isOpen: true, description: 'El alumno a sido registrado correctamente', title: 'Alumno agregado' });
          setNewStudentId(response.createStudent.student.id);
          resetForm();
        }
      },
      onError,
    })
  };

  const updateStudent = (values: FormValuesStudentInfo) => {
    updateStudentMutation({
      variables: {
        studentId,
        input: {
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          cellphone: values.cellphone,
          age: values.age,
          tutor: {
            name: values.tutorName,
            cellphone: values.tutorContactNumber,
          }
        }
      },
      onError,
      onCompleted: (response) => {
        if (response.editStudent) {
          setModalState({ isOpen: true, title: 'Información actualizada', description: 'La información del alumno a sido actualizada correctamente' });
        }
      }
    })
  };

  const onSubmitStudentInfo = (values: FormValuesStudentInfo, { resetForm }: FormikHelpers<FormValuesStudentInfo>) => {
    if (studentId && studentData.getStudent.id) {
      updateStudent(values);
    } else {
      createNewStudent(values, resetForm);
    }
  };

  const onSubmitEnrollStudent = (values: FormValuesEnrollment, { resetForm }: FormikHelpers<FormValuesEnrollment>) => {
    // @ts-ignore
    values.courses.forEach(course => { course.days = course.days.map(day => daysToSpanish[day]) });
    enrollStudentMutation({
        variables: {
          input: {
            amount: Number(values.amount),
            payed: !values.amount ? false : true,
            period: values.period,
            studentId: newStudentId,
            courses: values.courses
          },
        },
        onCompleted(data) {
          if (data?.enrollStudent?.success) {
            setModalState({ isOpen: true, title: 'Alumno inscrito', description: 'El alumno a sido inscrito correctamente' });
            setNewStudentId('');
            resetForm();
          }
        },
        onError
      })
  };

  if (studentLoading) return <PageLoader />;
  if (studentError) return <Error title='Ups, algo salio mal...' description={studentError.message} />

  const studentValues: FormValuesStudentInfo = {
    ...(studentId && studentData.getStudent.id ? {
      name: studentData.getStudent.name,
      lastName: studentData.getStudent.lastName,
      email: studentData.getStudent.email,
      cellphone: studentData.getStudent.cellphone,
      age: studentData.getStudent.age,
      tutorName: studentData.getStudent.tutor.name,
      tutorContactNumber: studentData.getStudent.tutor.cellphone
    } : initialValuesStudentInfo)
  }

  return (
    <>
      <Formik initialValues={studentValues} validationSchema={validationSchemaStudentInfo} onSubmit={onSubmitStudentInfo}>
        {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
          <Form>
            <ContainerPage>
              <HeaderWrapper>
                <ChevronLeftIcon fontSize='large' onClick={handleGoBack} />
                <Title variant='h2' noWrap>Agregar Nuevo Alumno</Title>
              </HeaderWrapper>

              <div>
                <Typography variant='h5'>Informacion del alumno</Typography>
                <Grid container columns={12} flexDirection={!isMobile ? 'row': 'column'} gap={2}>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <TextField
                        disabled={editStudent}
                        label='Nombre del alumno'
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
                        disabled={editStudent}
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
                        disabled={editStudent}
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
                        disabled={editStudent}
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
                        disabled={editStudent}
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
                        disabled={editStudent}
                        label='Nombre del padre/tutor'
                        fullWidth
                        name='tutorName'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tutorName ?? ''}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <TextField
                        disabled={editStudent}
                        label='Telefono del padre/tutor'
                        fullWidth
                        name='tutorContactNumber'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tutorContactNumber ?? ''}
                      />
                      {errors.tutorContactNumber && touched.tutorContactNumber && <Typography variant='body1' color='red'>{errors.tutorContactNumber}</Typography>}
                    </FormControl>
                  </Grid>
                </Grid>
              </div>

              <Grid container columns={12} flexDirection={!isMobile ? 'row': 'column'} gap={2} justifyContent={!isMobile ? 'flex-end': 'center'}>
                <Grid item xs={12} md={3}>
                  <Button variant='contained' color='error' onClick={handleGoBack} fullWidth>Cancelar</Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button variant='contained' color='warning' onClick={toggleEdit} fullWidth>Editar</Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <LoadingButton variant='contained' color='primary' type='submit' loading={loading} fullWidth>Guardar</LoadingButton>
                </Grid>
              </Grid>
              <Divider sx={{ margin: '16px 0px' }} />
            </ContainerPage>
          </Form>
        )}
      </Formik>

      {!studentId && (
        <Formik initialValues={initialValuesEnrollment} validationSchema={validatonSchemaEnrollment} onSubmit={onSubmitEnrollStudent}>
          {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
            <Form>
              <div>
                <Typography variant='h5' sx={{ marginBottom: 1 }}>Seleccionar curso</Typography>
                <FieldArray name="courses">
                  {({ push, remove }) => (
                    <Grid container columns={12} flexDirection={!isMobile ? 'row': 'column'} gap={2}>
                      <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                          <InputLabel id="course">Curso</InputLabel>
                          <Select
                            labelId="course"
                            id="course-select-helper"
                            name="course"
                            value={values.course}
                            onChange={(event) => setFieldValue('course', event.target.value)}
                            onBlur={handleBlur}
                          >
                            {COURSES.map(element => (
                              <MenuItem value={element} key={element}>
                                {element}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.course && touched.course && <Typography variant='body1' color='red'>{errors.course}</Typography>}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
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
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
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
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <ButtonGroup size='large' fullWidth sx={{ minHeight: '100%' }}>
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
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <Button variant='contained' size='large' onClick={() => addCourse(values, push)} fullWidth>
                          <AddBoxRoundedIcon fontSize='large' />
                        </Button>
                      </Grid>

                      <Grid item xs={12} md={12}>
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
                      </Grid>
                      <ErrorMessage name="courses">
                        {msg => <Typography variant='body1' color='red'>{msg}</Typography>}
                      </ErrorMessage>
                    </Grid>
                  )}
                </FieldArray>
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
                <Grid container columns={12} justifyContent='flex-end' sx={{ marginTop: 2 }} >
                  <Grid item xs={12} md={3}>
                    <LoadingButton variant='contained' color='primary' type='submit' loading={loadingEnroll} fullWidth>Inscribir</LoadingButton>
                  </Grid>
                </Grid>
              </div>
            </Form>
          )}
        </Formik>
      )}
      <Modal
        open={modalState.isOpen}
        title={modalState.title}
        description={modalState.description}
        handleClose={handleCloseModal}
      />
    </>
  )
};

export default NewStudent;
