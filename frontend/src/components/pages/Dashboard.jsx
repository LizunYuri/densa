import React, { useEffect, useState } from 'react';
import CheckAuthStatus from '../api/CheckAuthStatus';
import { Link, useNavigate } from 'react-router-dom';
import GetRecord from '../api/GetRecord';
import { FaWindowClose } from "react-icons/fa";



const Dashboard = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutError, setLogoutError] = useState('')
  const navigate = useNavigate()
  const [recordsFirstscreen, setRecordsFirstscreen] = useState(false)
  const [recordAbout, setRecordAbout] = useState(false)
  
  const recordFirstScreenVisible = () => {
    setRecordsFirstscreen((prev) => !prev)
  }

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

  const clickClosedModalBtn = () => {
    setRecordsFirstscreen(false)
    
  }





  return (
    <div>
      {/* < CheckAuthStatus onAuthStatusChange={handleAuthStatusChange} /> 
      {isAuthenticated ?  */}
        <div className='dashboard_container'>
           <Link target="_blank" className='dashboard_link' to='/'>На сайт</Link>
          <div className='dashboard_panel'>
            <div className='dashboard_nav'>
              <h2>Управление записями</h2>
              <button onClick={recordFirstScreenVisible} className={`dashboard_nav_btn ${recordsFirstscreen ? 'dashboard_visible_btn_active' : ''}`}>Блок "Первого экрана"</button>
              <button onClick={recordFirstScreenVisible} className={`dashboard_nav_btn ${recordsFirstscreen ? 'dashboard_visible_btn_active' : ''}`}>Блок "О нас"</button>
                <ul className='list nav_list'>
                  <div className="nav_list_content">
                    <li>Партнеры</li>
                    <li>Преимущества</li>
                  </div>
                </ul>
              
              <button className='dashboard_nav_btn'>Компания</button>
            </div>
            <button className='dashboard_btn' onClick={clickLogoutButton}>Выйти</button>
          </div>
          <div className={`dashboard_body ${recordsFirstscreen ? 'dashboard_visible' : ''}`}>
            <FaWindowClose onClick={clickClosedModalBtn} className='closed_btn_modal' />
            <GetRecord />
          </div>
        </div>
       {/* : 
        <div className='login_container'>
          <h2 className='login_container_title'>Для продолжения работы необходимо авторизоваться</h2>
          <div className='login_container_form_container'>
            <Link className='login_btn' to='/login'>К входу</Link>
          </div>
        </div>
      } */}
    </div>
  );
};

export default Dashboard;