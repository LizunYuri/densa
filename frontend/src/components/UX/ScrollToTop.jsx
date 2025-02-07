import React, { useEffect, useState } from 'react';

const ScrollToTop = () => {

    const scroll = () => {
        window.scrollTo({
        top: 0,
        behavior: 'smooth',
        });
    }


  return (
    <button onClick={scroll} className='scroll_to_top'>
        Вверх
    </button>
  );
};

export default ScrollToTop;


