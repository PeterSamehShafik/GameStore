import React, { useEffect, useState } from "react";
import "./Details.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BEARERKEY, baseURL } from "../../index.js";
import HoverVideoPlayer from "react-hover-video-player";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Rating from "@mui/material/Rating";
import Cart from '../Cart/Cart.jsx'

//modal
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import jwtDecode from "jwt-decode";



function Details({ currentUser, getCart, cart }) {
  let navigate = useNavigate();
  const [game, setGame] = useState("Loading");
  const [userRate, setUserRate] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const [comments, setComments] = useState("loading");
  //modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    header: "",
    body: "",
    isMainBtn: true

  });
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const callModal = ({ header = "Are you sure?", body, closeBtnColor = "secondary", closeBtnTxt = "Close", mainBtnColor = "primary", mainBtnTxt, mainBtnFunc, isMainBtn = true } = {}) => {
    setModalData({ ...modalData, header, body, closeBtnColor, closeBtnTxt, mainBtnColor, mainBtnTxt, mainBtnFunc, isMainBtn })
    handleShowModal()
  }
  const applyCloseModel = () => {
    modalData.mainBtnFunc()
    handleCloseModal()
  }
  //end of modal

  const { id } = useParams();
  const [addCommentFlag, setAddCommentFlag] = useState(false);
  const checkCart = async () => {
    const res = cart.games?.find(e => e._id == id)
    res ? setIsInCart(true) : setIsInCart(false)
  }
  const giveRate = async (newValue) => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    }
    const reqBody = {
      rate: newValue,
    };
    const result = await axios
      .post(`${baseURL}/game/${id}/rate/add`, reqBody, config)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          callModal({ header: "Error", body: "Something went wrong, please try again", isMainBtn: false, closeBtnTxt: "OK" })
        }
      });

    if (result?.data?.message == "done") {
      setUserRate(newValue);
    }

  }

  const getGame = async () => {
    let config = {};
    if (localStorage.getItem("token")) {
      config = {
        headers: {
          userId: jwtDecode(localStorage.getItem("token")).id
        },
      }
    }
    const { data } = await axios
      .get(`${baseURL}/game/${id}`, config)
      .catch(function (error) {
        if (error.response) {
          setGame(null);
        }
      });
    if (data.message == "done") {

      setGame(data.game);
      setUserRate(data.game.userRate);
    } else {
      setGame(null);
    }
  };
  const getGameComment = async () => {
    const { data } = await axios
      .get(`${baseURL}/game/${id}/comment`)
      .catch(function (error) {
        if (error.response) {
          setComments(null);
        }
      });
    if (data.message == "done") {
      data.comments.reverse();
      setComments(data.comments);
    } else {
      setComments(null);
    }
  };

  // Comment APIS
  const addComment = async () => {
    setAddCommentFlag(true);
    const commentBody = document.getElementById("commentBody").value;
    if (commentBody != "") {
      const config = {
        headers: {
          authorization: BEARERKEY + localStorage.getItem("token"),
        },
      };
      const reqBody = {
        body: commentBody,
      };
      const result = await axios
        .post(`${baseURL}/game/${game._id}/comment/add`, reqBody, config)
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
            setAddCommentFlag(false);
          }
        });
      if (result?.data?.message == "done") {
        document.getElementById("commentBody").value = "";
        setAddCommentFlag(false);
        getGameComment();
      }
    } else {
      callModal({ header: "Warning", body: "You can't add empty comment", isMainBtn: false, closeBtnTxt: "OK", closeBtnColor: "warning" })
      setAddCommentFlag(false);
    }
  };
  const editComment = (commentID) => {
    let editSection = document.getElementById(commentID);
    let text = document.getElementById(commentID).previousElementSibling;
    let textArea = editSection.children[0];
    text.classList.add("d-none");
    editSection.classList.remove("d-none");
    textArea.value = text.innerHTML;
  };
  const saveEditComment = async (commentID) => {
    let editSection = document.getElementById(commentID);
    let text = document.getElementById(commentID).previousElementSibling;
    let textArea = editSection.children[0];
    if (textArea.value != "") {
      const config = {
        headers: {
          authorization: BEARERKEY + localStorage.getItem("token"),
        },
      };
      const body = {
        body: textArea.value,
      };
      let result = await axios
        .put(`${baseURL}/game/${game._id}/comment/${commentID}`, body, config)
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
          }
        });
      if (result?.data?.message == "done") {
        text.classList.remove("d-none");
        editSection.classList.add("d-none");
        text.innerHTML = textArea.value;
      } else {

        callModal({ header: "Warning!", body: "Failed to update comment", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "warning" })
      }
    } else {
      callModal({ header: "Warning!", body: "Can't add empty comment", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "warning" })
    }
  };
  const deleteComment = async (commentID, index) => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    let result = await axios
      .delete(`${baseURL}/game/${game._id}/comment/${commentID}`, config)
      //console.log(`${baseURL}/game/${game._id}/comment/${commentID}`)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
      });
    if (result?.data?.message == "done") {
      const tempComments = [...comments];
      tempComments.splice(index, 1);
      setComments(tempComments);
      callModal({ header: "Success!", body: "The comment removed successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })

    } else {
      callModal({ header: "Warning!", body: "Failed to delete comment", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "warning" })
    }
  };
  //End of Comment APIS

  //AddToCart
  const addToCart = async () => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const body = {
      body: "",
    };
    const result = await axios
      .put(`${baseURL}/cart/add/${game._id}`, body, config)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
      });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The Game added to your cart", isMainBtn: false, closeBtnTxt: "OK", closeBtnColor: "success" })
      //to render cart component
      getCart();
      setIsInCart(true);
    }
  };

  useEffect(() => {
    getGame();
    getGameComment();
    checkCart();
  }, []);
  useEffect(() => {
    checkCart();
  }, [cart]);


  return (
    <>
      {game === "Loading" ? (
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
                  {game.video?.secure_url ? (
                    <HoverVideoPlayer
                      videoSrc={game.video.secure_url}
                      pausedOverlay={
                        <img
                          src={game.mainPic.secure_url}
                          alt={game.slug}
                          style={{
                            // Make the image expand to cover the video's dimensions
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      }
                      loadingOverlay={
                        <div className="loading-overlay">
                          <div className="loading-spinner" />
                        </div>
                      }
                    />
                  ) : (
                    <img
                      src={game.mainPic.secure_url}
                      alt={game.slug}
                      className="img-fluid"
                    />
                  )}
                </div>
                <div className="game-name">
                  <h2 className="display-6 fw-bolder mb-0 cursor-normal">
                    {game.name}
                  </h2>
                </div>
                <div className="rating mx-auto d-flex flex-column align-items-center mt-3" >
                  {game.avgRate ?
                    <div className="game-rating d-flex ">
                      <span className="fs-1 bg-warning px-4 rounded-circle fw-bold d-flex justify-content-center align-items-center">
                        {game.avgRate}
                      </span>
                      <div className="rate-info ms-2">
                        <h4>User Score</h4>
                        <p>Mixed or average reviews
                          based on users</p>
                      </div>
                    </div> : ""}
                  <div className="rate-game my-2 bg-secondary p-2 rounded-3 w-auto">
                    <Rating
                      name="simple-controlled"
                      value={userRate}
                      precision={0.5}
                      size="large"
                      onChange={(event, newValue) => {
                        giveRate(newValue)
                      }}
                    />
                  </div>
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
                                Released: {game.released.split("T")[0]}
                              </li>
                              <li className="text-white-50">
                                Platforms:
                                {game.platform.map((platform, idx) => {
                                  return <span key={idx}> {platform} </span>;
                                })}
                              </li>
                              <li className="text-white-50">
                                {game.genreId ? "Genre: " : ""}
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
                {game?.pics[0]?.secure_url ? (
                  <>
                    <h2>Game Images:</h2> <hr />
                    <Carousel infiniteLoop showStatus={false}>
                      {game.pics.map((image, idx) => {
                        return (
                          <div
                            key={idx}
                            className="game-carousal d-flex align-items-center justify-content-center h-100"
                          >
                            <img src={image.secure_url} className="img-fluid" />
                          </div>
                        );
                      })}
                    </Carousel>
                  </>
                ) : (
                  "No images for this Game"
                )}
              </div>
              <div className="game-functionalities mt-1 w-100 text-bg-dark d-flex p-3 justify-content-between align-items-center">
                <div className="price-lv h5 text-muted">
                  <span className="fw-bolder m-0 me-2">${game.price}</span>
                  <span className="fav ms-auto h4">
                    <i className="fa-regular fa-heart"></i>
                    {/* <i className="fa-solid fa-heart"></i> */}
                  </span>
                </div>
                {
                  game.createdBy?._id == currentUser?._id ? (
                    <span
                      className="fw-bolder text-success pe-2"
                    >
                      Creator
                    </span>
                  ) :
                    <>
                      {isInCart && currentUser ? <span
                        className="fw-bolder pe-2 text-success"

                      >
                        Added
                      </span> :
                        currentUser ?
                          <span
                            className="cart text-muted fw-bolder pe-2"
                            onClick={addToCart}>
                            Add to cart <strong>✚</strong>
                          </span> :
                          <span
                            className="cart text-muted fw-bolder pe-2"
                            onClick={() => { callModal({ header: "Warning", body: "You need to login before adding to a cart", mainBtnTxt: "Sign in", mainBtnFunc: () => { navigate('/login') }, mainBtnColor: "success" }) }}>
                            Add to cart <strong>✚</strong>
                          </span>
                      }


                    </>
                }
              </div>
            </div>
          </div>
          <div className="row mt-2 mb-4">
            <div className="container">
              <div className="comments-section w-75 m-auto">
                <div className="comments-header">
                  <h2>Comments:</h2> <hr />
                </div>
                <div className="comments-add">
                  <textarea
                    id="commentBody"
                    className="form-control comment-area"
                    placeholder="What do you think? Add a comment and collaborate"
                    rows="3"
                  ></textarea>
                  {currentUser ?
                    <button className="btn btn-success mt-2" onClick={addComment}>
                      {addCommentFlag ? "Waiting..." : "Post Comment"}{" "}
                    </button> :
                    <button className="btn btn-success mt-2" onClick={() => { callModal({ header: "Warning", body: "You need to login before adding a comment", mainBtnTxt: "Sign in", mainBtnFunc: () => { navigate('/login') }, mainBtnColor: "success" }) }}>
                      {addCommentFlag ? "Waiting..." : "Post Comment"}{" "}
                    </button>}

                </div>
                <hr />
                {comments === "loading" ? (
                  <p>Loading.....</p>
                ) : comments ? (
                  comments.length > 0 ? (
                    comments.map((comment, index) => {
                      return (
                        <div key={comment._id} className="comments-show my-2">
                          <div className="user-comment hover-75 p-3 shadow rounded-5">
                            <div className="comment-details d-flex align-items-start">
                              <img
                                alt="user"
                                className="img-fluid rounded-circle user-pic me-2"
                                src={comment.createdBy?.profilePic?.secure_url}
                              />
                              <div className="comment-body w-100">
                                <h4 className="user-name fw-bolder">
                                  {comment.createdBy.firstName}{" "}
                                  {comment.createdBy.lastName}
                                </h4>
                                <p className=""> {comment.body} </p>
                                <div
                                  className="edit-comment-section d-flex d-none"
                                  id={comment._id}
                                >
                                  <textarea
                                    className="form-control bg-transparent text-white w-100 h-50"
                                    type="text"
                                  />
                                  <button
                                    className="btn btn-outline-success d-block ms-2 h-50"
                                    onClick={() => {
                                      saveEditComment(comment._id);
                                    }}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                              {comment?.createdBy?._id == currentUser?._id ||
                                currentUser?.role == "superAdmin" ||
                                game?.createdBy?._id == currentUser?._id ? (
                                <div className="dropdownmenu ms-auto">
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-transparent text-white dropdown-toggle"
                                      type="button"
                                      id="dropdownMenuButton1"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>

                                    <ul
                                      className="dropdown-menu"
                                      aria-labelledby="dropdownMenuButton1"
                                    >
                                      {comment?.createdBy?._id ==
                                        currentUser?._id ? (
                                        <>
                                          <span
                                            onClick={() => {
                                              editComment(comment._id);
                                            }}
                                            className="cursor-pointer text-success me-2 hover-75 dropdown-item"
                                          >
                                            <i className="fa-solid fa-pen-to-square fa-lg"></i>
                                            <span className="ps-2">Edit</span>
                                          </span>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                      {comment?.createdBy?._id ==
                                        currentUser?._id ||
                                        currentUser?.role == "superAdmin" ||
                                        game?.createdBy?._id ==
                                        currentUser?._id ? (
                                        <span
                                          className="cursor-pointer text-danger hover-75 dropdown-item"
                                          onClick={() => {

                                            callModal({ isMainBtn: true, header: "Delete Comment", body: "Are you sure?", mainBtnTxt: "Yes", mainBtnColor: "danger", mainBtnFunc: () => deleteComment(comment._id, index), closeBtnTxt: "No", closeBtnColor: "success" })
                                          }}
                                        >
                                          <i className="fa-solid fa-trash-can fa-lg"></i>{" "}
                                          <span className="ps-2">Delete</span>
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
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

                              <div className="owner-admin-control mt-0"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>Be the first to comment !</p>
                  )
                ) : (
                  <p>Cannot Load Comments</p>
                )}
              </div>
            </div>
          </div>

          <Modal show={showModal} onHide={handleCloseModal} className="text-white" >
            <Modal.Header closeButton>
              <Modal.Title>{modalData.header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalData.body}</Modal.Body>
            <Modal.Footer>
              <Button variant={modalData.closeBtnColor} onClick={handleCloseModal}>
                {modalData.closeBtnTxt}
              </Button>
              {modalData.isMainBtn == true ?
                <Button variant={modalData.mainBtnColor} onClick={applyCloseModel}>
                  {modalData.mainBtnTxt}
                </Button>
                : ""
              }

            </Modal.Footer>
          </Modal>

        </div>
      ) : (
        <div className="m-auto d-flex flex-column align-items-center mt-5">
          <img src="/error?.png" className="img-fluid w-25" alt="" srcset="" />
          <p className="fs-1 mx-auto">Something went wrong....</p>
          <p className="fs-1 mx-auto">Please try again</p>
        </div>
      )}
    </>
  );
}

export default Details;
