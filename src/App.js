import './App.css';
import StartScreen from './Components/StartScreen/StartScreen';
import Home from './Components/Home/Home';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar';
import Details from './Components/Details/Details';
import Cart from './Components/Cart/Cart';
import { Provider } from 'react-redux';
import { CartStore } from './Components/Redux/CartStore.js';

function App() {

  return <>

    {/* <Provider store={CartStore}> */}

      <Navbar />
      <Cart />
      <Routes>

        <Route path='' element={<StartScreen />} />
        <Route path='home' element={<Home />} />
        <Route path='details' element={<Details />} />

      </Routes>

    {/* </Provider> */}

  </>
}

export default App;
