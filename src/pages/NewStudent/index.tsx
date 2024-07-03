import { useState } from 'react';
import { TextField, Typography, Divider, Button, FormControl, Grid, useMediaQuery, AlertColor } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Form, FormikHelpers } from 'formik';
import { useMutation, useQuery } from '@apollo/client';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Title, PageLoader, Error, EnrollmentForm, Toast } from '../../components';
import { ContainerPage, HeaderWrapper, StyledPaper } from './styles';
import { FormValuesStudentInfo } from './types'
import { CREATE_STUDENT, GET_STUDENT, UPDATE_STUDENT } from '../../queries';

const validationSchemaStudentInfo = Yup.object().shape({
  name: Yup.string().required('Nombre del alumno requerido'),
  lastName: Yup.string().required('Apellido del alumno requerido'),
  email: Yup.string().email('Email invalido'),
  cellphone: Yup.string().required('El numero es requerido').max(10, 'Maximo 10 caracteres').min(10, 'Minimo 10 caracteres'),
  age: Yup.string(),
  tutorName: Yup.string(),
  tutorContactNumber: Yup.string().max(10, 'Maximo 10 caracteres').min(10, 'Minimo 10 caracteres'),
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

const NewStudent = () => {
  const { studentId } = useParams();
  const isMobile = useMediaQuery('sm');
  const navigate = useNavigate();
  const authorization = localStorage.getItem('token');

  const [createStudentMutation, { loading }] = useMutation(CREATE_STUDENT, {
    refetchQueries: ['GetStudents'],
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

  const [toastState, setToastState] = useState<{ open: boolean, message: string, type?: AlertColor }>({ open: false, message: '', type: undefined });
  const [newStudentId, setNewStudentId] = useState<string>();
  const [editStudent, setEditStudent] = useState<boolean>(!!studentId ?? false);

  const handleGoBack = () => navigate('/dashboard');
  const toggleEdit = () => setEditStudent(currentState => !currentState);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastState({ open: false, message: '', type: undefined });
  };

  const onError = (error: any) => setToastState({ open: true, message: error.message, type: 'error' });

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
          setToastState({ open: true, message: "Alumno creado correctamente", type: 'success' });
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
          // setModalState({ isOpen: true, title: 'Información actualizada', description: 'La información del alumno a sido actualizada correctamente', success: true });
          setToastState({ open: true, message: 'La información del alumno a sido actualizada correctamente', type: 'success' });
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

              {studentData?.getStudent?.deregister && (
                <Grid container columns={12}>
                  <Grid item>
                    <StyledPaper>
                      Alumno dado de baja
                      <Typography>Fecha: {new Date(studentData?.getStudent?.deregister?.date).toLocaleDateString()}</Typography>
                      <Typography>Motivo: {studentData?.getStudent?.deregister?.reason}</Typography>
                    </StyledPaper>
                  </Grid>
                </Grid>
              )}

              <Grid container columns={12} flexDirection={!isMobile ? 'row': 'column'} gap={2} justifyContent={!isMobile ? 'flex-end': 'center'}>
                <Grid item xs={12} md={3}>
                  <Button variant='contained' color='error' onClick={handleGoBack} fullWidth>Cancelar</Button>
                </Grid>
                {editStudent && (
                  <Grid item xs={12} md={3}>
                    <Button variant='contained' color='warning' onClick={toggleEdit} fullWidth>Editar</Button>
                  </Grid>
                )}
                <Grid item xs={12} md={3}>
                  <LoadingButton variant='contained' color='primary' type='submit' loading={loading} fullWidth disabled={editStudent}>
                    Guardar
                  </LoadingButton>
                </Grid>
              </Grid>
              <Divider sx={{ margin: '8px 0px' }} />
            </ContainerPage>
          </Form>
        )}
      </Formik>

      {!studentId && (
        <EnrollmentForm studentId={newStudentId as string} />
      )}
      <Toast open={toastState.open} message={toastState.message} type={toastState.type} onClose={handleClose} />
    </>
  )
};

export default NewStudent;
