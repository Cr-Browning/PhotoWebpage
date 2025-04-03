import React from 'react';
import './styles/App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Gallery />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
