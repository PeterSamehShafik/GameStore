import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from './../Navigation/Navigation';
// import { useDispatch, useSelector } from 'react-redux'
import './Home.css'
import './HomeMediaQuery.css'
import { addToCart } from '../Redux/StoreSlices';
import axios from 'axios';

function Home() {
  // const data= useSelector(state=>state.APIs)
  // console.log(data)
  // const dispatch = useDispatch()
  const [isGrid, setIsGrid] = useState(true)
  const [mainPage, setMainPage] = useState(null)

  async function getMainPage() {
    const { data } = await axios.get('https://api.rawg.io/api/games?key=0c04e7dfd9db4de8b14711042cab0d8c')
    // console.log(data)
    setMainPage(data.results)
  }

  function makeGrid() {
    setIsGrid(true)
  }
  function removeGrid() {
    setIsGrid(false)
  }

  function addGame(game,price) {
    // dispatch(addToCart({
    //   name: game.name,
    //   price: price
    // }))
  }

  useEffect(() => {
    getMainPage()
  }, [])

  return <>

    <main className='d-flex mt-5'>
      <div className="row w-100">
        <div className="col-3 pe-0">
          <Navigation />
        </div>

        <div className="col-9 ps-0">
          <div className="page-content w-100 p-3 ps-0  pt-0">

            <div className="main-header">
              <h1 className='display-3 fw-bolder pt-0 mt-0'>New and trending</h1>
              <p>Based on player counts and ratings</p>
            </div>

            <div className="games-section ">
              <div className="games-control d-flex justify-content-between">
                <div className="left-control">
                  <button className='btn btn-dark me-2 mb-2'>Filter by : <b>none</b></button>
                  <button className='btn btn-dark me-2 mb-2'><b>Clear Filter</b></button>
                </div>
                <div className="right-control">
                  <span className='text-muted me-3'>Display Option:</span>
                  <button onClick={makeGrid} className='btn btn-dark me-2'>
                    <div className={isGrid ? "" : 'text-muted'}>
                      <i className="fa-solid fa-2x fa-table-cells-large"></i>
                    </div>
                  </button>
                  <button onClick={removeGrid} className='btn btn-dark me-2'>
                    <div className={isGrid ? "text-muted" : ''}>
                      <i className="fa-solid fa-2x fa-table-list"></i>
                    </div>
                  </button>
                </div>
              </div>
              <div className="games-show mt-3">
                <div className="row g-3">

                  {mainPage?.map((game, idx)=>{
                      const price =Math.round(Math.random()*100 )
                      return <div key={game.id} className={isGrid ? "col-md-6 col-lg-4" : " col-md-6 col-lg-6 offset-md-3 offset-lg-3"}>
                      <div className="card text-bg-dark rounded-4" >
                        <img src={game.background_image} className="card-img-top rounded-4 rounded-bottom img-fluid" alt="..." />
                        <div className="card-body pt-1">
                          <div className="cart-price d-flex justify-content-between align-items-start">
                            <span onClick={()=>addGame(game,price)} className="cart text-muted fw-bolder">Add to cart <strong></strong></span>
                            <p className='fw-bolder m-0'>${price}</p>
                          </div>
                          <h5 className="card-title fw-bolder mt-2 h4">{game.name}</h5>
  
                        </div>
                        <div className="card-footer">
                          <div className="add-to-fav d-flex">
                            <span className="fa-2x fav ms-auto">♥</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  })}

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


    </main>


  </>
}

export default Home