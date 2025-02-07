import React, { useEffect, useState } from 'react';
import Header from '../elements/Header';
import MainSection from '../elements/MainSection';
import AboutUs from '../elements/AboutUs';
import Materials from '../elements/Materials'
import LidGen from '../elements/LigGen'
import Gallery from '../elements/Gallery';
import Contacts from '../elements/Contacts';
import Footer from '../elements/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <MainSection />
        <AboutUs />
        <Materials />
        <LidGen />
        <Gallery />
        <Contacts />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;