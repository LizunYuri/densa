import React, { useEffect, useState } from 'react';

const CheckAuthStatus = ({onAuthStatusChange}) => {

      const [isAuth, setIsAuth] = useState(null)
      const [error, setError] = useState('')
    
      useEffect(() => {


        const checkAuthStatus = async () => {
          try{
            const response = await fetch('/auth/protected',
              {
                'method' : 'GET',
                headers : {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
              }
            )
    
            if (response.ok) {
              const result = await response.json()
              setIsAuth(result.isAuth)
              onAuthStatusChange(result.isAuth)
            } else {
              setIsAuth(false)
              onAuthStatusChange(false)
            }
          } catch (err) {
            setError('Ошибка соединения с сервером')
            setIsAuth(false)
            onAuthStatusChange(false)
          }
        }
        checkAuthStatus()
      }, [])
};

export default CheckAuthStatus;