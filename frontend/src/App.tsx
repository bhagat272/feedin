import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateForm from "./components/CreateForm";
import FormSubmission from "./components/FormSubmission";
import NotFound from "./components/Notfound";
import ResponsesPage from "./components/ResponsesPage";
import FeedbackSuccess from "./components/FeedbackSuccess";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<ProtectedRoute isPublic={true} />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Form accessible publicly */}
        <Route path="/form/:id" element={<FormSubmission />} />
        <Route path="/feedback-success" element={<FeedbackSuccess />} />
        <Route path="*" element={<NotFound />} />

        {/* Protected routes */}
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
