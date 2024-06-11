import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

const App = () => {
  return (
    <BrowserRouter basename='/app'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
