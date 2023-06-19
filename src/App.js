import './App.css';
import React, { useEffect, useState } from "react";
import StartScreen from './Components/StartScreen/StartScreen';
import Home from './Components/Home/Home';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar';
import Details from './Components/Details/Details';
import Cart from './Components/Cart/Cart';
import jwtDecode from 'jwt-decode'
import Signup from './Components/SignUp/SignUp.jsx';
import Login from './Components/Login/Login.jsx'
import {baseURL, BEARERKEY, config} from './index.js'
import axios from 'axios';
import Profile from './Components/Profile/Profile.jsx';


// import { Provider } from 'react-redux';
// import { CartStore } from './Components/Redux/CartStore.js';

function App() {
  // Cart
  const [cart, setCart] = useState([]);
  const getCart = async() => {
    const result = await axios.get(`${baseURL}/cart`,config).catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
    })
    //console.log(result)
    if (result?.data?.message == "done") {
        setCart(result?.data?.cart)
    } 
  }
  //End of Cart

  function ProtectedRoute(props) {
      if (localStorage.getItem("token")) {
          return props.children;
      }
      else {
          return <Navigate to='/login' />
      }
  }
  function ProtectedLogin(props) {
      if (!(localStorage.getItem("token"))) {
          return props.children;
      }
      else {
          return <Navigate to='/home' />
      }
  }
  let navigate = useNavigate();
  const [crrUser, setCrrrUser] = useState(null);
  
  async function currentUser() {
      const config = {
          headers:{
            authorization: BEARERKEY+localStorage.getItem("token"),
          }
        };
      let result = await axios.get(`${baseURL}/user/profile`,config).catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
        if(result?.data?.message == "done"){
          setCrrrUser(result.data.user);
          }else{
              //window.alert("Failed to get profile data")
          }
      
  }
  async function removeUser() {
      const config = {
          headers:{
            authorization: BEARERKEY+localStorage.getItem("token"),
          }
        };
      let result = await axios.get(`${baseURL}/user/signout`,config).catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
        if(result?.data?.message == "done"){
          localStorage.removeItem("token");
          navigate('/login');
          setCrrrUser(null);
        }else{
          alert("Failed to log out")
        }
        
  }
  useEffect(() => {
      if (localStorage.getItem("token")) {
          currentUser();
      }
      else {
          removeUser();
          //setCrrrUser(null);
      }
  }, [])
  return <>

      {/* <Provider store={CartStore}> */}

      <Navbar currentUser={crrUser} removeUser = {removeUser} cart={ cart } />
      {
          crrUser? 
          <Cart cart = {cart} getCart = {getCart} setCart = {setCart}/>
          :
          ''
      }
      <Routes>

          <Route path='' element={<StartScreen />} />
          <Route path='home' element={<Home />} />
          <Route path='profile' element={<Profile/>}/>
          <Route path='details/:slug/:id' element={<Details currentUser = {crrUser} getCart = {getCart} />} />
          <Route path='login' element={ <Login currentUser={currentUser} /> } />
          <Route path='signup' element={ <Signup /> } />

      </Routes>

      {/* </Provider> */}

  </>
}

export default App;
