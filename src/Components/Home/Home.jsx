import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./HomeMediaQuery.css";
import "./Navigation.css";
import "./NavigationMediaQuery.css";
import axios from "axios";
import { baseURL } from "../../index.js";
import { motion } from "framer-motion";
//paginate
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import Avatar from "@mui/material/Avatar";

function Home({ search, setSearch, page, setPage }) {
  
  const [filters, setFilters] = useState({
    genre: null,
    sort: null,
    asc_desc: 1,
  });
  const [loading, setLoading] = useState("loading");
  const [isGrid, setIsGrid] = useState(true);
  const [games, setGames] = useState("loading");
  const [genres, setGenres] = useState([]);
  //
  const [pageCount, setPageCount] = useState(1);

  const handlePage = (e, value) => {
    setPage(value);
  };

  async function getGenres() {
    const result = await axios
      .get(`${baseURL}/genre/all/view`)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setGenres(null);
        }
      });

    if (result?.data?.message == "done") {
      setGenres(result.data.genres);
    }
  }

  async function getGames({
    genre = null,
    price = null,
    avgRate = null,
    alpha = null,
    lastAdded = null,
    released = null,
    asc_desc,
    clear = false,
  } = {}) {
    let accordion = document.getElementById("collapseOne");
    let accordionBtn = document.getElementById("accordionBtn");
    if(accordion && accordionBtn){

      accordionBtn.classList.add('collapsed')
      accordionBtn.setAttribute('aria-expanded',false)
      accordion.classList.remove('show')
    }

    
    // document.getElementById("p2").setAttribute("aria-expanded", "false")
    setLoading("loading");
    let isGenre = "",
      tempPage = null,
      sort = "";
    if (genre) {
      tempPage = 1;
      setPage(1);
      isGenre = `genre=${genre}&`;
      setFilters({ ...filters, genre: genre });
    } else if (filters.genre !== null) {
      isGenre = `genre=${filters.genre}&`;
    }

    if (price) {
      sort = `price=${filters.asc_desc}&`;
      setFilters({ ...filters, sort });
    }

    if (avgRate) {
      sort = `avgRate=${filters.asc_desc}&`;
      setFilters({ ...filters, sort });
    }

    if (alpha) {
      sort = `alpha=${filters.asc_desc}&`;
      setFilters({ ...filters, sort });
    }

    if (lastAdded) {
      sort = `lastAdded=${filters.asc_desc}&`;
      setFilters({ ...filters, sort });
    }

    if (released) {
      sort = `released=${filters.asc_desc}&`;
      setFilters({ ...filters, sort });
    }

    if (sort == "" && filters.sort !== null) {
      if (asc_desc) {
        sort =
          filters.sort.split("=")[0] +
          "=" +
          asc_desc +
          filters.sort.split("1")[1];
      } else {
        sort =
          filters.sort.split("=")[0] +
          "=" +
          filters.asc_desc +
          filters.sort.split("1")[1];
      }
    }
    if (clear) {
      isGenre = "";
      sort = "";
      setFilters({ genre: null, sort: null, asc_desc: 1 });
    }
    // console.log(`${baseURL}/game/all?page=3&${isGenre + sort + `search=${search}`}`)
    const result = await axios
      .get(
        `${baseURL}/game/all?size=18&page=${tempPage ? tempPage : page}&${
          isGenre + sort + `search=${search}`
        }`
      )
      .catch((err) => {
        setGames(null);
        setLoading(true);
        console.log(err);
      });

    setGames(result?.data?.games);
    setPageCount(result.data.pages);
    setLoading(true);
  }

  const asc_desc = (sortBy) => {
    setFilters({ ...filters, asc_desc: sortBy });
    getGames({ asc_desc: sortBy });
  };

  function makeGrid() {
    setIsGrid(true);
  }
  function removeGrid() {
    setIsGrid(false);
  }
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const showCarousel = (e) => {
    let img = e.target;
    let carousel = img.previousElementSibling;
    if (carousel.className.includes("carousel")) {
      img.classList.add("d-none");
      carousel.classList.remove("d-none");
    }
    // console.log("entering")
  };
  const hideCarousel = (e) => {
    let carousel = e.target.closest(".parent");
    // console.log(carousel)
    let img = carousel.nextElementSibling;
    if (carousel.className.includes("carousel")) {
      carousel.classList.add("d-none");
      img.classList.remove("d-none");
    }
    // console.log("leaving")
  };
  const colorGenre = (e) => {
    console.log(e.target)
  }
  useEffect(() => {
    getGames();
    getGenres();
  }, []);
  useEffect(() => {
    getGames();
  }, [search, page]);

  return (
    <>
      <motion.main
        className="main__container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ duration: 0.5 }}
      >
        <main className="d-flex games">
          {games == "loading" ? (
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
          ) : games == null ? (
            <div className="m-auto d-flex flex-column align-items-center mt-5">
              <img src="/error.png" className="img-fluid" alt="" srcset="" />
              <p className="fs-1 mx-auto">Something went wrong....</p>
              <p className="fs-1 mx-auto">Please try again</p>
            </div>
          ) : (
            <div className="container-fluid">
              <div className="row">
                <div className="col-3 col-sm-2 me-1 genre-large-filter">
                  
                  <nav className="side-nav">
                    <div className="d-flex flex-column flex-shrink-0 pt-3 text-white bg-transparent ms-4 me-0 ">
                      <div className="genres mt-3">
                        <ul className="nav nav-pills flex-column mb-auto">
                          <h2 className="fw-bolder h3 mb-3">Genres</h2>
                          {genres?.map((genre) => (
                            <Link
                              key={genre._id}
                              to={`/home?genre=${genre.name}`}
                            >
                              <li
                                className={
                                  filters.genre === genre.name
                                    ? "nav-item my-3 hover-50 active"
                                    : "nav-item my-3 hover-50 "
                                }
                                key={genre._id}
                                onClick={() => {
                                  getGames({ genre: genre.name });
                                }}
                              >
                                <div className="cursor-pointer ps-0  d-flex align-items-center">
                                  <img
                                    src={genre?.image?.secure_url}
                                    className="img-fluid h-100 rounded-circle"
                                    alt={genre.slug}
                                  />
                                  <span className="ms-2">{genre.name}</span>
                                </div>
                              </li>
                            </Link>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </nav>
                </div>

                <div className="col mx-sm-1">
                  <div className="page-content w-100 ps-0  pt-0">
                    <div className="main-header">
                      <h1 className="display-3 fw-bolder pt-0 mt-0">
                        New and trending
                      </h1>
                      <p>Based on player counts and ratings</p>
                    </div>
                    <div
                      className="d-flex align-items-center w-100 my-3 d-block d-lg-none"
                      role="search"
                    >
                      <input
                        className="form-control me-2 search text-white"
                        type="search"
                        placeholder="Search games..."
                        aria-label="Search"
                        onChange={handleSearch}
                        id="search"
                        defaultValue={search}
                      />
                      <i className="fa-solid fa-magnifying-glass close-search "></i>
                    </div>

                    <div className="games-section pe-2">
                      <div className="games-control d-md-flex justify-content-between">
                        <div className="left-control">
                          <div className="genre-small-filter my-2 rounded-5">
                            <div className="accordion genres my-3" id="accordionExample">
                              <div className="accordion-item">
                                <h2 className="accordion-header bg-dark">
                                  <button
                                    id="accordionBtn"
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne"
                                    aria-expanded="false"
                                    aria-controls="collapseOne"
                                  >
                                    <b className="">Genre{filters.genre? `: ${filters.genre}` : ''}</b>
                                  </button>
                                </h2>
                                <div
                                  id="collapseOne"
                                  className="accordion-collapse collapse"
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="accordion-body bg-darkBlue text-white">
                                    <ul className="nav nav-pills flex-column mb-auto">
                                      {genres?.map((genre) => (
                                        <Link
                                          key={genre._id}
                                          to={`/home?genre=${genre.name}`}
                                        >
                                          <li
                                            className={
                                              filters.genre === genre.name
                                                ? "nav-item my-3 hover-50 active bolder"
                                                : "nav-item my-3 hover-50 bolder"
                                            }
                                            key={genre._id}
                                            onClick={() => {
                                              getGames({ genre: genre.name });
                                            }}
                                          >
                                            <div className="cursor-pointer ps-0  d-flex align-items-center">
                                              <Avatar
                                                alt="Remy Sharp"
                                                src={genre?.image?.secure_url}
                                              />
                                              {/* <img
                                    src={genre?.image?.secure_url}
                                    className="img-fluid h-100 rounded-circle"
                                    alt={genre.slug}
                                  /> */}
                                              <span className="ms-3">
                                                {genre.name}
                                              </span>
                                            </div>
                                          </li>
                                        </Link>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-md-start justify-content-between ">
                            <div className="dropdown d-inline">
                              <button
                                className="btn btn-dark me-2 mb-2 dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Sort by :{" "}
                                <b className="text-capitalize">
                                  {filters.sort
                                    ? filters.sort?.split("=")[0] == "avgRate"
                                      ? "Rate"
                                      : filters.sort?.split("=")[0]
                                    : "None"}
                                </b>
                              </button>
                              {filters.sort ? (
                                <>
                                  <button
                                    onClick={() => {
                                      asc_desc(1);
                                    }}
                                    className={
                                      filters.asc_desc === 1
                                        ? "btn btn-secondary me-2 mb-2 btn-sm  "
                                        : "btn btn-dark me-2 mb-2 btn-sm  "
                                    }
                                    type="button"
                                  >
                                    <span className="cursor-pointer">
                                      Ascending
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      asc_desc(-1);
                                    }}
                                    className={
                                      filters.asc_desc === 1
                                        ? "btn btn-dark me-2 mb-2 btn-sm  "
                                        : "btn btn-secondary me-2 mb-2 btn-sm  "
                                    }
                                    type="button"
                                  >
                                    <span className="cursor-pointer">
                                      Descending
                                    </span>
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                              <ul
                                className="dropdown-menu mt-2"
                                aria-labelledby="dropdownMenuButton1"
                              >
                                <li>
                                  <Link
                                    to={`/home?sort=rate`}
                                    onClick={() => {
                                      getGames({ avgRate: "1" });
                                    }}
                                    className="dropdown-item"
                                  >
                                    Rate
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`/home?sort=price`}
                                    onClick={() => {
                                      getGames({ price: "1" });
                                    }}
                                    className="dropdown-item"
                                  >
                                    Price
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`/home?sort=alpha`}
                                    onClick={() => {
                                      getGames({ alpha: "1" });
                                    }}
                                    className="dropdown-item"
                                  >
                                    Alpha
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`/home?sort=released`}
                                    onClick={() => {
                                      getGames({ released: "1" });
                                    }}
                                    className="dropdown-item"
                                  >
                                    Released
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`/home?sort=lastAdded`}
                                    onClick={() => {
                                      getGames({ lastAdded: "1" });
                                    }}
                                    className="dropdown-item"
                                  >
                                    Last Added
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="clear-filter">
                              <Link
                                to={"/home"}
                                className="btn btn-dark mb-2"
                                onClick={() => {
                                  getGames({ clear: true });
                                }}
                              >
                                <b>Clear Filters</b>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="right-control">
                          <span className="text-muted me-3">
                            Display Option:
                          </span>
                          <button
                            onClick={makeGrid}
                            className="btn btn-dark me-2"
                          >
                            <div className={isGrid ? "" : "text-muted"}>
                              <i className="fa-solid fa-2x fa-table-cells-large"></i>
                            </div>
                          </button>
                          <button
                            onClick={removeGrid}
                            className="btn btn-dark me-2"
                          >
                            <div className={isGrid ? "text-muted" : ""}>
                              <i className="fa-solid fa-2x fa-table-list"></i>
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className="games-show mt-3">
                        {loading == "loading" ? (
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
                        ) : (
                          <div className="row g-4 mb-3">
                            {games.length === 0 ? (
                              <div className="m-auto d-flex flex-column align-items-center mt-5">
                                <p className="fs-1 mx-auto">
                                  No games found...
                                </p>
                              </div>
                            ) : (
                              games?.map((game, idx) => {
                                return game.isDeleted == true ? (
                                  ""
                                ) : (
                                  <div
                                    key={game._id}
                                    className={
                                      isGrid
                                        ? "col-sm-6 col-lg-4"
                                        : " col-md-6 col-lg-6 offset-md-3 offset-lg-3"
                                    }
                                  >
                                    <Link
                                      to={`/details/${game.slug}/${game._id}`}
                                    >
                                      <div className="card text-bg-dark rounded-4">
                                        <div className="my-badge">
                                          {game.genreId.name}
                                        </div>
                                        {game.avgRate ? (
                                          <div className="game-rate-card position-absolute top-0 end-0 d-flex justify-content-center align-items-center ">
                                            <i className="card-rate fa-solid fa-star display-6 fa-xl text-warning"></i>
                                            <span className="position-absolute fw-bold h5 m-0 text-white">
                                              {game.avgRate}
                                            </span>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {game.pics.length ? (
                                          <div
                                            id={`carouselExampleIndicators${idx}`}
                                            className="carousel slide d-none parent"
                                            data-bs-ride="carousel"
                                            onMouseLeave={hideCarousel}
                                          >
                                            <div className="carousel-indicators ">
                                              {game?.pics.map((g, idx) => {
                                                return (
                                                  <button
                                                    type="button"
                                                    key={idx}
                                                    data-bs-target="#carouselExampleIndicators"
                                                    data-bs-slide-to={idx}
                                                    className={
                                                      idx == 0 ? "active" : ""
                                                    }
                                                    aria-current="true"
                                                    aria-label={`Slide ${
                                                      idx + 1
                                                    }`}
                                                  ></button>
                                                );
                                              })}
                                            </div>
                                            <div className="carousel-inner rounded-4 rounded-bottom">
                                              {game?.pics.map((g, idx) => {
                                                return (
                                                  <div
                                                    key={idx}
                                                    className={
                                                      idx == 0
                                                        ? "carousel-item active"
                                                        : "carousel-item"
                                                    }
                                                  >
                                                    <img
                                                      src={g.secure_url}
                                                      className="d-block w-100"
                                                    />
                                                  </div>
                                                );
                                              })}
                                            </div>
                                            {game.pics.length ? (
                                              <>
                                                <button
                                                  className="carousel-control-prev bg-secondary"
                                                  type="button"
                                                  data-bs-target={`#carouselExampleIndicators${idx}`}
                                                  data-bs-slide="prev"
                                                >
                                                  <span
                                                    className="carousel-control-prev-icon"
                                                    aria-hidden="true"
                                                  ></span>
                                                  <span className="visually-hidden">
                                                    Previous
                                                  </span>
                                                </button>
                                                <button
                                                  className="carousel-control-next bg-secondary"
                                                  type="button"
                                                  data-bs-target={`#carouselExampleIndicators${idx}`}
                                                  data-bs-slide="next"
                                                >
                                                  <span
                                                    className="carousel-control-next-icon"
                                                    aria-hidden="true"
                                                  ></span>
                                                  <span className="visually-hidden">
                                                    Next
                                                  </span>
                                                </button>
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        <img
                                          src={game.mainPic.secure_url}
                                          className="card-img-top rounded-4 rounded-bottom img-fluid"
                                          alt={game.slug}
                                          onMouseEnter={showCarousel}
                                        />
                                        <div className="card-body pt-1">
                                          <div className="cart-price d-flex justify-content-between align-items-start">
                                            <p className="fw-bolder m-0 text-success">
                                              ${game.price}
                                            </p>
                                          </div>
                                          <h5 className="card-title fw-bolder mt-2 h4">
                                            {game.name}
                                          </h5>
                                        </div>
                                        <div className="card-footer ">
                                          <div className="d-flex justify-content-start align-items-center flex-wrap">
                                            {game?.platform?.map(
                                              (platform, idx) => (
                                                <div
                                                  key={idx}
                                                  className="platform rounded-pill mb-2 p-3 bg-four fa-xs me-2"
                                                >
                                                  {platform}
                                                </div>
                                              )
                                            )}
                                          </div>
                                          <span className="text-muted">
                                            {game.released.split("T")[0]}
                                          </span>
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    loading !== "loading" && games.length > 0
                      ? "paginate my-4 d-flex justify-content-center "
                      : "paginate my-4 d-flex justify-content-center d-none"
                  }
                >
                  <Stack spacing={2}>
                    <Pagination
                      size="large"
                      count={pageCount}
                      page={page}
                      showFirstButton
                      showLastButton
                      variant="outlined"
                      color="primary"
                      onChange={handlePage}
                    />
                  </Stack>
                </div>
              </div>
            </div>
          )}
        </main>
      </motion.main>
    </>
  );
}

export default Home;
