import { createBrowserRouter, RouterProvider as ReactRouterProvider } from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <div>Login</div>
  },
  {
    path: '/dashboard',
    element: <div>Dashboard</div>
  },
]);

const RouterProvider = () => <ReactRouterProvider router={router} />

export default RouterProvider;
