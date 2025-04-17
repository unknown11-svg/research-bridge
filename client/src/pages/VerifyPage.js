import { useNavigate } from 'react-router-dom';
import img from '../images/researchbridgelogo.png'
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import React, { useState } from 'react'
import im from '../images/loader.gif'
import config from '../amplifyconfiguration.json'; 
import { Amplify } from 'aws-amplify';
Amplify.configure(config);
const VerifyPage = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const username = params.get('e');
    const [code,setCode] = useState('') 
    const [error,setError] = useState(false)
     const [showLod,setShowLod] = useState(false) 
   const handleResendCode = async ()=>{
     try {
       await resendSignUpCode({username:username}).then(res=>{
         //alert(res)
       })
     } catch (error) {
       setError(error.message)
       alert(error.message)
      
     }
   }
    const handleChangeCode = (event) => {
    
     setCode(event.target.value)
     ; // Set the value of email
    };
    const handleSignUpConfirmation = async ()=> {
 
     setShowLod(true)
     try {
        await confirmSignUp({
         username:username,
         confirmationCode:code,
       }).then(res=>{
           setShowLod(false)
           navigate('/login')
     })
       }
      catch (error) {
       setShowLod(false)
       setError(error.message)
       alert(error.message)
  
       
     }
   }
  return (
    <>
         <head>
          <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
        </head>
            <nav>
              <img src={img} className="logo"/>
            </nav>
    <section className="login-container">
      <div className="wits-login-notice">
        <p>Please enter verification code below</p>
      </div>
   
  

        <div className="form-group">
          <label>Verification Code</label>
          <input
            type="text"
            name="code"
       value={code}
       onChange={handleChangeCode}
            required
            placeholder="verification code"
          />
        </div>

       
  {
      showLod ? (<div className='' style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src={im} style={{objectFit:'contain',width:224,height:112}}/>
    </div>):(null)
    }
        <button onClick={()=>handleSignUpConfirmation()} className="submit-btn">
          Verify
        </button>
        <br>

        </br>
        <button onClick={()=>handleResendCode()}><p style={{color:'cornflowerblue',fontWeight:'bolder'}}>Resend</p></button>
  
      <br></br>
    
    </section>
    </>
  );
};

export default VerifyPage;