import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const { setNotification } = useStateContext();

    useEffect(() => {
        getUsers();
    }, []);

    const onDelete = (u) => {
        if (!window.confirm('Are you sure you want to delete')) {
            return;
        }

        axiosClient.delete(`/users/${u.id}`)
            .then(() => {
                setNotification("User was successfully deleted.");
                getUsers();
            });
    }

    const getUsers = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/users?page=${page}`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
                setPagination({
                    current_page: data.meta.current_page,
                    last_page: data.meta.last_page,
                    per_page: data.meta.per_page,
                    total: data.meta.total,
                });
            })
            .catch(() => {
                setLoading(false);
            });
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            getUsers(newPage);
        }
    }

    // Generate Halaman untuk Ditampilkan
    const generatePagination = () => {
        const pages = [];
        const { current_page, last_page } = pagination;

        if (last_page <= 5) {
            // Jika halaman <= 5, tampilkan semua halaman
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Jika halaman > 5
            pages.push(1); // Halaman pertama selalu ditampilkan
            if (current_page > 3) {
                pages.push("..."); // Titik-titik jika current_page lebih besar dari 3
            }

            // Halaman di sekitar current_page
            for (let i = Math.max(2, current_page - 1); i <= Math.min(current_page + 1, last_page - 1); i++) {
                pages.push(i);
            }

            if (current_page < last_page - 2) {
                pages.push("..."); // Titik-titik jika current_page lebih kecil dari last_page - 2
            }
            pages.push(last_page); // Halaman terakhir selalu ditampilkan
        }
        return pages;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add New</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading &&
                        <tbody>
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                                        &nbsp;
                                        <button onClick={ev => onDelete(u)} className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
                {!loading && <div className="pagination">
                    <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1}>
                        Previous
                    </button>
                    {generatePagination().map((page, index) => (
                        page === "..." ? (
                            <span key={index}>...</span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => handlePageChange(page)}
                                disabled={page === pagination.current_page}
                                className={page === pagination.current_page ? 'active' : ''}
                            >
                                {page}
                            </button>
                        )
                    ))}
                    <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page}>
                        Next
                    </button>
                </div>}
            </div>
        </div>
    );
}
