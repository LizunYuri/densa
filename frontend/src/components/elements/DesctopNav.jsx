import React, { useEffect, useState } from 'react';

const DesctopNav = ({onDataChange, isOpenBurger}) => {


  const clickItem = () => {
    if(isOpenBurger) {
      var status = false

      onDataChange(status)
    } else{
      return
    }

    
  }


  return (
    <nav className='nav'>
        <ul className='nav_decktop'>
        <li><a onClick={clickItem} href="#about">О нас</a></li>
        <li><a onClick={clickItem} href="#materials">Услуги</a></li>
        <li><a onClick={clickItem} href="#gallery">Бассейны</a></li>
        <li><a onClick={clickItem} href="#contacts">Контакты</a></li>
        </ul>
    </nav>
  );
};

export default DesctopNav;