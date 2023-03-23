import React, { useEffect, useState } from "react";
import "./Details.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../index.js";
function Details() {
  const [game, setGame] = useState("Loading");
  const { id } = useParams();
  const getGame = async () => {
    const { data } = await axios
      .get(`${baseURL}/game/${id}`)
      .catch(function (error) {
        if (error.response) {
          setGame(null);
        }
      });
    if (data.message == "done") {
      if(data?.game?.mainPic){
        data.game.pics.unshift(data.game.mainPic);
      }
      if(data?.game?.video){
        data.game?.pics?.push(data.game.video);
      }
      console.log(data.game);
      setGame(data.game);
    } else {
      setGame(null);
    }
  };
  useEffect(() => {
    getGame();
  }, []);
  return (
    <>
      {game === "Loading" ? (
        <div className="container-fluid px-5">
          <header className="d-flex justify-content-between align-items-center">
            <Link to="/home" className="back-store h4 fw-bolder">
              <i className="fa-solid fa-arrow-left me-2"></i>
              <strong>Store</strong>
            </Link>
          </header>
          <p> Loading...... </p>
        </div>
      ) : game ? (
        <div className="container-fluid px-5">
          <header className="d-flex justify-content-between align-items-center">
            <Link to="/home" className="back-store h4 fw-bolder">
              <i className="fa-solid fa-arrow-left me-2"></i>
              <strong>Store</strong>
            </Link>
          </header>

          <div className="row">
            <div className=" col-lg-8">
              <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-bs-ride="true"
              >
                <div className="carousel-indicators">
                  {
                    game?.pics?.map((pic, idx) => <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={`${idx}`}
                    className="active"
                    aria-current="true"
                    aria-label={`Slide ${idx + 1}`}
                    key={idx}
                  ></button>)
                  }
                  
                  
                </div>
                <div className="carousel-inner">
                  {
                    game?.pics?.map((pic, idx) => 
                    {
                      //console.log(extension);
                      return <div key = {idx} className={!idx? "carousel-item active" : "carousel-item"}>
                        {
                          pic?.secure_url.includes("video")?
                          <div className='video picSize d-flex justify-content-center align-items-center w-100'>
                              <div className=""> 
                              <video controls autoPlay muted>
                                  <source src={pic?.secure_url} type={`video/${pic?.secure_url.slice(pic.secure_url.lastIndexOf('.') + 1)}`} />
                              </video>
                              </div>
                          </div>
                        :
                          <img
                            src={pic?.secure_url}
                            className="d-block w-100 picSize"
                            alt={game.slug}
                          />
                        }
                      </div>
                      
                  })
                  }
                  
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>

            <div className=" col-lg-4 d-flex flex-column justify-content-between align-items-center">
              <div className="game-name">
                <h2 className="display-6 fw-bolder mb-0 cursor-normal">
                  {game.name}
                </h2>
              </div>
              <div className="about-section w-100">
                <div
                  className="accordion text-bg-dark accordion-flush"
                  id="accordionExample"
                >
                  <div className="card text-bg-dark">
                    <div className="card-header fw-bolder h4">About</div>
                    <div className="card-body">
                      <p className="card-text">{game.desc}</p>
                    </div>
                    <div className="card-footer text-muted p-0 bg-dark">
                      <div className="accordion-item text-bg-test ">
                        <div
                          id="flush-collapseOne"
                          className="accordion-collapse collapse"
                          aria-labelledby="flush-headingOne"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div className="accordion-body">
                            <ul className="text-bg-test">
                              <li className="fw-bolder">{game.name}</li>
                              <li className="text-white-50">
                                Relased: {game.released.split("T")[0]}
                              </li>
                              <li className="text-white-50">
                                Platforms:
                                {game.platform.map((platform, idx) => {
                                  return <span key={idx}> {platform} </span>
                                })}
                              </li>
                              <li className="text-white-50">
                                {
                                  game.genreId?
                                  "Genre: " : ""
                                }
                                 {game.genreId?.name}{" "}
                              </li>
                              <li className="text-white-50">
                                Publisher: {game.createdBy.firstName}{" "}
                                {game.createdBy.lastName}{" "}
                              </li>
                            </ul>
                          </div>
                        </div>

                        <h2 className="accordion-header" id="flush-headingOne">
                          <button
                            className="accordion-button collapsed text-bg-test "
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseOne"
                            aria-expanded="false"
                            aria-controls="collapseOne"
                          >
                            More
                          </button>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="game-functionalities mt-3 w-100 text-bg-dark d-flex p-3 justify-content-between align-items-center">
                <div className="price-lv h5 text-muted">
                  <span className="fw-bolder m-0 me-2">${game.price}</span>
                  <span className="fav ms-auto h4">
                    <i className="fa-regular fa-heart"></i>
                    {/* <i className="fa-solid fa-heart"></i> */}
                  </span>
                </div>
                <span className="cart text-muted fw-bolder">
                  Add to cart <strong>✚</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-fluid px-5">
          <header className="d-flex justify-content-between align-items-center">
            <Link to="/home" className="back-store h4 fw-bolder">
              <i className="fa-solid fa-arrow-left me-2"></i>
              <strong>Store</strong>
            </Link>
          </header>
          <p> Game not found!! </p>
        </div>
      )}
    </>
  );
}

export default Details;
