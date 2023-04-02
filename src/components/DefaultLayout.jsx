import React, { useEffect } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'
import axiosClient from '../axiosClient'
import { useAuthContext } from '../contexts/AuthContext'

export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken } = useAuthContext()

    const onLogOut = (event) => {
        event.preventDefault()
        axiosClient.post('/logout')
            .then(() => {
                setUser({})
                setToken(null)
            })
    }

    useEffect(() => {
        if (Object.keys(user).length === 0) {
            axiosClient.get('/user')
                .then(({ data }) => {
                    setUser(data)
                })
        }
    }, [])

    if (!token)
        return <Navigate to="/login" />
    else
        return (
            <>
                <div id="defaultLayout">
                    <aside>
                        <Link to="/dashboard">Dasboard</Link>
                        <Link to="/users">Users</Link>
                    </aside>

                    <div className="content">
                        <header>
                            <div>Header</div>
                            <div>
                                {user.name}
                                <a
                                    href="#"
                                    className='btn-logout'
                                    onClick={onLogOut}
                                >Log Out</a>
                            </div>
                        </header>

                        <main>
                            <Outlet />
                        </main>
                    </div>

                    {notification &&
                        <div className="notification">
                            {notification}
                        </div>
                    }
                </div>
            </>
        )
}
