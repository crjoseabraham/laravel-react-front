import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axiosClient"
import { useAuthContext } from "../contexts/AuthContext"

export default function UserForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { setNotification } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setUser(data.data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault()
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User updated susccessfully')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post(`/users`, user)
                .then(() => {
                    setNotification('User created susccessfully')
                    navigate('/users')
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
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
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
                        <label htmlFor="name">Name</label>
                        <input value={user.name} type="text" name="name" id="name" placeholder="Full name" onChange={ev => setUser({ ...user, name: ev.target.value })} />

                        <label htmlFor="email">Email</label>
                        <input value={user.email} type="email" name="email" id="email" placeholder="example@mail.com" onChange={ev => setUser({ ...user, email: ev.target.value })} />

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" onChange={ev => setUser({ ...user, password: ev.target.value })} />

                        <label htmlFor="password_confirmation">Confirm your password</label>
                        <input type="password" name="password_confirmation" id="password_confirmation" onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} />

                        <button type="submit" className="btn">Save changes</button>
                    </form>
                }
            </div>
        </>
    )
}
