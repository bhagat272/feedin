import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateForm from "./components/CreateForm";
import FormSubmission from "./components/FormSubmission";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/create-form", element: <CreateForm /> },
  { path: "/form/:id", element: <FormSubmission /> },
  { path: "/", element: <Login /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
