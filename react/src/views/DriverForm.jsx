import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axiosClient from "../axios-client"
import { useStateContext } from "../contexts/ContextProvider"

export default function DriverForm() {

    const { id } = useParams()
    const navigate = useNavigate()
    const { setNotification } = useStateContext()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [driver, setDriver] = useState({
        id: null,
        name: '',
        nopol: '',
    })

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/drivers/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setDriver(data)
                }).catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault();
        if (driver.id) {
            axiosClient.put(`/drivers/${driver.id}`, driver)
                .then(() => {
                    setNotification("Driver was successfully updated.")
                    navigate('/drivers')
                })
                .catch(err => {
                    const response = err.response
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post('/drivers', driver)
                .then(() => {
                    setNotification("Driver was successfully created.")
                    navigate('/drivers')
                })
                .catch(err => {
                    const response = err.response
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    return (
        <>
            {driver.id && <h1>Update driver: {driver.name}</h1>}
            {!driver.id && <h1>New driver</h1>}
            <div className="card animated fadeInDown">
                {loading && (
                    <div className="text-center">Loading...</div>
                )}
                {errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                {!loading &&
                    <form onSubmit={onSubmit}>
                        <input
                            value={driver.name}
                            onChange={ev => setDriver({ ...driver, name: ev.target.value })}
                            placeholder="Name"
                        />
                        <input
                            value={driver.nopol}
                            onChange={ev => setDriver({ ...driver, nopol: ev.target.value })}
                            placeholder="Nomor Polisi"
                        />

                        <button className="btn">Save</button>
                    </form>
                }
            </div>
        </>
    )
}