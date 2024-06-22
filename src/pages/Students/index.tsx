import React, { useMemo } from 'react'
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import { PageLoader, Error, Title } from '../../components';
import { GET_STUDENTS } from '../../queries';
import { Container, ControlContainer } from './styles';

const Students = () => {
  const authorization = localStorage.getItem('token');
  const { loading, data, error } = useQuery(GET_STUDENTS, {
    context: { headers: { authorization } }
  });
  const navigate = useNavigate()

  const columns = useMemo(() => {
    const columnsData: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Nombre',
        width: 150,
      },
      {
        field: 'lastName',
        headerName: 'Apellidos',
        width: 150,
      },
      {
        field: 'cellphone',
        headerName: 'Telefono',
        type: 'string',
        width: 125,
      },
    ];
    return columnsData
  }, []);

  const handleAdd = () => navigate('/dashboard/nuevo-alumno');

  const onRowClick = (params: GridRowParams) => navigate(`/dashboard/editar-alumno/${params.id}`);

  if (loading) return <PageLoader />

  return (
    <Container>
      <Title>Alumnos</Title>
      <ControlContainer>
        <Button variant='contained' onClick={handleAdd}>Agregar</Button>
        <Button variant='contained' color='warning'>Editar</Button>
        <Button variant='contained' color='secondary'>Eliminar</Button>
      </ControlContainer>
      {error ? (
        <Error title="Ups, also salio mal" description='Hubo un error en el servidor, lo sentimos :(' />
      ) : (
        <DataGrid
          rows={data.getStudents.students}
          columns={columns}
          onRowClick={onRowClick}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[15]}
          checkboxSelection
        />
      )}
    </Container>
  )
}

export default Students;
