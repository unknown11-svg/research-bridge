import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../images/researchbridgelogo.png'
import im from '../images/loader.gif'
import "../styles/signup.css"
import config from '../amplifyconfiguration.json'; 
import { Amplify } from 'aws-amplify';
import { signUp } from 'aws-amplify/auth';
import { createUsers } from '../graphql/mutations';
import { generateClient } from "aws-amplify/api";
Amplify.configure(config);

 
const SignupPage = () => {
  const client = generateClient()
  const navigate = useNavigate();
  const [password,setPassword] = useState('') 
  const [role,setRole] = useState('') 
  const [name,setName] = useState('')
  const [surname,setSurname] = useState('')
  const [department,setDepartment] = useState('')
  const [phone,setPhone] = useState('')
  const [academicrole,setacademicrole] = useState('')
  const [area,setarea] = useState('')
  const [experience,setExperience] = useState('')
  const [email,setEmail] = useState('') 
  const [spechr,setSpechr] = useState(false) 
  const [cletter,setCletter] = useState(false) 
  const [smletter,setSmletter] = useState(false) 
  const [number,setNumber] = useState(false) 
  const [min,setMin] = useState(false) 
  const [showLod,setShowLod] = useState(false) 
  const [error,setError] = useState(false)
  const handleChangeRole = (event) => {
 
    setRole(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangeName = (event) => {
 
    setName(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangeSurname = (event) => {
 
    setSurname(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangeDepartment = (event) => {
 
    setDepartment(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangePhone = (event) => {
 
    setPhone(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangeacademicrole = (event) => {
 
    setacademicrole(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangearea = (event) => {
 
    setarea(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangeExperience = (event) => {
 
    setExperience(event.target.value)
   
    ; // Set the value of email
   };
  const handleChangeEmail = (event) => {
 
    setEmail(event.target.value)
   
    ; // Set the value of email
   };
   const handleChangePassword = (event) => {
  
     setPassword(event.target.value)
     setSpechr(/[!@#$%^&*(),.?":{}|<>]/.test(event.target.value))
     setCletter(/[A-Z]/.test(event.target.value))
     setSmletter(/[a-z]/.test(event.target.value))
     setNumber(/\d/.test(event.target.value))
     setMin(event.target.value.length >= 8)
     ; // Set the value of email
    };

    async function newUsers(){
      setShowLod(true)
      
      try {
        await signUp({
          username: email,
          password: password,
          
          options: {
           userAttributes: {
             email:email,
           },
          
         }
         }).then(async(res)=>{
          try {
           await client.graphql({
              query: createUsers,
              variables: {
                  input: {
                    "id": res.userId,
              "name": name,
              "surname": surname,
              "email": email,
              "role": role,
              "phone": phone,
              "department": department,
              "academicrole": academicrole,
              "researcharea": area,
              "experience": experience
            }
              }
          }).then((res)=>{
            setShowLod(false)
            navigate('/verify?e='+email)
          })
          } catch (error) {
            setShowLod(false)
            setError(error.message)
            alert(error.message)
          }
         
         })
        
      } catch (error) {
        setShowLod(false)
        setError(error)
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
          <ul className="logo">
          <li ><a href='/'>Home</a></li>
            <li><a className='active'>Sign up</a></li>
            <li><a href='/login'>Login</a></li>
          </ul>
        </nav>
    <section className="signup-container">
  
    

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={role}
            onChange={handleChangeRole}
            required
          >
            <option value="Researcher">Researcher</option>
            <option value="Admin">Admin</option>
            <option value="Reviewer">Reviewer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChangeName}
            required
          />
        </div>

        <div className="form-group">
          <label>Surname</label>
          <input
            type="text"
            name="surname"
            value={surname}
            onChange={handleChangeSurname}
            required
          />
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
          {
      password===null || password===''? (null):(
        !spechr ? (<h6 style={{color:'red',fontSize:12}}> Password must have a special character (!@#$%^&*(),.?":{}|)</h6>):(null)
      )
    }
    {
      password===null || password===''? (null):(
        !cletter ? (<h6 style={{color:'red',fontSize:12}}> Password must have a capital letter</h6>):(null)
      )
    }
    {
      password===null || password===''? (null):(
        !smletter ? (<h6 style={{color:'red',fontSize:12}}> Password must have a small letter</h6>):(null)
      )
    }
    {
      password===null || password===''? (null):(
        !number ? (<h6 style={{color:'red',fontSize:12}}> Password must have a number</h6>):(null)
      )
    }
    {
      password===null || password===''? (null):(
        !min ? (<h6 style={{color:'red',fontSize:12}}> Password must have a minimum length of 8</h6>):(null)
      )
    }
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNo"
            value={phone}
            onChange={handleChangePhone}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={department}
            onChange={handleChangeDepartment}
            required
          />
        </div>

        <div className="form-group">
          <label>Academic Role</label>
          <select
            name="academicRole"
            value={academicrole}
            onChange={handleChangeacademicrole}
            required
          >
            <option value="Student">Student</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Academic Researcher">Academic Researcher</option>
          </select>
        </div>

        <div className="form-group">
          <label>Research Area</label>
          <input
            type="text"
            name="department"
            value={area}
            onChange={handleChangearea}
            required
          />
        </div>
        <div className="form-group">
          <label>Experience</label>
          <select
            name="academicRole"
            value={experience}
            onChange={handleChangeExperience}
            required
          >
            <option value="Student">Bachelor</option>
            <option value="Lecturer">Honours</option>
          </select>
        </div>
        {
      showLod ? (<div className='' style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img src={im} style={{objectFit:'contain',width:224,height:112}}/>
    </div>):(null)
    }
        <button onClick={newUsers} className="submit-btn">
          Sign up
        </button>
 
    </section>
    </>
  );
};

export default SignupPage;