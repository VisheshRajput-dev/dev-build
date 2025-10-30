import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/routes/Landing";
import Dashboard from "@/routes/Dashboard";
import Tasks from "@/routes/Tasks";
import TaskDetail from "@/routes/TaskDetail";
import Inbox from "@/routes/Inbox";
import History from "@/routes/History";
import Profile from "@/routes/Profile";
import AppShell from "@/components/layout/AppShell";
import RequireAuth from "@/components/auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppShell>
                <Dashboard />
              </AppShell>
            </RequireAuth>
          }
        />
        <Route
          path="/app/dashboard"
          element={
            <RequireAuth>
              <AppShell>
                <Dashboard />
              </AppShell>
            </RequireAuth>
          }
        />
        <Route
          path="/app/tasks"
          element={
            <RequireAuth>
              <AppShell>
                <Tasks />
              </AppShell>
            </RequireAuth>
          }
        />
        <Route
          path="/app/tasks/:taskId"
          element={
            <RequireAuth>
              <AppShell>
                <TaskDetail />
              </AppShell>
            </RequireAuth>
          }
        />
        <Route
          path="/app/inbox"
          element={
            <RequireAuth>
              <AppShell>
                <Inbox />
              </AppShell>
            </RequireAuth>
          }
        />
        <Route
          path="/app/history"
          element={
            <RequireAuth>
              <AppShell>
                <History />
              </AppShell>
            </RequireAuth>
          }
        />
        <Route
          path="/app/profile"
          element={
            <RequireAuth>
              <AppShell>
                <Profile />
              </AppShell>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App