import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormControl, InputLabel, Select, TextField } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_ATTENDANCES } from '../../queries';
import { AttendanceRow, Error, PageLoader, Title } from '../../components';

export default function Attendances() {
  const authorization = localStorage.getItem('token');
  const { data, loading, error } = useQuery(GET_ATTENDANCES, {
    fetchPolicy: 'network-only',
    context: { headers: { authorization } },
  });
  const [filters, setFilters] = useState<{ studentName: string, course: string }>({ course: '', studentName: '' });
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    if (data?.getAttendances?.attendances?.length > 0) {
      const attendanceData = data?.getAttendances?.attendances.filter((el: { studentName: string; course: string; }) => 
        (!filters.studentName || el.studentName.toLowerCase().includes(filters.studentName)) &&
        (!filters.course || el.course.toLowerCase().includes(filters.course))
      );
      setAttendances(attendanceData);
    }
  }, [data?.getAttendances?.attendances, data?.getAttendances?.attendances?.length, filters.course, filters.studentName]);

  if (loading) <PageLoader />
  if (error) <Error title='Ups... ocurrio un error en el servidor' description={error.message} />
  const attendancesData = filters.course || filters.studentName ? attendances : data?.getAttendances?.attendances;

  return (
    <Grid container gap={2} flexDirection='column' mb={4}>
      <Grid item>
        <Title>Asistencias</Title>
      </Grid>
      <Grid container flexDirection='row' gap={2}>
        <Grid item  xs={12} md={2}>
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
        <Grid item  xs={12} md={2}>
          <FormControl fullWidth>
            <TextField
              label='Curso'
              fullWidth
              name='course'
              onChange={(event) => setFilters(curr => ({ ...curr, course: event.target.value }))}
              value={filters.course}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid item>
        <TableContainer component={Paper} sx={{ maxWidth: 750 }}>
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
              {attendancesData?.map((row: any) => (
                <AttendanceRow key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
