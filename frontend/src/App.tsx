import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateForm from './components/CreateForm';
import FormSubmission from './components/FormSubmission';
import NotFound from './components/Notfound';
import ResponsesPage from './components/ResponsesPage';
import FeedbackSuccess from './components/FeedbackSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='*' element={< NotFound/>} />
        <Route path="/form/:id" element={<FormSubmission />} /> {/* Public access */}
        <Route path="/feedback-success" element={<FeedbackSuccess />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-form" element={<CreateForm />} />
          <Route path="/response/:formId" element={<ResponsesPage />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;