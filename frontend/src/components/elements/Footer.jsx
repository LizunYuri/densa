import React, { useEffect, useState } from 'react';
import { FaTelegramPlane, FaVk, FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";
import { Link } from 'react-router-dom';
import ScrollToTop from '../UX/ScrollToTop';


const Footer = () => {

    const [company, setCompany] = useState('')
    const currentYear = new Date().getFullYear();
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
    <footer>
        <div className="container footer_container">
            <div className="footer_left">
                <a className='footer_logo' href="https://денса.рф">
                    <img src="./image/logo/logogold.png" alt="Денса" />
                </a>
                <Link to='/politic'>Политика конфеденциальности</Link>
                <ScrollToTop />
            </div>
            <div className="footer_line"></div>
            <div className="footer_right">
                <div className="footer_contacts">
                    <a className='footer_phone' href={"tel:" + company.phone1}><FiPhone /><span>{company.phone1}</span></a>          
                    <div className="footer_links">
                        {company.whatsap ? <a className='header_nav_links margin30'  href={company.whatsap}><FaWhatsapp /></a> : <p></p>}
                        {company.vk ? <a className='header_nav_links margin30'  href={company.vk}><FaVk /></a> : <p></p>}
                        {company.telegram ? <a className='header_nav_links margin30' href={company.telegram}><FaTelegramPlane /></a> : <p></p>}  
                    </div>
                    </div>
                <div className="footer_address">
                    {company.address ? <p>Наш адрес: {company.address} </p> : <p></p>}
                    {company.legal_name ? <p> {company.legal_name} </p> : <p></p>}
                    {company.tin ? <p>ИНН: {company.tin}</p> : <p></p>}
                </div>
                <div className="footer_mail">
                    <a href={"mailto:" + company.email}><FiMail /> <span>{company.email}</span></a>
                </div>
                <div className="copyright">
                    <p className="company">&copy; {currentYear} Денса</p>
                    <a target='blank' href="https://build-root.ru">Разработано "build-root" </a>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;