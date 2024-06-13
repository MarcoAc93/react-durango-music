import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Students from './pages/Students';
import Groups from './pages/Groups';
import Courses from './pages/Courses';
import Payments from './pages/Payments';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard  />}>
          <Route path='' element={<Students />} />
          <Route path='grupos' element={<Groups />} />
          <Route path='cursos' element={<Courses />} />
          <Route path='pagos' element={<Payments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
