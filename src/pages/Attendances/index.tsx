import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormControl, TextField, Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_ATTENDANCES } from '../../queries';
import { AttendanceRow, Error, PageLoader, Title } from '../../components';
import { useNavigate } from 'react-router-dom';

export default function Attendances() {
  const navigate = useNavigate();
  const authorization = localStorage.getItem('token');
  const { data, loading, error } = useQuery(GET_ATTENDANCES, {
    fetchPolicy: 'network-only',
    context: { headers: { authorization } },
  });

  const [filters, setFilters] = useState<{ studentName: string }>({ studentName: '' });
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    if (data?.getAttendances?.attendances?.length > 0) {
      const attendanceData = data?.getAttendances?.attendances.filter((el: { studentName: string; }) => 
        (!filters.studentName || el.studentName.toLowerCase().includes(filters.studentName))
      );
      setAttendances(attendanceData);
    }
  }, [data?.getAttendances?.attendances, data?.getAttendances?.attendances?.length, filters.studentName]);

  if (loading) <PageLoader />
  if (error) <Error title='Ups... ocurrio un error en el servidor' description={error.message} />
  const attendancesData = filters.studentName ? attendances : data?.getAttendances?.attendances;

  return (
    <Grid container gap={2} flexDirection='column' mb={4}>
      <Grid item>
        <Title>Asistencias</Title>
      </Grid>
      <Grid container flexDirection='row' gap={1}>
        <Grid item  xs={12} md={5}>
          <FormControl fullWidth>
            <TextField
              label='Estudiante'
              fullWidth
              name='student'
              onChange={(event) => setFilters(curr => ({ ...curr, studentName: event.target.value }))}
              value={filters.studentName}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3} gap={3} alignContent='center'>
          <Button size='large' variant='contained' onClick={() => navigate('/dashboard/asistencias/espacios-libres')}>Ver espacios libres</Button>
        </Grid>
      </Grid>
      <Grid item>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Estudiante</TableCell>
                <TableCell align="right">Curso</TableCell>
                <TableCell align="right"># Asistencias</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendancesData?.map((row: any) => <AttendanceRow key={row.name} row={row} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
