import React, { useEffect, useState } from 'react';
import Header from '../elements/Header'
import Footer from '../elements/Footer';
import { Link } from 'react-router-dom';

const NoFound = () => {
  return (
    <div>
      <Header />
      <div className="container nofound">
        <h3>404</h3>
        <h2>Страница не найдена</h2>
        <Link to='/'>Вернуться на сайт</Link>       
      </div>
      <Footer />
    </div>
  );
};

export default NoFound;