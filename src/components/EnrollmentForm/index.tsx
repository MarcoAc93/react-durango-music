import { useEffect, useRef, useState } from 'react';
import { AlertColor, Button, ButtonGroup, Chip, DialogActions, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { FieldArray, Formik, Form, FormikHelpers } from 'formik';
import { AddBoxRounded } from '@mui/icons-material';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useReactToPrint } from 'react-to-print';

import { COURSES, DAYS, PROFESORS, TIMES, daysToSpanish } from '../../pages/NewStudent/constants';
import { ChipContainer } from '../../pages/NewStudent/styles';
import { generateCourseString, getPeriodsWithYear } from '../../utils';
import { Course, FormValuesEnrollment } from '../../pages/NewStudent/types';
import { useMutation } from '@apollo/client';
import { ENROLL_STUDENT } from '../../queries';
import Toast from '../Toast';
import Ticket, { TicketInfo } from '../Ticket';

const validatonSchemaEnrollment = Yup.object().shape({
  course: Yup.string().required('Selecciona el curso'),
  profesor: Yup.string().required('Selecciona el profesor'),
  time: Yup.string().required('Selecciona la hora'),
  days: Yup.array().min(1, 'Selecciona al menos 1 dia').required('Selecciona al menos 1 dia'),
  period: Yup.string().required('El periodo es requerido'),
  amount: Yup.string(),
});

const initialValuesEnrollment: FormValuesEnrollment = {
  course: '', // Temp field for adding new course
  profesor: '', // Temp field for adding new course
  time: '', // Temp field for adding new course
  days: [], // Temp field for adding new course
  courses: [] as unknown as [Course],
  period: '',
  amount: '',
  firstMonthlyPayment: '',
};

type Props = {
  studentId: string;
}

const EnrollmentForm = ({ studentId }: Props) => {
  const isMobile = useMediaQuery('sm');
  const authorization = localStorage.getItem('token');
  const [toastState, setToastState] = useState<{ open: boolean, message: string, type?: AlertColor }>({ open: false, message: '', type: undefined });
  const [ticket, setTicket] = useState({ total: 0, ticketInfo: [] as TicketInfo[], print: false });
  const [periods, setPeriods] = useState<string[]>([]);
  const ticketRef = useRef<any>();
  const handlePrint = useReactToPrint({ content: () => ticketRef.current });
  const [enrollStudentMutation, { loading }] = useMutation(ENROLL_STUDENT, {
    refetchQueries: ['GetStudents', 'GetStudentsByClass'],
    context: { headers: { authorization } },
  });

  useEffect(() => {
    const periods = getPeriodsWithYear();
    setPeriods(periods);
  }, []);

  const onSubmitEnrollStudent = (values: FormValuesEnrollment, { resetForm }: FormikHelpers<FormValuesEnrollment>) => {
    // @ts-ignore
    values.courses.forEach(course => { course.days = course.days.map(day => daysToSpanish[day]) });
    if (!studentId) return;
    enrollStudentMutation({
        variables: {
          input: {
            studentId: studentId,
            period: values.period,
            amount: Number(values.amount),
            firstMonthlyPayment: Number(values.firstMonthlyPayment),
            scholarship: 0,
            courses: values.courses
          },
        },
        onCompleted(data) {
          if (data?.enrollStudent?.success) {
            setToastState({ open: true, message: "Alumno inscrito correctamente", type: 'success' });
            const ticketInfo = [
              {
                quantity: 1,
                concept: 'Inscripcion',
                price: Number(values.amount),
                net: 1 * Number(values.amount)
              }
            ];
            if (values.firstMonthlyPayment) {
              const firstMonthlyPayment = {
                quantity: 1,
                concept: 'Primer mes',
                price: Number(values.firstMonthlyPayment),
                net: 1 * Number(values.firstMonthlyPayment)
              }
              ticketInfo.push(firstMonthlyPayment);
            }
            let total = 0;
            ticketInfo.forEach(element => {
              total = total + element.net;
            });
            setTicket({ ticketInfo, total, print: true });
            resetForm();
          }
        },
        onError(error) {
          setToastState({ open: true, message: error.message, type: 'error' });
        }
      });
  };

  const addCourse = (values: FormValuesEnrollment, push: any) => {
    if (values.course && values.profesor && values.time && values.days?.length > 0) {
      push({ time: values.time, profesor: values.profesor, name: values.course, days: values.days });
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setToastState({ open: false, message: '', type: undefined });
  };

  const handleDayClick = (selectedDay: string, values: FormValuesEnrollment, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void) => {
    const group1 = ['monday', 'tuesday', 'wednesday'];
    const group2 = ['thursday', 'friday'];
    const group3 = ['saturday'];
  
    let newDays = [...values.days];
  
    if (group1.includes(selectedDay)) {
      if (group1.some(day => newDays.includes(day))) {
        newDays = newDays.filter(day => !group1.includes(day));
      } else {
        newDays = [...newDays, ...group1];
      }
    } else if (group2.includes(selectedDay)) {
      if (group2.some(day => newDays.includes(day))) {
        newDays = newDays.filter(day => !group2.includes(day));
      } else {
        newDays = [...newDays, ...group2];
      }
    } else if (group3.includes(selectedDay)) {
      if (group3.some(day => newDays.includes(day))) {
        newDays = newDays.filter(day => !group3.includes(day));
      } else {
        newDays = [...newDays, ...group3];
      }
    }
    setFieldValue('days', newDays);
  };

  return (
    <Formik initialValues={initialValuesEnrollment} validationSchema={validatonSchemaEnrollment} onSubmit={onSubmitEnrollStudent}>
      {({ values, handleChange, handleBlur, setFieldValue, errors, touched, isValid }) => (
        <Form>
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
                    {errors.profesor && touched.profesor && <Typography variant='body1' color='red'>{errors.profesor}</Typography>}
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
                    {errors.time && touched.time && <Typography variant='body1' color='red'>{errors.time}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <ButtonGroup size='large' fullWidth sx={{ minHeight: '100%' }}>
                    {DAYS.map(element => (
                      <Button
                        key={element.value}
                        onClick={() => handleDayClick(element.value, values, setFieldValue)}
                        variant={values.days.includes(element.value) ? 'contained' : 'outlined'}
                      >
                        {element.display}
                      </Button>
                    ))}
                  </ButtonGroup>
                  {errors.days && touched.days && <Typography variant='body1' color='red'>{errors.days}</Typography>}
                </Grid>

                <Grid item xs={12} md={1} container>
                  <Button variant='contained' size='large' onClick={() => addCourse(values, push)} fullWidth>
                    <AddBoxRounded fontSize='large' />
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
              </Grid>
            )}
          </FieldArray>

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
                  {periods.map(element => (
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <TextField
                  label='Primera mensualidad?'
                  fullWidth
                  name='firstMonthlyPayment'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstMonthlyPayment}
                />
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions>
            <Button variant='contained' color='secondary'>
              Cancelar
            </Button>
            <LoadingButton autoFocus variant='contained' color='primary' type='submit' loading={loading} disabled={!isValid}>
              Inscribir
            </LoadingButton>
            <Button variant='contained' color='info' onClick={handlePrint} disabled={!ticket.print}>
              imprimir ticket
            </Button>
          </DialogActions>
            <Toast open={toastState.open} message={toastState.message} type={toastState.type} onClose={handleClose} />
          <div style={{ display: 'none' }}>
            <Ticket total={ticket.total} ticketInfo={ticket.ticketInfo} ref={ticketRef}/>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default EnrollmentForm