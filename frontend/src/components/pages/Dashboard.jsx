import React, { useEffect, useState, useRef } from 'react';
import CheckAuthStatus from '../api/CheckAuthStatus';
import { Link, useNavigate } from 'react-router-dom';
import GetRecord from '../api/GetRecord';
import { FaWindowClose } from "react-icons/fa";
import AboutsUploadWindow from '../api/AboutsUploadWindow';



const Dashboard = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoutError, setLogoutError] = useState('')
  const navigate = useNavigate()
  const [recordsFirstscreen, setRecordsFirstscreen] = useState(false)
  const [recordAbout, setRecordAbout] = useState(false)
  const [aboutListVisible, setAboutListVisible] = useState(false)
  const [aboutListItemVisible, setAboutItemVisible] = useState(false)
  const containerRef = useRef(null)



  const addStylesWithDelay = () => {
      if (containerRef.current) {
        const children = containerRef.current.children; 
        let index = 0;

        const applyStyle = () => {
          if (index < children.length) {
            children[index].style.left = '0';
            children[index].style.opacity = '1';
            index++;
            setTimeout(applyStyle, 200); 
          }
        };


        applyStyle();
      }
  };

  const removeStylesWithDelay = () => {
    if (containerRef.current) {
      const children = containerRef.current.children; 
      let index = 0;

      const removeStyle = () => {
        if (index < children.length) {
          children[index].style.left = '-100%';
          children[index].style.opacity = '0';
          index++;
          setTimeout(removeStyle, 200); 
        }
      };

      removeStyle();
    }
};

  const recordFirstScreenVisible = () => {
    setRecordsFirstscreen((prev) => !prev)
    setRecordAbout(false)
    removeStylesWithDelay()
    setTimeout(() =>{
      setAboutListVisible(false)
      setRecordAbout(false)
    }, 800)

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
    setAboutItemVisible(false)
    
  }

  const clickToVisibleSubMenuAbout = () => {

    if(!recordAbout){
      setRecordAbout(true)
      setRecordsFirstscreen(false)
      setTimeout(() =>{
        setAboutListVisible(true)
      }, 200)
      setTimeout(() => {
        addStylesWithDelay()
      }, 500)
    } else{
      removeStylesWithDelay()
      setTimeout(() =>{
        setAboutListVisible(false)
        setRecordAbout(false)
      }, 800)
      
    }
    
    


  }

  const aboutListVisibleFunction = () => {
    setAboutItemVisible((prev) => !prev)
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
              <button onClick={clickToVisibleSubMenuAbout} className={`dashboard_nav_btn ${recordAbout ? 'dashboard_visible_btn_active' : ''}`}>Блок "О нас"</button>
                <ul className={`list nav_list ${aboutListVisible ? 'nav_list_visible' : ''}`}>
                  <div ref={containerRef} className="nav_list_content">
                    <li className="nav_list_item">Партнеры</li>
                    <li onClick={aboutListVisibleFunction} className="nav_list_item">Преимущества</li>
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
          <div className={`dashboard_body ${aboutListItemVisible ? 'dashboard_visible' : ''}`}>
            <FaWindowClose onClick={clickClosedModalBtn} className='closed_btn_modal' />
            <AboutsUploadWindow />
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