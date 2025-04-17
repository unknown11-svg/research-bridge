import { useNavigate } from 'react-router-dom';
import img from '../images/researchbridgelogo.png'
import im from '../images/loader.gif'
import { signIn} from 'aws-amplify/auth'
import React, { useState } from 'react'
import config from '../amplifyconfiguration.json'; 
import { Amplify } from 'aws-amplify';
Amplify.configure(config);
const LoginPage = () => {
  const navigate = useNavigate();
  const [password,setPassword] = useState('') 
  const [email,setEmail] = useState('') 
   const [showLod,setShowLod] = useState(false) 
   const [error,setError] = useState(false)
  const handleChangeEmail = (event) => {

    setEmail(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangePassword = (event) => {
  
     setPassword(event.target.value)
     ; // Set the value of email
    };
     
   
  const handleSignIn = async ()=> {
setShowLod(true)
    try {
       await signIn({username:email, password:password} ).then(async(res)=>{
      
      navigate('/dashboard')
       setShowLod(false)
       
      });
    } catch (error) {
    
      setError(error.message)
      alert(error.message)
        setShowLod(false)
    }
  }

  return (
    <>
         <head>
          <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
        </head>
            <nav>
              <img src={img} className="logo"/>
              <ul className="logo">
              <li ><a href='/'>Home</a></li>
                <li><a href='/signup' >Sign up</a></li>
                <li><a className='active'>Login</a></li>
              </ul>
            </nav>
    <section className="login-container">
      <div className="wits-login-notice">
        <p>Please sign in with your Wits student email (@students.wits.ac.za)</p>
      </div>
    
  

        <div className="form-group">
          <label>Wits Student Email</label>
          <input
            type="email"
            name="email"
       value={email}
       onChange={handleChangeEmail}
            required
            placeholder="user@students.wits.ac.za"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
         value={password}
         onChange={handleChangePassword}
            required
            minLength="8"
          />
        </div>

    


     

        {
            showLod ? (<div className='' style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src={im} style={{objectFit:'contain',width:224,height:112}}/>
          </div>):(null)
          }

        <button onClick={()=>handleSignIn()} className="submit-btn">
          Login
        </button>
       
      <br></br>
   
    </section>
    </>
  );
};

export default LoginPage;