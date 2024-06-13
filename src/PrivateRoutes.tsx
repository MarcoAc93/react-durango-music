// src/PrivateRoute.js
import React from 'react';
import { Route } from 'react-router-dom';
import Login from './pages/Login';
import { JSX } from 'react/jsx-runtime';

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Suponiendo que almacenas el token en localStorage

  return (
    <Route
      {...rest}
      element={(props: JSX.IntrinsicAttributes) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Login />
        )
      }
    />
  );
};

export default PrivateRoute;