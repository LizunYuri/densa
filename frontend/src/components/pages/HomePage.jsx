import React, { useEffect, useState } from 'react';
import Header from '../elements/Header';
import MainSection from '../elements/MainSection';
import AboutUs from '../elements/AboutUs';

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <MainSection />
        <AboutUs />
      </main>
    </>
  );
};

export default HomePage;