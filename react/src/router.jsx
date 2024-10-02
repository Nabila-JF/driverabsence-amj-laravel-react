import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./views/Login.jsx";
import Users from "./views/Users.jsx";
import Drivers from "./views/Drivers.jsx";
import Dashboard from "./views/Dashboard.jsx";
import NotFound from "./views/NotFound.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import DriverAbsenceForm from "./views/DriverAbsenceForm.jsx";
import UserForm from "./views/UserForm.jsx";
import DriverForm from "./views/DriverForm.jsx";

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <DefaultLayout />,
            children: [
                {
                    path: '/',
                    element: <Navigate to="/users" />
                },
                {
                    path: '/users',
                    element: <Users />
                },
                {
                    path: '/users/new',
                    element: <UserForm key="userCreate" />
                },
                {
                    path: '/users/:id',
                    element: <UserForm key="userUpdate" />
                },
                {
                    path: '/drivers',
                    element: <Drivers />
                },
                {
                    path: '/drivers/new',
                    element: <DriverForm key="driverCreate" />
                },
                {
                    path: '/drivers/:id',
                    element: <DriverForm key="driverUpdate" />
                },
                {
                    path: '/drive_abs_form',
                    element: <DriverAbsenceForm />
                },
                {
                    path: '/dashboard',
                    element: <Dashboard />
                },
            ]
        },
        {
            path: '/',
            element: <GuestLayout />,
            children: [
                {
                    path: '/login',
                    element: <Login />
                },
            ]
        },
        {
            path: '*',
            element: <NotFound />
        },
    ]
)

export default router;