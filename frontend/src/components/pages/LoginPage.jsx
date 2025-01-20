import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError ] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        const userData = {
            username,
            password,
        }

        try{
            const response = await fetch(
                '/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(userData),
                }
            )

            if (response.ok) {
                setSuccess(true)
                const result = await response.json()
                navigate('/dashboard')
            } else {
                const errorResult = await response.json()
                setError(errorResult.message || "Ошибка авторизации")
            }
        } catch(err) {
            setError('Ошибка соединения с сервером')
        }
    }

  return (
    <div className='login_container'>
        <h2 className='login_container_title'>Администрирование</h2>
        <h2 className='login_container_title'>Денса.рф</h2>
        <form className='login_container_form' onSubmit={handleSubmit}>
            {error && <p className='login_container_error'>{error}</p>}
            {success && <p>{success}</p>}
            <div className='login_container_form_container'>
                <label htmlFor="username">Имя:</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
            </div>
            <div className='login_container_form_container'>
                <label htmlFor="password">Пароль</label>
                <input 
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className='login_container_form_container'>
                <button
                    type="submit"
                >Войти
                </button>
            </div>
        </form>
    </div>
  );
};



export default LoginPage;