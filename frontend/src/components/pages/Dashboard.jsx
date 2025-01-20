import React, { useEffect, useState } from 'react';
import CheckAuthStatus from '../api/CheckAuthStatus';
import { Link, useNavigate } from 'react-router-dom';
import GetRecord from '../api/GetRecord';


const Dashboard = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutError, setLogoutError] = useState('')
  const navigate = useNavigate()
  const [companyVisible, setCompanyVisible] = useState(false)
  

  const handleAuthStatusChange = (status) => {
    setIsAuthenticated(status)
  }

  const clickLogoutButton = async () =>{
    setLogoutError('')
      try{
        const response = await fetch(
          '/auth/logout',
          {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
            },
            credentials: 'include',
          }
        )

        if(response.ok) {
          navigate('/login')
        } else {
          const errorResult = await response.json()
          setLogoutError(errorResult)
        }
      } catch(err) {
        setLogoutError('Ошибка соединения с сервером')
      }
  }

  const clickCompanyVisibleBtn = () => {
    setCompanyVisible(true)
    
  }


  return (
    <div>
      < CheckAuthStatus onAuthStatusChange={handleAuthStatusChange} /> 
      {isAuthenticated ? 
        <div className='dashboard_container'>
           <Link target="_blank" className='dashboard_link' to='/'>На сайт</Link>
          <div className='dashboard_panel'>
            <div className='dashboard_nav'>
              <h2>Управление записями</h2>
              <button className='dashboard_nav_btn'>Приемущества</button>
              <button onClick={clickCompanyVisibleBtn} className='dashboard_nav_btn'>Компания</button>
            </div>
            <button className='dashboard_btn' onClick={clickLogoutButton}>Выйти</button>
          </div>
          {/* <div className='dashboard_body'></div> */}
        </div>
       : 
        <div className='login_container'>
          <h2 className='login_container_title'>Для продолжения работы необходимо авторизоваться</h2>
          <Link to='/login'>К входу</Link>
        </div>
      }
    </div>
  );
};

export default Dashboard;