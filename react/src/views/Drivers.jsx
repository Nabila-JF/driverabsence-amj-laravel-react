import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const { setNotification } = useStateContext();

    useEffect(() => {
        getDrivers();
    }, []);

    const onDelete = (d) => {
        if (!window.confirm('Are you sure you want to delete')) {
            return;
        }

        axiosClient.delete(`/drivers/${d.id}`)
            .then(() => {
                setNotification("Driver was successfully deleted.");
                getDrivers();
            });
    }

    const getDrivers = (page = 1) => {
        setLoading(true);
        axiosClient.get(`/drivers?page=${page}`)
            .then(({ data }) => {
                setLoading(false);
                setDrivers(data.data);
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
            getDrivers(newPage);
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
                <h1>Drivers</h1>
                <Link to="/drivers/new" className="btn-add">Add New</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
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
                            {drivers.map(d => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td>{d.name}</td>
                                    <td>{d.created_at}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/drivers/' + d.id}>Edit</Link>
                                        &nbsp;
                                        <button onClick={ev => onDelete(d)} className="btn-delete">Delete</button>
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
