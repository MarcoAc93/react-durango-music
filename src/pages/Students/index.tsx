import { useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridRowClassNameParams, GridRowId, GridRowParams, GridRowSelectionModel, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { PageLoader, Error, Title, DeleteStudentModal, Modal as ConfirmationModal } from '../../components';
import { DELETE_STUDENT, GET_STUDENTS } from '../../queries';
import { Container, ControlContainer } from './styles';
import { ModalState } from '../NewStudent/types';

const useStyles = makeStyles<Theme>(({ palette }) => ({
  desactivated: {
    backgroundColor: palette.error.light,
  },
}));

const QuickSearchToolbar = () => {
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
  const [studentIdSelected, setStudentIdSelected] = useState<GridRowId>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalState>({ title: '', description: '', isOpen: false, success: false });

  const classes = useStyles();

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
      {
        field: 'active',
        headerName: 'Activo',
        type: 'string',
        width: 100,
        valueFormatter: (active) => active ? 'Activo' : 'Desactivado'
      }
    ];
    return columnsData
  }, []);

  const getRowClassName = (params: GridRowClassNameParams) => {
    return !params.row.active ? classes.desactivated : '';
  };

  const handleAdd = () => navigate('/dashboard/nuevo-alumno');
  const onRowClick = (params: GridRowParams) => navigate(`/dashboard/editar-alumno/${params.id}`);

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

  const onOkBtn = (reason: string) => {
    deleteStudentMutation({
      variables: { studentId: studentIdSelected, reason },
      onCompleted: (response) => {
        if (response.deleteStudent) {
          onCloseModal();
          setModalState({ description: 'El alumno a sido desactivado exitosamente', isOpen: true, title: 'Alumno desactivado', success: true });
        }
      },
      onError(error) {
        setModalState({ description: error?.message, isOpen: true, title: 'Ups... algo salio mal', success: false });
      },
    });
  };

  if (loading) return <PageLoader />

  return (
    <Container>
      <Title>Alumnos</Title>
      <ControlContainer>
        <Button variant='contained' onClick={handleAdd}>Agregar</Button>
        <Button variant='contained' color='secondary' onClick={onDeleteBtn} disabled={!studentIdSelected}>Eliminar</Button>
      </ControlContainer>
      {error ? (
        <Error title="Ups, also salio mal" description='Hubo un error en el servidor, lo sentimos :(' />
      ) : (
        <DataGrid
          disableMultipleRowSelection
          rows={data.getStudents.students}
          columns={columns}
          onRowClick={onRowClick}
          onRowSelectionModelChange={onRowSelectionModelChange}
          getRowClassName={getRowClassName}
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
      <ConfirmationModal
        open={modalState.isOpen}
        success={modalState.success}
        title={modalState.title}
        description={modalState.description}
        handleClose={() => setModalState({ description: '', isOpen: false, title: '', success: false })}
      />
    </Container>
  )
}

export default Students;
