import { Link, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

export default function DefaultLayout() {

    const navigate = useNavigate();
    const { user, token, notification, setUser, setToken } = useStateContext()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            // Perform navigation here
            navigate("/login");
        }
    }, [token]);


    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post('/logout')
            .then(() => {
                setUser({})
                setToken(null)
            })
    }

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data)
            })
    },
        [

        ])

    return (
        <div id="defaultLayout">
            <aside className={isSidebarOpen ? "sidebar-open" : "sidebar-closed"}>
                <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
                <Link to="/drivers">Drivers</Link>
                <Link to="/drive_abs_form">Jakarta Absence Form</Link>
            </aside>
            <div className="content">
                <header>
                    <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="toggle-header">
                        {isSidebarOpen ? "✕" : "☰"}
                    </div>
                    <div>
                        {user.name}
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
                {notification && <div className="notification">{notification}</div>}
            </div>
        </div>
    )
}