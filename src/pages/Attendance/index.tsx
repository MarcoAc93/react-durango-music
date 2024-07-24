import React, { useMemo, useState } from 'react'
import { FormControl, Grid, InputLabel, MenuItem, Select, Checkbox, AlertColor } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment'

import { Title, Toast } from '../../components'
import { Label } from './styles';
import { QuickSearchToolbar } from '../Students';
import { PROFESORS } from '../NewStudent/constants';
import { CREATE_ATTENDANCE, GET_STUDENTS_BY_PROFESOR } from '../../queries';
import { capitalizeFirstLetter } from '../../utils';

export const generateDaysOfWeek = () => {
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

const Attendance = () => {
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState('');
  const [toastState, setToastState] = useState<{ open: boolean, message: string, type?: AlertColor }>({ open: false, message: '' });
  const authorization = localStorage.getItem('token');
  const { loading, data } = useQuery(GET_STUDENTS_BY_PROFESOR, {
    variables: { profesor },
    context: {
      headers: { authorization }
    }
  });
  const [createAttendanceMutation] = useMutation(CREATE_ATTENDANCE);

  const handleGoBack = () => navigate('/dashboard');

  const handleClose = () => setToastState({ open: false, message: '', type: undefined });

  const onCheckBoxClick = (row: any, date: string) => {
    const { id: studentId, enrollments } = row;
    const [enrollment] = enrollments;
    const { id: enrollmentId } = enrollment
    createAttendanceMutation({
      context: { headers: { authorization } },
      fetchPolicy: 'network-only',
      variables: { studentId, enrollmentId, date },
      refetchQueries: ['GetStudentsByProfesor'],
      onCompleted(data) {
        setToastState({ open: true, message: data.createAttendance, type: 'success' });
      },
      onError() {
        setToastState({ open: true, message: 'Error :(', type: 'error' });
      },
    })
  }

  const columns = useMemo(() => {
    const columnsData: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Nombre',
        width: 150,
        renderCell: (student: any) => `${student.row.name} ${student.row.lastName}`,
        disableColumnMenu: true
      },
      {
        field: 'cellphone',
        headerName: 'Telefono',
        type: 'string',
        width: 125,
        disableColumnMenu: true
      },
      {
        field: 'enrollments',
        headerName: 'Curso',
        type: 'string',
        width: 170,
        // @ts-ignore
        valueFormatter: (enrollments) => enrollments?.length > 0 ? enrollments.map(enrollment => enrollment.courses.map(el => el.name).join(' / ')) : '',
        disableColumnMenu: true
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
                  checked={!!row.attendances.find(el => el.date === element.formattedDate)}
                />
              }
            />
          ))
        )
      }
    ];
    return columnsData
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container gap={5}>
      <Grid container>
        <Grid item>
          <ChevronLeftIcon fontSize='large' onClick={handleGoBack} />
        </Grid>
        <Grid item>
          <Title variant='h2' noWrap>Asistencias</Title>
        </Grid>
      </Grid>

      <Grid container columns={12} gap={2}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id='input-label-profesor'>Profesor</InputLabel>
            <Select
              label='profesor'
              labelId='input-label-profesor'
              id='select-label-profesor'
              name='profesor'
              onChange={(event) => setProfesor(event.target.value)}
              value={profesor}
            >
              {PROFESORS.map(element => (
                <MenuItem value={element} key={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <DataGrid
            disableRowSelectionOnClick
            loading={loading}
            disableMultipleRowSelection
            rows={data?.getStudentsByProfesor?.students || []}
            columns={columns}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 15 } } }}
            pageSizeOptions={[15]}
            checkboxSelection
            slots={{ toolbar: QuickSearchToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
          />
        </Grid>
      </Grid>
      <Toast open={toastState.open} message={toastState.message} type={toastState.type} onClose={handleClose} />
    </Grid>
  )
}

export default Attendance