import React from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../images/researchbridgelogo.png'
import "../styles/homepage.css"


const Homepage = () => {
  const navigate = useNavigate();

  return (
  <>
  <head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
</head>
    <nav>
      <img src={img} className="logo"/>
      <ul className="logo">
      <li ><a className='active'>Home</a></li>
        <li><a href='/signup'>Sign up</a></li>
        <li><a href='/login'>Login</a></li>
      </ul>
    </nav>
    
    <section className="hero">
        <h1 className="hero-title">
          Connect with researchers and scientific knowledge
        </h1>
        <p className="hero-subtitle">
          Discover publications, ask questions, and find collaborators.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={()=>navigate('/signup')}>Join Now</button>
          <button className="btn btn-outline">Learn More</button>
        </div>
      </section>

     
  </>
  );
};

export default Homepage;