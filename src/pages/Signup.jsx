import { Link } from 'react-router-dom'
import { createRef, useState } from 'react'
import axiosClient from '../axiosClient'
import { useAuthContext } from '../contexts/AuthContext'

export default function Signup() {
    const { setUser, setToken } = useAuthContext()
    const [errors, setErrors] = useState(null)
    const nameRef = createRef()
    const emailRef = createRef()
    const passwordRef = createRef()
    const passwordConfirmationRef = createRef()

    const onSubmit = (event) => {
        event.preventDefault()
        let payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        }

        axiosClient.post('/signup', payload)
            .then(({ data }) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Create a free account</h1>
                    {errors &&
                        <div className="alert">
                            {Object.keys(errors).map(key => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    }

                    <label htmlFor="name">Name</label>
                    <input ref={nameRef} type="text" name="name" id="name" placeholder="Full name" />

                    <label htmlFor="email">Email</label>
                    <input ref={emailRef} type="email" name="email" id="email" placeholder="example@mail.com" />

                    <label htmlFor="password">Password</label>
                    <input ref={passwordRef} type="password" name="password" id="password" />

                    <label htmlFor="password_confirmation">Confirm your password</label>
                    <input ref={passwordConfirmationRef} type="password" name="password_confirmation" id="password_confirmation" />

                    <button type="submit" className="btn btn-block">Sign Up</button>
                    <p className="message">
                        Already have an account? <Link to='/login'>Sign in!</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
