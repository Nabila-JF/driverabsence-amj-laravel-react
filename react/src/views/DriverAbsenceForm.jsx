import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from "../axios-client"; // Pastikan ini mengarah ke file konfigurasi axios yang benar
import Select from 'react-select'; // Import React Select

export default function DriverAbsenceForm() {
    const [formData, setFormData] = useState({
        tanggal: '',
        namaDriver: '',
        trip1: '',
        trip2: '',
        trip3: '',
        trip4: '',
        trip5: '',
        trip6: '',
        trip7: '',
        trip8: '',
        trip9: '',
        trip10: '',
    });

    const [drivers, setDrivers] = useState([]); // State untuk menyimpan daftar driver
    const [loading, setLoading] = useState(true); // State untuk loading

    const fetchAllDrivers = async () => {
        let allDrivers = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await axiosClient.get(`/drivers?page=${currentPage}&limit=10`);
            const { data } = response;

            allDrivers = [...allDrivers, ...data.data]; // Gabungkan data driver
            currentPage++;

            // Jika halaman terakhir, hentikan pengambilan data
            hasMore = data.data.length > 0;
        }

        return allDrivers;
    };

    useEffect(() => {
        setLoading(true);
        fetchAllDrivers()
            .then((driverData) => {
                const driverOptions = driverData.map((driver) => ({
                    value: driver.name,
                    label: driver.name,
                }));
                setDrivers(driverOptions);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching drivers:", error);
                setLoading(false);
            });
    }, []);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDriverChange = (selectedOption) => {
        setFormData({ ...formData, namaDriver: selectedOption ? selectedOption.value : '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah form dari submit default

        setLoading(true);

        const scriptURL = 'https://script.google.com/macros/s/AKfycbzIElLV9XbGkoMC_nQHTk_6aklTVC6OoCDTtMqXHayJPvBDiqaZDYe3AG-lADsDIZv_3w/exec';

        try {
            // Kirim data form ke Google Apps Script
            const response = await axios.post(scriptURL, new FormData(e.target));
            console.log('Data berhasil dikirim:', response.data);
            alert("Data berhasil dikirim ke Google Sheets!");

            // Reset form setelah data berhasil dikirim
            setFormData({
                tanggal: '',
                namaDriver: '',
                trip1: '',
                trip2: '',
                trip3: '',
                trip4: '',
                trip5: '',
                trip6: '',
                trip7: '',
                trip8: '',
                trip9: '',
                trip10: ''
            });

        } catch (error) {
            console.error('Error saat mengirim data:', error.message);
            alert("Terjadi kesalahan saat mengirim data. Coba lagi.");
        }

        setLoading(false);

    };


    const customStyles = {
        control: (provided) => ({
            ...provided,
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            padding: '5px',
            border: '2px solid #e6e6e6',
            borderRadius: '0',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#001150',
            }
        }),
        option: (provided, state) => ({
            ...provided,
            fontFamily: 'Open Sans, sans-serif',
            fontSize: '14px',
            backgroundColor: state.isFocused ? '#f6f6f6' : '#ffffff',
            color: '#212121',
            '&:hover': {
                backgroundColor: '#001150', // Warna saat opsi di-hover
                color: 'white',
            },
        }),
    };

    return (
        <div>
            <div>
                <a href="https://docs.google.com/spreadsheets/d/1VUFj60738XxScGUpA2Igzu5BwWIgOvMmMlvK1d8_wEI/edit?usp=sharing" className='btn-add'>Open Spreadsheet</a>
                <br />
                <br />
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tanggal:</label>
                    <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Nama Driver:</label>
                    <Select
                        options={drivers} // Menggunakan data dari state
                        onChange={handleDriverChange} // Fungsi untuk menangani perubahan pilihan
                        isLoading={loading} // Menampilkan loading saat data di-fetch
                        placeholder="Pilih Nama Driver"
                        isClearable // Menambahkan opsi untuk menghapus pilihan
                        styles={customStyles} // Apply custom styles
                        name='nama-driver'
                    />
                </div>
                <div>
                    <br />
                    <label>Daftar Trip:</label>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 1'
                            name="trip1"
                            value={formData.trip1}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 2'
                            name="trip2"
                            value={formData.trip2}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 3'
                            name="trip3"
                            value={formData.trip3}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 4'
                            name="trip4"
                            value={formData.trip4}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 5'
                            name="trip5"
                            value={formData.trip5}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 6'
                            name="trip6"
                            value={formData.trip6}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 7'
                            name="trip7"
                            value={formData.trip7}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 8'
                            name="trip8"
                            value={formData.trip8}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 9'
                            name="trip9"
                            value={formData.trip9}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder='Trip 10'
                            name="trip10"
                            value={formData.trip10}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Button submit berubah tergantung state loading */}
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Mengirim...' : 'Kirim'}
                </button>

                {/* Menampilkan indikator loading tambahan */}
                {loading && <p>Loading... Mohon tunggu</p>}
            </form>
        </div>
    );
}