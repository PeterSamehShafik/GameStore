import './App.css';
import React, { useEffect, useState } from "react";
import StartScreen from './Components/StartScreen/StartScreen';
import Home from './Components/Home/Home';
import { Routes, Route, useNavigate, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar';
import Details from './Components/Details/Details';
import Cart from './Components/Cart/Cart';
import Signup from './Components/SignUp/SignUp.jsx';
import Login from './Components/Login/Login.jsx'
import { baseURL, BEARERKEY } from './index.js'
import axios from 'axios';
import Profile from './Components/Profile/Profile.jsx';
import Wishlist from './Components/Profile/Wishlist.jsx';
import Info from './Components/Profile/Info.jsx';
import Followers from './Components/Profile/Followers.jsx';
import Games from './Components/Profile/Games.jsx';
import Activity from './Components/Profile/Activity.jsx';
import CPanel from './CPanel/CPanel.jsx';
import CPNav from './CPanel/CPNav/CPNav.jsx';
import GameControl from './CPanel/GameControl/GameControl.jsx';
import UserControl from './CPanel/UserControl/UserControl.jsx';
import { AnimatePresence } from "framer-motion";

//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


// import { Provider } from 'react-redux';
// import { CartStore } from './Components/Redux/CartStore.js';
import GenreControl from './CPanel/GenreControl/GenreControl';
import NotFound from './Components/NotFound/NotFound.jsx';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword.jsx';
import GoogleOauth from './utilities/GoogleOauth.jsx';
import MySupport from './CPanel/MySupport/MySupport.jsx';

function App() {
  const location = useLocation()

  //modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    header: "",
    body: "",
    isMainBtn: true,
  });
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const callModal = ({
    header = "Are you sure?",
    body,
    closeBtnColor = "secondary",
    closeBtnTxt = "Close",
    mainBtnColor = "primary",
    mainBtnTxt,
    mainBtnFunc,
    isMainBtn = true,
    isCloseBtn = true,
    isStatic = false,
  } = {}) => {
    setModalData({
      ...modalData,
      header,
      body,
      closeBtnColor,
      closeBtnTxt,
      mainBtnColor,
      mainBtnTxt,
      mainBtnFunc,
      isMainBtn,
      isCloseBtn,
      isStatic,
    });
    handleShowModal();
  };
  const applyCloseModel = () => {
    modalData.mainBtnFunc();
    handleCloseModal();
  };
  //end of modal


  //scroll to top
  function returnToTop() {
    // setIsTopBtn(false)
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  const handleVisibleButton = () => {

    if (window.pageYOffset > 10) {
      document.getElementById("toTop")?.classList.remove("d-none")
    } else if (window.pageYOffset < 10) {
      document.getElementById("toTop")?.classList.add("d-none")

    }
  };
  // end of scroll to top


  // Cart
  const [cart, setCart] = useState([]);
  const getCart = async () => {
    if (localStorage.getItem("token")) {
      const config = {
        headers: {
          authorization: BEARERKEY + localStorage.getItem("token"),
        },
      };
      const result = await axios.get(`${baseURL}/cart`, config).catch(function (error) {
        if (error.response) {
          //console.log(error.response);
        }
      })

      // console.log(result)
      if (result?.data?.message == "done") {
        setCart(result?.data?.cart)
      }
    }
  }
  //End of Cart

  // Notification
  const [notifyCount, setNotifyCount] = useState(0);
  const getNotifyCount = async () => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .get(`${baseURL}/user/notifyCount`, config)
      .catch((e) => console.log(e));
    if (result?.data?.message === "done") {
      setNotifyCount(result.data.notifyCount);
    }
  };


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
  const [crrUser, setCrrUser] = useState(null);
  async function currentUser() {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      }
    };
    let result = await axios.get(`${baseURL}/user/profile`, config).catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
    });
    if (result?.data?.message == "done") {
      setCrrUser(result.data.user);
      getNotifyCount();
    } else {
      localStorage.removeItem("token");
      setCrrUser(null);
    }

  }
  async function removeUser() {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      }
    };
    let result = await axios.get(`${baseURL}/user/signout`, config).catch(function (error) {
      if (error.response) {
        console.log(error.response);
      }
    });
    if (result?.data?.message == "done") {
      sessionStorage.removeItem("new");
      localStorage.removeItem("token");
      navigate('/login');
      setCrrUser(null);
    } else {
      // alert("Failed to log out")
      callModal({ header: "Error", body: "Session expired", isCloseBtn: false, mainBtnTxt: "Log in", isStatic: true, mainBtnFunc: () => { navigate('/login') } })

    }

  }

  // const [searchParams, setSearchParams] = useSearchParams()
  // const isLogin = () => {
  //   if (searchParams.get('message') === 'done') {
  //     if (!localStorage.getItem("token") && searchParams.get('token')) {
  //       localStorage.setItem('token', searchParams.get('token'))
  //       currentUser();
  //       navigate('/home')
  //     }
  //   } else if (searchParams.get('message') === 'error') {
  //     localStorage.removeItem("token");
  //     setCrrUser(null);
  //     navigate('/')
  //   }

  // }

  //search
  const [search, setSearch] = useState('');

  //game pagination
  const [gamePage, setGamePage] = useState(1);

  useEffect(() => {
    // isLogin()
    if (localStorage.getItem("token")) {
      currentUser();

    }
    window.addEventListener("scroll", handleVisibleButton);

  }, [])


  return <>
    {location.pathname.toLowerCase().includes("cpanel") ? "" : <Navbar notifyCount={notifyCount} setNotifyCount={setNotifyCount} setPage={setGamePage} currentUser={crrUser} removeUser={removeUser} cart={cart} setSearch={setSearch} />}

    {
      crrUser ?
        <Cart cart={cart} getCart={getCart} setCart={setCart} />
        :
        ''
    }
    <div className={location.pathname.toLowerCase().includes("cpanel") ? "app" : 'app pt-5 mt-5'}>
      <AnimatePresence>
        <Routes location={location} key={location.pathname.split('/')[1]}>
          <Route path='/googleOauth' element={<GoogleOauth currentUser={currentUser} />} />

          <Route path='' element={<StartScreen currentUser={crrUser} />} />
          <Route path='home' element={<Home search={search} setSearch={setSearch} page={gamePage} setPage={setGamePage} />} />

          <Route path='cpanel' element={<CPanel removeUser={removeUser} />}>
            <Route
              index
              element={<CPNav />}
            />
            <Route
              path="games"
              element={<GameControl />}
            />
            <Route
              path="users"
              element={<UserControl />}
            />
            <Route
              path="genres"
              element={<GenreControl />}
            />
            <Route
              path="support"
              element={<MySupport />}
            />
            <Route
              path="*"
              element={<Navigate to="/404" />}
            />
          </Route>

          <Route path='profile' element={<Profile crrUser={crrUser} currentUser={currentUser} />} >
            <Route
              index
              element={<Info />}
            />
            <Route
              path="info/:id"
              element={<Info />}
            />
            <Route
              path="info"
              element={<Info />}
            />
            <Route
              path="wishlist"
              element={<Wishlist />}
            />
            <Route
              path="activity"
              element={<Activity />}
            />
            <Route
              path="following"
              element={<Followers crrUser={crrUser} />}
            />
            <Route
              path="games"
              element={<Games />}
            />
          </Route>
          <Route path='details/:slug/:id' element={<Details currentUser={crrUser} getCart={getCart} cart={cart} />} />
          <Route path='login' element={<ProtectedLogin> <Login currentUser={currentUser} /> </ProtectedLogin>} />
          <Route path='signup' element={<ProtectedLogin> <Signup /> </ProtectedLogin>} />
          <Route path='forgot' element={<ProtectedLogin> <ForgotPassword /> </ProtectedLogin>} />
          <Route path='404' element={<NotFound />} />
          <Route path='*' element={<Navigate to='/404' />} />

        </Routes>

      </AnimatePresence>
      <button className="d-none" onClick={returnToTop} id="toTop" title="Go to top"><i className="fa-solid fa-jet-fighter-up"></i></button>

    </div>
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      className="text-white"
      backdrop={modalData.isStatic ? "static" : true}
      keyboard={modalData.isStatic ? false : true}
    >
      {modalData.isStatic ? (
        <Modal.Header>
          <Modal.Title>{modalData.header}</Modal.Title>
        </Modal.Header>
      ) : (
        <Modal.Header closeButton>
          <Modal.Title>{modalData.header}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>{modalData.body}</Modal.Body>
      <Modal.Footer>
        {modalData.isCloseBtn === true ? (
          <Button
            variant={modalData.closeBtnColor}
            onClick={handleCloseModal}
          >
            {modalData.closeBtnTxt}
          </Button>
        ) : (
          ""
        )}
        {modalData.isMainBtn === true ? (
          <Button
            variant={modalData.mainBtnColor}
            onClick={applyCloseModel}
          >
            {modalData.mainBtnTxt}
          </Button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
    {/* </Provider> */}

  </>
}

export default App;
