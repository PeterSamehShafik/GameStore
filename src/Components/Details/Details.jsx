import React, { useEffect, useState } from "react";
import "./Details.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../index.js";
import HoverVideoPlayer from 'react-hover-video-player';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Rating from '@mui/material/Rating';



function Details() {
  const [game, setGame] = useState("Loading");
  const [gameRate, setGameRate] = useState(0);
  const [comments, setComments] = useState("loading");
  const { id } = useParams();

  const getGame = async () => {
    const { data } = await axios.get(`${baseURL}/game/${id}`)
      .catch(function (error) {
        if (error.response) {
          setGame(null);
        }
      });
    if (data.message == "done") {
      console.log(data.game);
      setGame(data.game);
      setGameRate(data.game.avgRate)
    } else {
      setGame(null);
    }
  };
  const getGameComment = async () => {
    const { data } = await axios.get(`${baseURL}/game/${id}/comment`)
      .catch(function (error) {
        if (error.response) {
          setComments(null);
        }
      });
    if (data.message == "done") {
      console.log(data);
      setComments(data.comments);
    } else {
      setComments(null);
    }
  };
  useEffect(() => {
    getGame();
    getGameComment();
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
        <div className="container-fluid px-5 ">
          <header className="d-flex justify-content-between align-items-center mb-2">
            <Link to="/home" className="back-store h4 fw-bolder">
              <i className="fa-solid fa-arrow-left me-2"></i>
              <strong>Store</strong>
            </Link>
          </header>

          <div className="row">
            <div className=" col-lg-4 ">
              <div className="game-pic-vid d-flex flex-column align-items-center">
                <div className="main-pic-vid">
                  {game.video?.secure_url ?
                    <HoverVideoPlayer
                      videoSrc={game.video.secure_url}
                      pausedOverlay={
                        <img
                          src={game.mainPic.secure_url}
                          alt={game.slug}
                          style={{
                            // Make the image expand to cover the video's dimensions
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      }
                      loadingOverlay={
                        <div className="loading-overlay">
                          <div className="loading-spinner" />
                        </div>
                      }
                    />
                    :
                    <img src={game.mainPic.secure_url} alt={game.slug} className="img-fluid" />
                  }


                </div>
                <div className="game-name">
                  <h2 className="display-6 fw-bolder mb-0 cursor-normal">
                    {game.name}
                  </h2>
                </div>
                <div className="rate-game mt-2 bg-secondary p-2 rounded-3">
                  <Rating
                    name="simple-controlled"
                    value={gameRate}
                    readOnly
                    precision={0.5}
                    size="large"
                    onChange={(event, newValue) => {
                      console.log(event)
                      setGameRate(newValue)
                    }}
                  />
                </div>
              </div>

            </div>
            <div className=" col-lg-8 d-flex flex-column justify-content-between align-items-center">

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
                                  game.genreId ?
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
              <div className="game-carousal mt-2">
                {game?.pics[0]?.secure_url ? <>
                  <h2>Game Images:</h2> <hr />
                  <Carousel infiniteLoop showStatus={false}  >
                    {game.pics.map((image, idx) => {
                      return <div key={idx} className="game-carousal d-flex align-items-center justify-content-center h-100">
                        <img src={image.secure_url} className="img-fluid" />
                      </div>
                    })}
                  </Carousel>
                </>
                  :
                  "No images for this Game"
                }

              </div>
              <div className="game-functionalities mt-1 w-100 text-bg-dark d-flex p-3 justify-content-between align-items-center">
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
          <div className="row mt-2 mb-4" >
            <div className="container">
              <div className="comments-section w-75 m-auto">
                <div className="comments-header">
                  <h2>Comments:</h2> <hr />
                </div>
                <div className="comments-add">
                  <textarea className="form-control comment-area" placeholder="What do you think? Add a comment and collaborate" rows="3"></textarea>
                  <button className="btn btn-success mt-2"> Post Comment </button>
                </div>
                <hr />
                {comments === "loading" ? <p>Loading.....</p> :
                  comments ?
                    comments.length>0?
                    comments.map((comment) => {
                      return <div className="comments-show my-2">
                        <div className="user-comment hover-75 p-3 shadow rounded-5">
                          <div className="comment-details d-flex ">
                            {/* neeeeeeeeeed to return imgg backeenddd */}
                            <img alt="user" className="img-fluid rounded-circle user-pic me-2" src="https://res.cloudinary.com/dpiwjrxdt/image/upload/v1678136871/Users/ahmed-63fb951be0c738057dfbe3ab/profilePic/ggbim5znb3zss4tphiwr.png" />
                            <div className="comment-body">
                              <h4 className="user-name fw-bolder">{comment.createdBy.firstName} {comment.createdBy.lastName}</h4>
                              <p> {comment.body} </p>
                            </div>
                          </div>
                          <hr className="my-2" />
                          <div className="comment-footer d-flex justify-content-between align-items-center">
                            <div className="social-comment d-flex ms-1">
                              <div className="like p-1 cursor-pointer me-3">
                                <i className="fa-solid fa-thumbs-up fa-xl"></i>
                                <span> {comment.likes.length} </span>
                              </div>

                              <div className="unlike p-1 cursor-pointer">
                                <i className="fa-solid fa-thumbs-down fa-xl"></i>
                                <span> {comment.dislikes.length} </span>
                              </div>

                            </div>

                            <div className="owner-admin-control mt-0">
                              <span className="cursor-pointer text-success me-2 hover-75">Edit Comment</span>
                              <span className="cursor-pointer text-danger hover-75">Delete Comment</span>
                            </div>

                          </div>

                        </div>
                      </div>
                    })
                    : <p>Be the first to comment !</p>
                    : <p>Cannot Load Comments</p>
                }
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
