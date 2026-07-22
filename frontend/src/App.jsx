import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Talent from "./pages/Talent";
import CreateProject from "./pages/CreateProject";
import Notifications from "./pages/Notifications";
import EditProfile from "./pages/EditProfile";
import ManageApplications from "./pages/ManageApplications";
import ProjectDetail from "./pages/ProjectDetail";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/talent" element={<Talent />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/manage-applications" element={<ManageApplications />} />
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
