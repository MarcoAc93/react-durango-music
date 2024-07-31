import { Route, Routes, BrowserRouter } from 'react-router-dom';
import moment from 'moment'
import 'moment/locale/es';

import { Dashboard } from "./components";
import Login from "./pages/Login";
import Students from './pages/Students';
import NewStudent from './pages/NewStudent';
import Attendances from './pages/Attendances';
import Payments from './pages/Payments';
import FreeSpaces from './pages/FreeSpaces';
moment.locale('es', { week: { dow: 1 } });

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard  />}>
          <Route path='' element={<Students />} />
          <Route path='/dashboard/nuevo-alumno' element={<NewStudent />} />
          <Route path='/dashboard/editar-alumno/:studentId' element={<NewStudent />} />
          <Route path='/dashboard/asistencias' element={<Attendances />} />
          <Route path='/dashboard/asistencias/espacios-libres/' element={<FreeSpaces />} />
          <Route path='pagos' element={<Payments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
