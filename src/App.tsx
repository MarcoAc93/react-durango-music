import { Route, Routes, BrowserRouter } from 'react-router-dom';

import { Dashboard } from "./components";
import Login from "./pages/Login";
import Students from './pages/Students';
import NewStudent from './pages/NewStudent';
import Groups from './pages/Groups';
import Payments from './pages/Payments';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard  />}>
          <Route path='' element={<Students />} />
          <Route path='/dashboard/nuevo-alumno' element={<NewStudent />} />
          <Route path='/dashboard/editar-alumno/:studentId' element={<NewStudent />} />
          <Route path='grupos' element={<Groups />} />
          <Route path='pagos' element={<Payments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
