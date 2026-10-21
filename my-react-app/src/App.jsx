import {Routes,Route} from "react-router-dom";
import Login from "./student/pages/Login.jsx";
import Register from "./student/pages/Register.jsx";
import Dashboard from "./student/pages/Dashboard.jsx";
import MyTickets from "./student/pages/MyTickets.jsx";
import TicketDetails from "./student/pages/TicketDetails.jsx";
import CreateTicket from "./student/pages/CreateTicket.jsx";
import AIAssistant from "./student/pages/AIAssistant.jsx";
import Notifications from "./student/pages/Notifications.jsx";
import Profile from "./student/pages/Profile.jsx";
import StudentKnowledgeBase from "./student/pages/StudentKnowledgeBase.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AdminDepartments from "./admin/pages/AdminDepartments.jsx";
import AdminKnowledgeBase from "./admin/pages/AdminKnowledgeBase.jsx";
import AdminAIAssistant from "./admin/pages/AdminAIAssitant.jsx";
import AdminNotifications from "./admin/pages/AdminNotifications.jsx";
import AdminReports from "./admin/pages/AdminReports.jsx";
import AdminSettings from "./admin/pages/AdminSettings.jsx";
import AdminTickets from "./admin/pages/AdminTickets.jsx";
import AdminUsers from "./admin/pages/AdminUsers.jsx";
import AdminTicketDetails from "./admin/pages/AdminTicketDetails.jsx";
import AdminProfile from "./admin/pages/AdminProfile.jsx";
import StaffDashboard from "./staff/pages/StaffDashboard.jsx";
import StaffTickets from "./staff/pages/StaffTickets.jsx";
import StaffTicketDetails from "./staff/pages/StaffTicketDetails.jsx";
import StaffKnowledgeBase from "./staff/pages/StaffKnowledgeBase.jsx";
import StaffNotifications from "./staff/pages/StaffNotifications.jsx";
import StaffProfile from "./staff/pages/StaffProfile.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import StaffRoute from "./routes/StaffRoute.jsx";
import StudentRoute from "./routes/StudentRoute.jsx";
import DashboardRedirect from "./student/pages/DashboardRedirect.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDepartments } from "./features/departments/departmentSlice.js";
import AccessDenied from "./components/common/AccessDenied.jsx";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useSelector} from "react-redux";
import {
  connectSocket,
  disconnectSocket
} from "./socket/SocketClient.js";

import SocketListener from "./socket/SocketListener.jsx";

function App() {
  const dispatch=useDispatch();
  const {
    token,
    isAuthenticated
  }=useSelector(
    state=>state.auth
  );
  useEffect(()=>{
    if(isAuthenticated){
      dispatch(fetchDepartments());
    }
  },[
    dispatch,
    isAuthenticated
  ]);
  useEffect(()=>{
    if(isAuthenticated && token)
    {
      connectSocket(token);
    }
    else
    {
      disconnectSocket();
    }

    return ()=>{
      disconnectSocket();
    };
  },[
    isAuthenticated,
    token
  ]);
  return (
    <>
    <SocketListener/>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/access-denied" element={<AccessDenied />}/>
      <Route path="/dashboard" element={<DashboardRedirect/>}/>
      <Route path="/student/dashboard" element={
        <ProtectedRoute>
          <StudentRoute>
            <Dashboard />
          </StudentRoute>
        </ProtectedRoute>
        }/>
      <Route path="/student/tickets" element={
        <ProtectedRoute>
          <StudentRoute>
            <MyTickets />
          </StudentRoute>
        </ProtectedRoute>
        }/>
      <Route path="/student/tickets/:ticketId" element={
        <ProtectedRoute>
          <StudentRoute>
            <TicketDetails />
          </StudentRoute>
        </ProtectedRoute>
        }/>
      <Route path="/student/create-ticket" element={
        <ProtectedRoute>
          <StudentRoute>
            <CreateTicket />
          </StudentRoute>
        </ProtectedRoute>
        }/>
      <Route path="/student/assistant" element={
        <ProtectedRoute>
          <StudentRoute>
            <AIAssistant />
          </StudentRoute>
        </ProtectedRoute>
        }/>
        <Route path="/student/knowledge-base" element={
        <ProtectedRoute>
          <StudentRoute>
            <StudentKnowledgeBase />
          </StudentRoute>
        </ProtectedRoute>
        }/>
      <Route path="/student/notifications" element={
        <ProtectedRoute>
          <StudentRoute>
            <Notifications />
          </StudentRoute>
        </ProtectedRoute>
        }/>
      <Route path="/student/profile" element={
        <ProtectedRoute>
          <StudentRoute>
            <Profile />
          </StudentRoute>
        </ProtectedRoute>
        }/>
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminDashboard/>
            </AdminRoute>
        </ProtectedRoute>
        }/>
      <Route path="/admin/users" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminUsers/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/admin/departments" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminDepartments/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/admin/tickets" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminTickets/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/admin/assistant" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminAIAssistant/>
          </AdminRoute>
        </ProtectedRoute>
      }/>
      <Route path="/admin/knowledge-base" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminKnowledgeBase/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/admin/reports" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminReports/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminNotifications/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminSettings/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/admin/tickets/:ticketId" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminTicketDetails/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/admin/profile" element={
        <ProtectedRoute>
            <AdminRoute>
                <AdminProfile/>
            </AdminRoute>
        </ProtectedRoute>
        } />
      <Route path="/staff/dashboard" element={
        <ProtectedRoute>
            <StaffRoute>
                <StaffDashboard/>
            </StaffRoute>
        </ProtectedRoute>
        } />
      <Route path="/staff/tickets" element={
        <ProtectedRoute>
            <StaffRoute>
                <StaffTickets/>
            </StaffRoute>
        </ProtectedRoute>
        } />
      <Route path="/staff/tickets/:ticketId" element={
        <ProtectedRoute>
            <StaffRoute>
                <StaffTicketDetails/>
            </StaffRoute>
        </ProtectedRoute>
        }/>
      <Route path="/staff/knowledge-base" element={
        <ProtectedRoute>
            <StaffRoute>
                <StaffKnowledgeBase/>
            </StaffRoute>
        </ProtectedRoute>
        } />
      <Route path="/staff/notifications" element={
        <ProtectedRoute>
            <StaffRoute>
                <StaffNotifications/>
            </StaffRoute>
        </ProtectedRoute>
        } />
      <Route path="/staff/profile" element={
        <ProtectedRoute>
            <StaffRoute>
                <StaffProfile/>
            </StaffRoute>
        </ProtectedRoute>
        } />
    
    </Routes>

     <ToastContainer
    position="top-right"
    autoClose={3000}
    />
    </>
   
  );
}
export default App;