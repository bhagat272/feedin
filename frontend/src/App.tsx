import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateForm from './components/CreateForm';
import FormSubmission from './components/FormSubmission';
import NotFound from './components/Notfound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='*' element={< NotFound/>} />
        <Route path="/form/:id" element={<FormSubmission />} /> {/* Public access */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-form" element={<CreateForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;