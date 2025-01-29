import React, { useEffect, useState } from 'react';
import Header from '../elements/Header';
import MainSection from '../elements/MainSection';
import AboutUs from '../elements/AboutUs';
import Materials from '../elements/Materials';

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <MainSection />
        <AboutUs />
        <Materials />
      </main>
    </>
  );
};

export default HomePage;