import { useEffect, useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { AlertColor, Box, Button, ButtonGroup, Checkbox, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import TuneIcon from '@mui/icons-material/Tune';
import moment from 'moment';

import { PageLoader, Error, Title, DeleteStudentModal, EnrollStudent, DrawerFilter, Toast } from '../../components';
import { CREATE_ATTENDANCE, DELETE_STUDENT, GET_STUDENTS } from '../../queries';
import { Container, Label } from './styles';
import { daysToSpanish } from '../NewStudent/constants';
import { capitalizeFirstLetter } from '../../utils';

const generateDaysOfWeek = () => {
  const startOfWeek = moment().startOf('week');
  const days = [];
  for (let i = 0; i < 6; i++) {
    const date = startOfWeek.clone().add(i, 'day');
    const formattedDate = date.format('DD/MM/YYYY');
    const dayAbbreviation = capitalizeFirstLetter(date.format('ddd')).slice(0, -1);
    days.push({ formattedDate, dayAbbreviation });
  }
  return days;
}

type Filters = { profesor: string; class: string; time: string; days: string[] };

export const QuickSearchToolbar = () => {
  return (
    <Box sx={{ display: 'flex', mt: 2, ml: 2 }}>
      <GridToolbarQuickFilter />
    </Box>
  );
}

const Students = () => {
  const navigate = useNavigate();
  const authorization = localStorage.getItem('token');
  const { loading, data, error } = useQuery(GET_STUDENTS, {
    context: { headers: { authorization } }
  });
  const [deleteStudentMutation] = useMutation(DELETE_STUDENT, {
    refetchQueries: ['GetStudents'],
    context: { headers: { authorization } },
  });
  const [createAttendanceMutation] = useMutation(CREATE_ATTENDANCE, {
    refetchQueries: ['GetStudents'],
    fetchPolicy: 'network-only',
    context: { headers: { authorization } },
  });

  const [studentIdSelected, setStudentIdSelected] = useState<GridRowId>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEnrollment, setOpenEnrollment] = useState<boolean>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({ profesor: '', class: '', time: '', days: [] });
  const [students, setStudents] = useState(data?.getStudents?.students || []);
  const [toastState, setToastState] = useState<{ open: boolean, message: string, type?: AlertColor }>({ open: false, message: '' });
  const [coursesModalState, setCoursesModalState] = useState<
    { open: boolean, courses: string[], date: string, studentId: string, enrollmentId: string, attendances: any[] }
  >({ open: false, courses: [], date: '', enrollmentId: '', studentId: '', attendances: [] });


  const handleFilters = (type: string, value: string) => setFilters(currValue => ({ ...currValue, [type]: value }));

  const createAttendance = ({ studentId, enrollmentId, date, course }: { studentId: string; enrollmentId: string; date: string; course: string }) => {
    createAttendanceMutation({
      variables: { input: { studentId, enrollmentId, date, course } },
      onCompleted(data) {
        setToastState({ open: true, message: data.createAttendance, type: 'success' });
        handleCloseCourseModal();
      },
      onError() {
        setToastState({ open: true, message: 'Error :(', type: 'error' });
      },
    })
  }

  const onClickCourseButton = (course: string) => {
    createAttendance({ course, date: coursesModalState.date, enrollmentId: coursesModalState.enrollmentId, studentId: coursesModalState.studentId })
  }

  const onCheckBoxClick = (row: any, date: string) => {
    const { id: studentId, enrollments } = row;
    const [enrollment] = enrollments;
    const { id: enrollmentId } = enrollment;
    if (enrollment.courses.length >= 2) {
      const courses = enrollment.courses.map((course: any) => course.name);
      const { attendances } = row;
      setCoursesModalState({ open: true, courses, date, enrollmentId, studentId, attendances });
    } else {
      createAttendance({ studentId, enrollmentId, date, course: enrollment.courses[0].name });
    }
  };


  const columns = useMemo(() => {
    const columnsData: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Nombre',
        width: 100,
      },
      {
        field: 'lastName',
        headerName: 'Apellido',
        width: 150,
      },
      {
        field: 'cellphone',
        headerName: 'Telefono',
        type: 'string',
        width: 125,
      },
      {
        field: 'enrollments',
        headerName: 'Inscrito/Periodo',
        type: 'string',
        width: 120,
        // @ts-ignore
        valueFormatter: (enrollments) => enrollments?.length > 0 ? enrollments.map(enrollment => enrollment.courses.map(el => el.name).join(' / ')) : '',
      },
      {
        field: '',
        headerName: 'Asistencia',
        width: 380,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          generateDaysOfWeek().map((element) => (
            <Label
              key={element.dayAbbreviation}
              labelPlacement='start'
              label={element.dayAbbreviation}
              control={
                <Checkbox
                  onClick={() => onCheckBoxClick(row, element.formattedDate)}
                  // @ts-ignore
                  checked={!!row?.attendances?.find(el => el.date === element.formattedDate)}
                />
              }
            />
          ))
        )
      },
      {
        field: 'active',
        headerName: 'Activo',
        type: 'string',
        width: 100,
        valueFormatter: (active: any) => active ? 'Activo' : 'Desactivado'
      },
    ];
    return columnsData
  }, [])

  const handleAdd = () => navigate('/dashboard/nuevo-alumno');
  const handleEdit = (studentId: string) => navigate(`/dashboard/editar-alumno/${studentId}`);

  const onRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel) => {
    const [studentId] = rowSelectionModel;
    if (studentId) {
      setStudentIdSelected(studentId);
    } else {
      setStudentIdSelected(undefined);
    }
  };

  const onDeleteBtn = () => setOpenModal(true);
  const onCloseModal = () => setOpenModal(false);
  const handleOpenEnrollment = () => setOpenEnrollment(false);
  const toggleDrawer = () => setOpenDrawer(currState => !currState);
  const handleClose = () => setToastState({ open: false, message: '', type: undefined });
  const handleCloseCourseModal = () => setCoursesModalState({ open: false, courses: [], date: '', enrollmentId: '', studentId: '', attendances: [] });

  const onOkBtn = (reason: string) => {
    deleteStudentMutation({
      variables: { studentId: studentIdSelected, reason },
      onCompleted: (response) => {
        if (response.deleteStudent) {
          onCloseModal();
          setToastState({ message: 'Alumno desactivado', open: true, type: 'success' });
        }
      },
      onError() {
        setToastState({ message: 'Algo salio mal', open: true, type: 'warning' });
      },
    });
  };

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
    if (data?.getStudents?.students?.length > 0) {
      const students = data.getStudents.students.filter((student: { enrollments: any[]; }) => 
        student.enrollments.some(enrollment => 
          enrollment.active && 
          enrollment.courses.some((course: { days: string[]; profesor: string; name: string; time: string; }) => 
            (!filters.profesor || course.profesor === filters.profesor) &&
            (!filters.class || course.name === filters.class) &&
            (!filters.time || course.time === filters.time) &&
            // @ts-ignore
            (filters.days.length === 0 || course.days.some(day => filters.days.map(dayInEnglish => daysToSpanish[dayInEnglish]).includes(day)))
          )
        )
      );
      setStudents(students);
    }
  }, [filters.class, filters.profesor, filters.time, data?.getStudents?.students?.length, data?.getStudents?.students, filters.days]);

  if (loading) return <PageLoader />;
  const studentsData = filters.class || filters.profesor || filters.time || filters.days.length > 0 ? students : data?.getStudents?.students;

  return (
    <Container>
      <Title>Alumnos</Title>
      <Grid container columns={12} gap={1} alignItems='center'>
        <Grid item sm={2}>
          <Button fullWidth variant='contained' onClick={handleAdd}>Agregar</Button>
        </Grid>
        <Grid item sm={2}>
          <Button fullWidth variant='contained' color='success' onClick={() => setOpenEnrollment(true)} disabled={!studentIdSelected}>Inscribir</Button>
        </Grid>
        <Grid item sm={2}>
          <Button fullWidth variant='contained' color='info' onClick={() => handleEdit(studentIdSelected as string)} disabled={!studentIdSelected}>Editar</Button>
        </Grid>
        <Grid item sm={2}>
          <Button fullWidth variant='contained' color='secondary' onClick={onDeleteBtn} disabled={!studentIdSelected}>Eliminar</Button>
        </Grid>
        <Grid item sm={1} onClick={toggleDrawer} justifyContent='flex-end'>
          <TuneIcon color='primary' />
        </Grid>
      </Grid>
      <DrawerFilter
        filters={filters}
        handleDayClick={handleDayClick}
        handleFilters={handleFilters}
        openDrawer={openDrawer}
        clearFilters={() => setFilters({ class: '', days: [], profesor: '', time: '' })}
        toggleDrawer={toggleDrawer}
      />
      {error ? (
        <Error title="Ups, also salio mal" description='Hubo un error en el servidor, lo sentimos :(' />
      ) : (
        <DataGrid
          disableMultipleRowSelection
          disableRowSelectionOnClick
          rows={studentsData}
          columns={columns}
          onRowSelectionModelChange={onRowSelectionModelChange}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[15]}
          checkboxSelection
          slots={{ toolbar: QuickSearchToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      )}
      <DeleteStudentModal
        isOpen={openModal}
        onClose={onCloseModal}
        onOkBtn={onOkBtn}
      />
      <EnrollStudent
        isOpen={openEnrollment}
        onClose={handleOpenEnrollment}
        studentId={studentIdSelected as string}
      />
      <Dialog open={coursesModalState.open} onClose={handleCloseCourseModal}>
        <DialogTitle>Selecciona el curso</DialogTitle>
        <DialogContent>
          <ButtonGroup>
            {coursesModalState.courses.map(course => (
              <Button
                key={course}
                onClick={() => onClickCourseButton(course)}
                variant={coursesModalState.attendances.some((e: any) => e.course === course && coursesModalState.date === e.date) ? 'contained' : 'outlined'}
              >
                {course}
              </Button>
            ))}
          </ButtonGroup>
        </DialogContent>
      </Dialog>
      <Toast open={toastState.open} message={toastState.message} type={toastState.type} onClose={handleClose} />
    </Container>
  )
}

export default Students;
