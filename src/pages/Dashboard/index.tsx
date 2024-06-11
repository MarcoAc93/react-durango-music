import { gql, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter } from "react-router-dom";
import { CircularProgress, styled } from '@mui/material';
import { AUTHORIZATION } from "../../queries";

const MainContainer = styled('div')({

});

export const Dashboard = () => {
  const navigation = useNavigate();
  const token = localStorage.getItem('token');
  const { loading } = useQuery(AUTHORIZATION, {
    variables: { token },
    onCompleted(data) {
      if (!data.authorization.id) navigation('/login')
    },
    onError() {
      navigation('/login')
    },
  });

  if (loading) return <CircularProgress  />

  return (
    <MainContainer>Dashboard!!!!!!</MainContainer>
  )
}
