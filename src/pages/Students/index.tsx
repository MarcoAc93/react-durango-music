import React, { useMemo } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@apollo/client';

import PageLoader from '../../components/Loader';
import Error from '../../components/Error';
import { GET_STUDENTS } from '../../queries';
import { Container, Title } from './styles';

const Students = () => {
  const { loading, data, error } = useQuery(GET_STUDENTS);

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
        width: 110,
      },
    ];
    return columnsData
  }, []);

  if (loading) return <PageLoader />

  if (true) return <Error title="Ups, also salio mal" description='Hubo un error en el servidor, lo sentimos :(' />

  return (
    <Container>
      <Title>Alumnos</Title>
      <DataGrid
        rows={data.getStudents.students}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 15 },
          },
        }}
        pageSizeOptions={[15]}
        checkboxSelection
      />
    </Container>
  )
}

export default Students;
