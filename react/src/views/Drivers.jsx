import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State untuk kata kunci pencarian
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const { setNotification } = useStateContext();

    // Memfilter data hanya jika pencarian dilakukan di frontend
    const filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        getDrivers(); // Memuat data driver saat komponen pertama kali dirender
    }, []);

    useEffect(() => {
        if (searchTerm) {
            searchDrivers(); // Lakukan pencarian di semua halaman
        } else {
            getDrivers(); // Jika tidak ada pencarian, kembalikan ke pagination normal
        }
    }, [searchTerm]);

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

    // Fungsi untuk mengambil data driver secara paginated
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

    // Fungsi untuk melakukan pencarian driver berdasarkan kata kunci di seluruh halaman
    const searchDrivers = async () => {
        setLoading(true);
        let allDrivers = [];
        let page = 1;
        let lastPage = 1;

        // Loop untuk mengambil semua halaman data
        do {
            const { data } = await axiosClient.get(`/drivers?search=${searchTerm}&page=${page}`);
            allDrivers = [...allDrivers, ...data.data]; // Tambahkan hasil pencarian ke array allDrivers
            page = data.meta.current_page + 1;
            lastPage = data.meta.last_page;
        } while (page <= lastPage); // Lanjutkan mengambil data hingga halaman terakhir

        setDrivers(allDrivers); // Set hasil pencarian
        setLoading(false);
    };

    // Fungsi untuk mengubah halaman
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            if (searchTerm) {
                searchDrivers(newPage); // Jika pencarian sedang aktif
            } else {
                getDrivers(newPage); // Jika tidak ada pencarian
            }
        }
    }

    // Generate halaman pagination
    const generatePagination = () => {
        const pages = [];
        const { current_page, last_page } = pagination;

        if (last_page <= 5) {
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1); // Halaman pertama
            if (current_page > 3) {
                pages.push("...");
            }

            for (let i = Math.max(2, current_page - 1); i <= Math.min(current_page + 1, last_page - 1); i++) {
                pages.push(i);
            }

            if (current_page < last_page - 2) {
                pages.push("...");
            }
            pages.push(last_page); // Halaman terakhir
        }
        return pages;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Drivers</h1>
                <Link to="/drivers/new" className="btn-add">Add New</Link>
            </div>
            <br />
            <div>
                <input
                    type="text"
                    placeholder="Cari nama driver"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update pencarian
                />
            </div>

            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Nomor Polisi</th>
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
                            {filteredDrivers.map(driver => (
                                <tr key={driver.id}>
                                    <td>{driver.id}</td>
                                    <td>{driver.name}</td>
                                    <td>{driver.nopol}</td>
                                    <td>{driver.created_at}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/drivers/' + driver.id}>Edit</Link>
                                        &nbsp;
                                        <button onClick={ev => onDelete(driver)} className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
                {/* Nonaktifkan pagination jika pencarian sedang aktif */}
                {!loading && !searchTerm && (
                    <div className="pagination">
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
                    </div>
                )}
            </div>
        </div>
    );
}
