import { useEffect, useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridRowId, GridRowParams, GridRowSelectionModel, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AlertColor, Box, Button, Checkbox, Grid } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

import { PageLoader, Error, Title, DeleteStudentModal, Modal as ConfirmationModal, EnrollStudent, DrawerFilter, Toast } from '../../components';
import { CREATE_ATTENDANCE, DELETE_STUDENT, GET_STUDENTS } from '../../queries';
import { Container } from './styles';
import { ModalState } from '../NewStudent/types';
import { daysToSpanish } from '../NewStudent/constants';
import { generateDaysOfWeek } from '../Attendance';
import { Label } from '../Attendance/styles';

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
    context: { headers: { authorization } },
  });

  const [studentIdSelected, setStudentIdSelected] = useState<GridRowId>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEnrollment, setOpenEnrollment] = useState<boolean>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({ profesor: '', class: '', time: '', days: [] });
  const [students, setStudents] = useState(data?.getStudents?.students || []);
  const [toastState, setToastState] = useState<{ open: boolean, message: string, type?: AlertColor }>({ open: false, message: '' });

  const handleFilters = (type: string, value: string) => {
    setFilters(currValue => ({ ...currValue, [type]: value }));
  }

  const onCheckBoxClick = (row: any, date: string) => {
    const { id: studentId, enrollments } = row;
    const [enrollment] = enrollments;
    const { id: enrollmentId } = enrollment
    createAttendanceMutation({
      fetchPolicy: 'network-only',
      variables: { studentId, enrollmentId, date },
      onCompleted(data) {
        setToastState({ open: true, message: data.createAttendance, type: 'success' });
      },
      onError() {
        setToastState({ open: true, message: 'Error :(', type: 'error' });
      },
    })
  }
  console.log(generateDaysOfWeek());

  const columns = useMemo(() => {
    const columnsData: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Nombre',
        width: 150,
        renderCell: (student: any) => `${student.row.name} ${student.row.lastName}`,
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
        valueFormatter: (active) => active ? 'Activo' : 'Desactivado'
      },
    ];
    return columnsData
  }, []);

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
      {/* <ConfirmationModal
        open={modalState.isOpen}
        success={modalState.success}
        title={modalState.title}
        description={modalState.description}
        handleClose={() => setModalState({ description: '', isOpen: false, title: '', success: false })}
      /> */}
      <EnrollStudent
        isOpen={openEnrollment}
        onClose={handleOpenEnrollment}
        studentId={studentIdSelected as string}
      />
      <Toast open={toastState.open} message={toastState.message} type={toastState.type} onClose={handleClose} />
    </Container>
  )
}

export default Students;
