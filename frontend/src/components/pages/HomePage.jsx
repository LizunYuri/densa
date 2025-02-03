import React, { useEffect, useState } from 'react';
import Header from '../elements/Header';
import MainSection from '../elements/MainSection';
import AboutUs from '../elements/AboutUs';
import Materials from '../elements/Materials'
import LidGen from '../elements/LigGen'

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <MainSection />
        <AboutUs />
        <Materials />
        <LidGen />
      </main>
    </>
  );
};

export default HomePage;