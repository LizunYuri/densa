import React, { useEffect, useState } from 'react';
import { FiPhone, FiMail } from "react-icons/fi";
import DesctopNav from './DesctopNav';
import { FaTelegramPlane, FaVk, FaWhatsapp } from "react-icons/fa";


const Header = () => {

  const [company, setCompany] = useState('')
  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false)
  const [centerLineVisible, setCenterLineVisible]  = useState(false)
  const [topLiveVisible, setTopLineVisible]  = useState(false)
  const [isVisibleTabletMenu, setIsVisibleTabletMenu] = useState(false)
  const [isVisibleItems, setIsVisibleItems] = useState(false)

  const toggleBurgerMenu = () => {
    setIsOpenBurgerMenu((prev) => !prev)
    setCenterLineVisible((prev) => !prev)

    setTimeout(() => {
      setTopLineVisible((prev) => !prev)
      setIsVisibleTabletMenu((prev) => !prev)
    }, 500)

    if(setIsVisibleTabletMenu){
      setTimeout(() => {
        setIsVisibleItems(true)
      }, 300)
    } else{
      setTimeout(() => {
        setIsVisibleItems(false)
      }, 100)
    }
  }

  const companyData = (data) => ({
    'id' : data.id || null,
    'name' : data.name || null,
    'phone1' :data.phone1 || null,
    'phone2' : data.phone2 || null,
    'email' : data.email || null,
    'address' : data.address || null,
    'tin' : data.tin || null,
    'legal_name' : data.legal_name || null,
    'whatsap' : data.whatsap || null,
    'telegram' : data.telegram || null,
    'vk' : data.vk|| null
  })

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await fetch('/api/company')
        if(response.ok) {
          const result = await response.json()
          setCompany(companyData(result))
        } else{
          console.error("Ошибка загрузки данных компании")
        }
      } catch(err) {
        console.error('Ошибка загрузки данных', err)
      }
    }
    fetchData()
  }, [])

  return (
    <header className='header'>
          <div className="container header_block_top header_desktop">
            <div className="header_block_top_left">
              <div className="header_block_top_left_one">
                <a href={"tel:" + company.phone1}><FiPhone /> <span>{company.phone1}</span></a>
                <div className='header_block_social'>
                  {company.whatsap ? <a href={company.whatsap}>whatsApp</a> : <p></p>}
                  {company.vk ? <a href={company.vk}>vk</a> : <p></p>}
                  {company.telegram ? <a href={company.telegram}>telegram</a> : <p></p>}  
                </div>
              </div>
              <div className="header_block_top_left_one">
                { company.phone2 ? 
                  <a href={"tel:" + company.phone2}><FiPhone /> <span>{company.phone2}</span></a>
                  :
                  <div></div>
                }
              </div>
            </div>
            <div className="header_block_top_center">
              <a href="https://денса.рф">
                <img src="./image/logo/logogold.png" alt="https://денса.рф" />
              </a>
            </div>
            <div className="header_block_top_right">
              <div className="header_block_top_left_one">
                  <a href={"mailto:" + company.email}><FiMail /> <span>{company.email}</span></a>
                  <div className='header_block_social'>
                    <button className='header_block_social_btn'>Получить смету</button>
                  </div>
              </div>
            
            </div>
          </div>
          <div className="container header_block_bottom header_desktop">
            <DesctopNav />
          </div>
          
          <div className="container header_block_top header_tablet">
            <div className="header_block_top_center">
              <a href="https://денса.рф">
                <img src="./image/logo/logogold.png" alt="https://денса.рф" />
              </a>
              
              <div className="header_block_top_right">
                <p className="transition">Меню</p>
                <div onClick={toggleBurgerMenu}  className="toggle animated_toggle">
                  <div className={`toggle_line
                                animated_toggle_line
                                animated_toggle_line_top
                                transition
                                ${topLiveVisible ? 'is-visible-top' : 'not-visible-top'}
                                `}></div>
                  <div 
                    className={`toggle_line
                                animated_toggle_line
                                transition
                                ${centerLineVisible ? 'is-visible-left' : 'not-visible-left'}
                                `}></div>
                  <div className={`
                                  toggle_line 
                                  animated_toggle_line 
                                  animated_toggle_line_bottom
                                  transition
                                  ${topLiveVisible ? 'is-visible-button' : 'not-visible-bottom'}`}></div>
                </div>

                <div className={`header_nav_mobil ${isVisibleTabletMenu ? 'is_header-visible' : ''}`}>
                  {isVisibleItems ?  <DesctopNav /> : <div></div>}
                  {isVisibleItems ?  
                    <div className="header_links">
                      <a href={"mailto:" + company.email}><FiMail /> <span>{company.email}</span></a>
                      <div className='header_block_social'>
                        {company.whatsap ? <a className='header_nav_links'  href={company.whatsap}><FaWhatsapp /></a> : <p></p>}
                        {company.vk ? <a className='header_nav_links'  href={company.vk}><FaVk /></a> : <p></p>}
                        {company.telegram ? <a className='header_nav_links' href={company.telegram}><FaTelegramPlane /></a> : <p></p>}  
                      </div>
                    </div>
                   : <div></div>}
                </div>
              </div>
            </div>
            <div className="header_block_top_left">
              <div className="header_block_top_left_one">
                <a href={"tel:" + company.phone1}><FiPhone /> <span>{company.phone1}</span></a>
                <div className='header_block_social header_reverse'>
                  {company.whatsap ? <a href={company.whatsap}>whatsApp</a> : <p></p>}
                  {company.vk ? <a href={company.vk}>vk</a> : <p></p>}
                  {company.telegram ? <a href={company.telegram}>telegram</a> : <p></p>}  
                </div>
              </div>
              <div className="header_block_top_left_one">
                { company.phone2 ? 
                  <a href={"tel:" + company.phone2}><FiPhone /> <span>{company.phone2}</span></a>
                  :
                  <div></div>
                }
                <div className='header_block_social'>
                  <button className='header_block_social_btn'>Получить смету</button>
                </div>
              </div>
            </div>
          </div>
    </header>
  );
};

export default Header;