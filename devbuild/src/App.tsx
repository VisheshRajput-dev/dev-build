import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/routes/Landing";
import Dashboard from "@/routes/Dashboard";
import Tasks from "@/routes/Tasks";
import TaskDetail from "@/routes/TaskDetail";
import Inbox from "@/routes/Inbox";
import History from "@/routes/History";
import Profile from "@/routes/Profile";
import AppShell from "@/components/layout/AppShell";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app"
          element={
            <AppShell>
              <Dashboard />
            </AppShell>
          }
        />
        <Route
          path="/app/dashboard"
          element={
            <AppShell>
              <Dashboard />
            </AppShell>
          }
        />
        <Route
          path="/app/tasks"
          element={
            <AppShell>
              <Tasks />
            </AppShell>
          }
        />
        <Route
          path="/app/tasks/:taskId"
          element={
            <AppShell>
              <TaskDetail />
            </AppShell>
          }
        />
        <Route
          path="/app/inbox"
          element={
            <AppShell>
              <Inbox />
            </AppShell>
          }
        />
        <Route
          path="/app/history"
          element={
            <AppShell>
              <History />
            </AppShell>
          }
        />
        <Route
          path="/app/profile"
          element={
            <AppShell>
              <Profile />
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App