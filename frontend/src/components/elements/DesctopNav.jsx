import React, { useEffect, useState } from 'react';

const DesctopNav = () => {
  return (
    <nav className='nav'>
        <ul className='nav_decktop'>
        <li><a href="#about">О нас</a></li>
        <li><a href="#materials">Услуги</a></li>
        <li><a href="#">Бассейны</a></li>
        <li><a href="#">Контакты</a></li>
        </ul>
    </nav>
  );
};

export default DesctopNav;