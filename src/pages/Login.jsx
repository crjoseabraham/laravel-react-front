import { createRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useAuthContext } from "../contexts/AuthContext";

export default function Login() {
    const { setUser, setToken } = useAuthContext()
    const [errors, setErrors] = useState(null)
    const emailRef = createRef()
    const passwordRef = createRef()

    const onSubmit = (event) => {
        event.preventDefault()
        let payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }

        setErrors(null)

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response
                if (response && response.status === 422) {
                    if (response.data.errors)
                        setErrors(response.data.errors)
                    else
                        setErrors({
                            email: [response.data.message]
                        })
                }
            })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Log in to your account</h1>
                    {errors &&
                        <div className="alert">
                            {Object.keys(errors).map(key => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    }

                    <label htmlFor="email">Email</label>
                    <input ref={emailRef} type="email" name="email" id="email" placeholder="example@mail.com" />

                    <label htmlFor="password">Password</label>
                    <input ref={passwordRef} type="password" name="password" id="password" />
                    <button type="submit" className="btn btn-block">Log In</button>

                    <p className="message">
                        Not Registered? <Link to='/signup'>Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
