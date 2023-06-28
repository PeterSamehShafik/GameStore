import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./HomeMediaQuery.css";
import './Navigation.css'
import './NavigationMediaQuery.css'
import axios from "axios";
import { BEARERKEY, baseURL } from "../../index.js";

function Home() {
  const [url, setUrl] = useState(`${baseURL}/game/all?`)
  const [filters, setFilters] = useState({genre:'', sort:''})
  const [loading, setLoading] = useState('loading')
  const [isGrid, setIsGrid] = useState(true);
  const [games, setGames] = useState('loading');
  const [genres, setGenres] = useState([])

  async function getGenres() {
        const config = {
          headers: { authorization: BEARERKEY + localStorage.getItem("token") }
        };
        const result = await axios.get(`${baseURL}/genre/all`, config).catch(function (error) {
          if (error.response) {
            console.log(error.response);
            setGenres(null);
          }
        });

        if (result?.data?.message == "done") {
          setGenres(result.data.genres);
        }
    
      }
      
      console.log(url)
  async function getGames({genre = null, sort = null, none = false}={}) {
    setLoading('loading'); 
    if(genre){
      setUrl(url + `genre=${genre}&`)
    }
    if(sort){
      setUrl(url + `${sort}=1&`)
    }
    if(none === true){
      setUrl(url + `${baseURL}/game/all?`)
    }
    const result = await axios.get(url)
    .catch((err) => {
        setGames(null)
        setLoading(true)
        console.log(err)
      })
      // console.log(data)
      setGames(result?.data?.games);
      setLoading(true)
    }
    
    function makeGrid() {
      setIsGrid(true);
    }
    function removeGrid() {
      setIsGrid(false);
    }
    
  useEffect(() => {
  getGames();
  getGenres();
  }, []);

  return (
    <>
      <main className="d-flex mt-5 games">
        {
          games == "loading" ?
            <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-absolute top-0">
              <div className="sk-chase">
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
              </div>
            </div>
            :
            games == null ?
              <div className="m-auto d-flex flex-column align-items-center mt-5">
                <img src="/error.png" className="img-fluid w-25" alt="" srcset="" />
                <p className="fs-1 mx-auto">Something went wrong....</p>
                <p className="fs-1 mx-auto">Please try again</p>
              </div>
              :
              <div className="row w-100">
                <div className="col-sm-3 col-4 pe-0 ">
                <nav className='side-nav'>
        <div className="d-flex flex-column flex-shrink-0 p-3 pt-3 text-white bg-transparent ms-4 me-0 " >
        <div className="fllters">
                <ul className="nav nav-pills flex-column mb-auto">
                    <h2 className='fw-bolder h3 mb-3'>Filters</h2>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-star icon me-2 rounded-3"></i>
                            <span>Ratings</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-hand-sparkles icon me-2 rounded-3"></i>
                            <span>Reviews</span>
                        </a>                        
                    </li>
                </ul>
            </div>
            <div className="geners mt-3 ">
                <ul className="nav nav-pills flex-column mb-auto">
                    <h2 className='fw-bolder h3 mb-3'>Genres</h2>
                    {genres?.map((genre) =>
                    <Link to={`/home?genre=${genre.name}`}>
                      <li className="nav-item my-3 hover-50" key={genre._id} onClick={()=>{getGames({genre:genre.name})}}>
                        <div className="cursor-pointer ps-0  d-flex align-items-center">
                            <img src={genre?.image?.secure_url} className='img-fluid h-100 rounded-circle' alt={genre.slug}  />
                            <span className='ms-2'>{genre.name}</span>
                        </div>                        
                  </li>
                    </Link>
                )}
                </ul>
            </div>

        </div>
    </nav>
                </div>
                <div className="col-sm-9 col-8 p-0">
                  <div className="page-content w-100 ps-0  pt-0">
                    <div className="main-header">
                      <h1 className="display-3 fw-bolder pt-0 mt-0">
                        New and trending
                      </h1>
                      <p>Based on player counts and ratings</p>
                    </div>
                    <div className="games-section ">
                      <div className="games-control d-flex justify-content-between">
                        <div className="left-control">

                        <div className="dropdown d-inline">
                          <button className="btn btn-dark me-2 mb-2 dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Sort by : <b>none</b>
                          </button>
                          <ul className="dropdown-menu mt-2" aria-labelledby="dropdownMenuButton1">
                            <li><Link to={`/home?sort=rate`} onClick={()=>{getGames({sort:'avgRate'})}} className="dropdown-item">Rate</Link></li>
                            <li><Link to={`/home?sort=price`} onClick={()=>{getGames({sort:'price'})}} className="dropdown-item">Price</Link></li>
                            <li><Link to={`/home?sort=alpha`} onClick={()=>{getGames({sort:'alpha'})}} className="dropdown-item">Alpha</Link></li>
                            <li><Link to={`/home?sort=released`} onClick={()=>{getGames({sort:'released'})}} className="dropdown-item">Released</Link></li>
                            <li><Link to={`/home?sort=lastAdded`} onClick={()=>{getGames({sort:'lastAdded'})}} className="dropdown-item">Last Added</Link></li>
                          </ul>
                        </div>

                          <button className="btn btn-dark me-2 mb-2" onClick={()=>{getGames({none:true})}}>
                            <b>Clear Filter</b>
                          </button>
                        </div>
                        <div className="right-control">
                          <span className="text-muted me-3">Display Option:</span>
                          <button onClick={makeGrid} className="btn btn-dark me-2">
                            <div className={isGrid ? "" : "text-muted"}>
                              <i className="fa-solid fa-2x fa-table-cells-large"></i>
                            </div>
                          </button>
                          <button onClick={removeGrid} className="btn btn-dark me-2">
                            <div className={isGrid ? "text-muted" : ""}>
                              <i className="fa-solid fa-2x fa-table-list"></i>
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className="games-show mt-3">
                        {
                          loading == 'loading'?
                          <div className=" d-flex justify-content-center align-items-center mt-5">
                            <div className="sk-chase">
                              <div className="sk-chase-dot"></div>
                              <div className="sk-chase-dot"></div>
                              <div className="sk-chase-dot"></div>
                              <div className="sk-chase-dot"></div>
                              <div className="sk-chase-dot"></div>
                              <div className="sk-chase-dot"></div>
                            </div>
                          </div>
                          :
                          <div className="row g-4">
                            {
                              games.length === 0?
                              <div className="m-auto d-flex flex-column align-items-center mt-5">
                                <p className="fs-1 mx-auto">No games within this genre...</p>
                              </div>
                              :
                              games?.map((game, idx) => {
                                return (
                                  <div
                                    key={game._id}
                                    className={
                                      isGrid
                                        ? "col-sm-6 col-lg-4"
                                        : " col-md-6 col-lg-6 offset-md-3 offset-lg-3"
                                    }
                                  >
                                    <Link to={`/details/${game.slug}/${game._id}`}>
                                      <div className="card text-bg-dark rounded-4">
                                        <div className="my-badge">{game.genreId.name}</div>
                                        <img
                                          src={game.mainPic.secure_url}
                                          className="card-img-top rounded-4 rounded-bottom img-fluid"
                                          alt={game.slug}
                                        />
                                        <div className="card-body pt-1">
                                          <div className="cart-price d-flex justify-content-between align-items-start">

                                            <p className="fw-bolder m-0 text-success">${game.price}</p>
                                          </div>
                                          <h5 className="card-title fw-bolder mt-2 h4">
                                            {game.name}
                                          </h5>
                                        </div>
                                        <div className="card-footer d-flex justify-content-start align-items-center flex-wrap">
                                          {
                                            game?.platform?.map((platform,idx)=><div className="platform rounded-pill mb-2 p-3 bg-primary fa-xs me-2">
                                            {platform}
                                          </div>)
                                          }
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                );
                              })
                            }
                          </div>

                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        }
      </main>
    </>
  );
}

export default Home;
