import React, { useEffect, useState } from 'react';
import "../styles/dashboard.css"
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import config from '../amplifyconfiguration.json'; 
import { Amplify } from 'aws-amplify';
import im from '../images/loader.gif'
import { getUsers } from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import img from '../images/researchbridgelogo.png'
import { useNavigate } from 'react-router-dom';
Amplify.configure(config);
function Dashboard() {
  const client = generateClient()
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
   const handleSignOut=async () =>{
        try {
          await signOut().then(res=>{
          navigate('/')
          
          });
        } catch (error) {
          alert(error);
         
        }
      }
  const oneUser = async () => {
  
    try {
      const id= (await getCurrentUser()).userId
    
   // Get a specific item
await client.graphql({
  query: getUsers,
  variables: { id: id}
}).then(res=>{

  setUser(res.data.getUsers)})
    } catch (error) {
      alert(error)
    }
   
   // Get a specific item
   }
   const [greeting, setGreeting] = useState('');
   useEffect(()=>{
    oneUser()
 
  
  },[])
   useEffect(() => {
     const getGreeting = () => {
       const now = new Date();
       const hours = now.getHours();
       if (hours >= 0 && hours < 12) {
         return 'Good Morning';
       } else if (hours >= 12 && hours < 18) {
         return 'Good Afternoon';
       } else {
         return 'Good Evening';
       }
     };
 
     setGreeting(getGreeting());
   }, []);
 
  return (

    <div className="dashboard-container">
      <aside className="sidebar">
      <nav>
                  <img src={img} className="logo"/>
                </nav>
                <br></br>
                <br></br>
        <ul className="sidebar-nav">
          <li>Overview</li>
          <li>Analytics</li>
          <li>Users</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
            
               
          {
            user === null ? (<div className='' style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <img src={im} style={{objectFit:'contain',width:224,height:112}}/>
                      </div>):(<h1>{greeting},{user.name} </h1>)
          }
          
       
        </header>
        <div className="topbar-actions">
            <button>Notifications</button>
            <button style={{cursor:'pointer'}} onClick={()=>handleSignOut()}>Logout</button>
          </div>
          <br></br>
        <section className="cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>1,230</p>
          </div>
          <div className="card">
            <h3>Monthly Visits</h3>
            <p>23,400</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>$4,200</p>
          </div>
        </section>

        <section className="panel">
          <h2>Recent Activity</h2>
          <div className="activity-log">
            <p>User John uploaded a file</p>
            <p>System updated at 4:23 PM</p>
            <p>New user signed up</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

