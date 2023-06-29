import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { BEARERKEY, baseURL, roles } from './../../index';
import axios from 'axios';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function GameControl() {
  const [profile, setProfile, pathName, setPathname, genres, setGenres] = useOutletContext();
  const [games, setGames] = useState("Loading")
  const [game, setGame] = useState("Loading")
  const [gamePics, setGamePics] = useState(null)
  const [gameVideo, setGameVideo] = useState(null)
  const [editMode, setEditMode] = useState({})
  const [file, setFile] = useState(null);
  //crop
  const [showCropper, setShowCropper] = useState(false)
  const [cropper, setCropper] = useState(null)

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
    isStatic = false
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
      isStatic
    });
    handleShowModal();
  };
  const applyCloseModel = () => {
    modalData.mainBtnFunc();
    handleCloseModal();
  };
  //end of modal

  async function getGames() {
    const config = {
      headers: { authorization: BEARERKEY + localStorage.getItem("token") }
    };
    let result

    if (profile.role === roles.superAdmin) {
      result = await axios.get(`${baseURL}/game/all`).catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setGames(null);
        }
      });
    } else {
      result = await axios.get(`${baseURL}/game/user/${profile._id}`, config).catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setGames(null);
        }
      });

    }



    if (result?.data?.message == "done") {
      setGames(result.data.games);
      // console.log(result.data.games)
    }

  }

  const editGame = (gameId) => {
    setEditMode({ id: gameId, mode: "edit" })
  }

  const viewPic = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      let editModeTemp = { ...editMode }
      editModeTemp.pic = URL.createObjectURL(e.target.files[0])
      setEditMode(editModeTemp)
      setShowCropper(true)
    }
  }

  const getCropData = async () => {
    if (cropper) {
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "newAvatar.png", { type: "image/png" });
        });
      if (file) {

        editMode.pic = URL.createObjectURL(file);
        setFile(file)
        // setProfile(Profile);
        setShowCropper(false)
      }
    }
  };

  const addNewImages = async (e) => {
    if (e.target.files) {
      callModal({
        header: "Loading",
        body: "Please wait....",
        isMainBtn: false,
        isCloseBtn: false,
        isStatic: true
      });
      let body = new FormData();

      [...e.target.files].forEach((file, i) => {
        body.append(`pics`, file, file.name);
      });

      const headers = {
        "Content-Type": "multipart/form-data",
        'authorization': BEARERKEY + localStorage.getItem("token"),
      };

      const result = await axios.post(`${baseURL}/game/${editMode.id}/add/pics`, body, { headers }).catch(function (error) {
        if (error.response) {
          console.log(error.response);
          handleCloseModal()
          callModal({
            header: "Error",
            body: "Something went wrong, please try again",
            isMainBtn: false,
            closeBtnTxt: "OK",
          });
        }
      });
      if (result?.data?.message == "done") {
        handleCloseModal()
        callModal({ header: "Success!", body: "Images uploaded successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
        setGamePics(result.data.game.pics)
        getGames()
        // console.log(result.data.games)
      }
    }
  }

  const addNewVideo = async (e) => {
    if (e.target.files) {
      setGameVideo(null)
      callModal({
        header: "Loading",
        body: "Please wait....",
        isMainBtn: false,
        isCloseBtn: false,
        isStatic: true
      });
      const formData = new FormData();
      formData.append("video", e.target.files);

      let body = { video: e.target.files[0] }
      const headers = {
        "Content-Type": "multipart/form-data",
        'authorization': BEARERKEY + localStorage.getItem("token"),
      };

      const result = await axios.post(`${baseURL}/game/${editMode.id}/add/video`, body, { headers }).catch(function (error) {
        if (error.response) {
          console.log(error.response);
          handleCloseModal()
          callModal({
            header: "Error",
            body: "Something went wrong, please try again",
            isMainBtn: false,
            closeBtnTxt: "OK",
          });
        }
      });
      console.log(result)
      if (result?.data?.message == "done") {
        handleCloseModal()
        callModal({ header: "Success!", body: "Video uploaded successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
        setGameVideo(result.data.game.video)
        getGames()
        // console.log(result.data.games)
      }
    }
  }

  const deleteImg = async (publicId) => {
    const body = { publicId: publicId }
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.patch(`${baseURL}/game/${editMode.id}/pics/remove`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The picture deleted successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      setGamePics(result.data.game.pics)
      getGames()
      // console.log(result.data)

      // console.log(result.data.games)
    }
  }

  const editImgs = (gameId) => {
    setEditMode({ id: gameId, mode: "editImg" })
    const searchIndex = games.findIndex((game) => game._id == gameId);
    setGame(games[searchIndex])
    setGamePics(games[searchIndex].pics)
    setGameVideo(games[searchIndex].video)
  }

  const saveGame = async (gameId) => {
    callModal({
      header: "Loading",
      body: "Please wait....",
      isMainBtn: false,
      isCloseBtn: false,
      isStatic: true
    });
    setEditMode({ id: 0, mode: "view" })
    const gameName = document.getElementsByName('gameName')[0].value;
    const gameDesc = document.getElementsByName('gameDesc')[0].value;
    const gamePrice = document.getElementsByName('gamePrice')[0].value;
    const gameGenre = document.getElementsByName('gameGenre')[0].value;

    let body = { name: gameName, desc: gameDesc, price: gamePrice, genreId: gameGenre };

    if (file) {
      // console.log(file)
      const formData = new FormData();
      formData.append("image", file);
      body = { ...body, mainPic: file }
    }
    const headers = {
      "Content-Type": "multipart/form-data",
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.put(`${baseURL}/game/${gameId}/update`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        setFile(null)
        handleCloseModal()
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      setFile(null)
      handleCloseModal()
      callModal({ header: "Success!", body: "The game updated successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getGames()
      // console.log(result.data.games)
    }
  }

  const saveNewGame = async (e) => {
    e.preventDefault()
    callModal({
      header: "Loading",
      body: "Please wait....",
      isMainBtn: false,
      isCloseBtn: false,
      isStatic: true
    });

    let body = new FormData();

    //get platforms
    const checkedValue = document.getElementsByName('platforms');
    for (let i = 0; i < checkedValue.length; i++) {
      if (checkedValue[i].checked) {
        body.append(`platform`, checkedValue[i].id);
      }
    }

    body.append("name", document.getElementById("newGameName").value);
    body.append("desc", document.getElementById("newGameDesc").value);
    body.append("price", document.getElementById("newGamePrice").value);
    body.append("released", document.getElementById("newGameReleased").value);
    body.append("genreId", document.getElementById("newGameGenre").value);
    body.append("mainPic", document.getElementById("newGameMainPic").files[0]);
    // body.append("video", document.getElementById("newGameVideo").files[0]);


    //get images
    // let pics = document.getElementById("newGamePics").files;
    // [...pics].forEach((file, i) => {
    //   body.append(`pics`, file, file.name);
    // });

    const headers = {
      "Content-Type": "multipart/form-data",
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.post(`${baseURL}/game/add`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        handleCloseModal()
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      setEditMode({ id: 0, mode: "view" })
      handleCloseModal()
      callModal({ header: "Success!", body: "Game has been added successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getGames()
      // console.log(result.data.games)
    }

  }

  const deleteGame = async (gameId) => {
    const body = {}
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.patch(`${baseURL}/game/${gameId}/delete`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The game deleted successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getGames()
      // console.log(result.data.games)
    }
  }

  const unDeleteGame = async (gameId) => {
    const body = {}
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.patch(`${baseURL}/game/${gameId}/undelete`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The game undeleted successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getGames()
      // console.log(result.data.games)
    }
  }




  useEffect(() => {
    getGames();
  }, []);

  return (
    <div className="container">
      <div className="row px-3">
        {games === "Loading" ?
          <div className="w-100 d-flex justify-content-center align-items-center bg-secondary p-5 ">
            {/* position-absolute top-0 */}
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
            <div className="m-auto d-flex flex-column align-items-center mt-5 bg-secondary">
              <img src="/error.png" className="img-fluid w-25" alt="" srcset="" />
              <p className="fs-1 mx-auto">Something went wrong....</p>
              <p className="fs-1 mx-auto">Please try again</p>
            </div>
            :
            <>
              {
                editMode.mode === "add" ?
                  <section className="add-new-game border border-secondary mb-2 d-flex flex-column justify-content-center align-items-center ">
                    <h3 className='text-center opacity-50'>Add new Game</h3>
                    <div className="container">

                      <form onSubmit={saveNewGame} className='p-2'>
                        <div className="mb-3 name" >
                          <label htmlFor="newGameName" className="form-label">Name</label>
                          <input type="text" className="form-control" id="newGameName" required />
                        </div>
                        <div className="mb-3 desc">
                          <label htmlFor="newGameDesc" className="form-label">Description</label>
                          <input type="text" className="form-control" id="newGameDesc" required />
                        </div>
                        <div className="mb-3 price">
                          <label htmlFor="newGamePrice" className="form-label">Price</label>
                          <input type="number" className="form-control" id="newGamePrice" required />
                        </div>
                        <div className="mb-3 released">
                          <label htmlFor="newGameReleased" className="form-label">Released</label>
                          <input type="date" className="form-control" id="newGameReleased" required />
                        </div>
                        <div className="mb-3 genre">
                          <label htmlFor="newGameGenre" className="form-label">Genre</label>
                          <select id="newGameGenre" className="form-select" aria-label="Default select example">
                            <option defaultValue disabled>Choose the Genre</option>
                            {genres?.map((genre) =>
                              <option key={genre._id} value={genre._id} className='text-capitalize'>{genre.name}</option>
                            )}
                          </select>
                        </div>
                        <div className="mb-3 platforms">
                          <fieldset className='reset'>
                            <legend className='reset'>Platforms</legend>
                            <div className=" form-check d-inline-block mx-3">
                              <input type="checkbox" className="form-check-input" id="pc" name="platforms" />
                              <label className="form-check-label" htmlFor="pc">PC</label>
                            </div>
                            <div className=" form-check d-inline-block mx-3">
                              <input type="checkbox" className="form-check-input" id="mobile" name="platforms" />
                              <label className="form-check-label" htmlFor="mobile">Mobile</label>
                            </div>
                            <div className=" form-check d-inline-block mx-3">
                              <input type="checkbox" className="form-check-input" id="playstation" name="platforms" />
                              <label className="form-check-label" htmlFor="playstation">Playstation</label>
                            </div>
                            <div className=" form-check d-inline-block mx-3">
                              <input type="checkbox" className="form-check-input" id="xbox" name="platforms" />
                              <label className="form-check-label" htmlFor="xbox">Xbox</label>
                            </div>
                            <div className=" form-check d-inline-block mx-3">
                              <input type="checkbox" className="form-check-input" id="nintendo" name="platforms" />
                              <label className="form-check-label" htmlFor="nintendo">Nintendo</label>
                            </div>
                          </fieldset>

                        </div>
                        <div className="mb-3 main-pic">
                          <label htmlFor="newGameMainPic" className="form-label">Main Picture</label>
                          <input className="form-control" type="file" id="newGameMainPic" />
                        </div>
                        {/* <div className="mb-3 pics">
                          <label htmlFor="newGamePics" className="form-label">Game Images</label>
                          <input className="form-control" type="file" id="newGamePics" multiple />
                        </div>
                        <div className="mb-3 vid">
                          <label htmlFor="newGameVideo" className="form-label">Video</label>
                          <input className="form-control" type="file" id="newGameVideo" />
                        </div> */}
                        <button type="submit" className="btn btn-primary me-3">Save</button>
                        <button onClick={() => { setEditMode({ id: 0, mode: "view" }) }} type="cancel" className="btn btn-secondary">Cancel</button>
                      </form>
                    </div>
                  </section>
                  :
                  ""
              }
              {
                editMode.mode === "editImg" ?
                  <section className="img-vid border border-secondary mb-2 d-flex flex-column justify-content-center align-items-center ">
                    <h3 className='text-center opacity-50'>Edit Images & video for {game?.name}</h3>
                    <div className="container">
                      <div className="row g-2 align-items-center">
                        {gameVideo ?
                          <div className="col-md-3 d-flex flex-column justify-content-center">
                            <video controls className='w-100 h-100' >
                              <source src={gameVideo.secure_url} type="video/mp4" />
                            </video>
                            <input id="changeVideo" type="file" className='d-none' onChange={addNewVideo} />
                            <label htmlFor='changeVideo' className='btn btn-primary mt-2'> Change Video </label>
                          </div>
                          :
                          <div className="col-md-3 d-flex flex-column justify-content-center">
                            <input id="addVideo" type="file" className='d-none' onChange={addNewVideo} />
                            <label htmlFor='addVideo' className='btn btn-primary mt-2'> Add Video </label>
                          </div>
                        }
                        {gamePics?.map((pic, idx) =>
                          <div key={idx} className="col-md-3 d-flex flex-column justify-content-center ">
                            <img src={pic.secure_url} alt={idx} className='img-fluid' />
                            <button className="btn btn-danger mt-2" onClick={() => deleteImg(pic.public_id)}>Delete</button>
                          </div>

                        )}

                        <input id="addImages" type="file" multiple className='d-none' onChange={addNewImages} />
                        <label htmlFor='addImages' className='btn btn-primary'> Add Images </label>

                      </div>
                    </div>
                    <button onClick={() => setEditMode({ id: 0, mode: "view" })} className='btn btn-success w-50  m-1 mb-2 mx-auto'> Done </button>
                  </section>
                  :
                  ""
              }
              <div className="new-game d-flex">
                <button
                  className="btn btn-success mb-2 ms-auto"
                  onClick={() => setEditMode({ id: 0, mode: "add" })}
                >
                  <i className="fa-solid fa-plus me-2"></i>
                  Add New Game</button>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover bg-white border ">
                  <caption>List of games</caption>
                  <thead>
                    <tr>
                      <th className='opacity-75 ' scope="col">Picture</th>
                      <th className='opacity-75 ' scope="col">Name</th>
                      <th className='opacity-75' scope="col">Description</th>
                      <th className='opacity-75' scope="col">Price</th>
                      <th className='opacity-75' scope="col">Platform</th>
                      <th className='opacity-75' scope="col">Genre</th>
                      <th className='opacity-75' scope="col">Manage</th>

                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {games?.map((game) =>
                      <tr key={game._id} >
                        <td className='gamePic w-25 w-sm-15 position-relative'>
                          {editMode.mode === "edit" && editMode.id == game._id ?
                            <>
                              <label htmlFor={`gamePic${game._id}`} className='position-absolute top-0 end-0'>
                                <i className="fa-regular fa-pen-to-square fa-2xl cursor-pointer hover-50"></i>
                              </label>
                              <input id={`gamePic${game._id}`} type="file" className='d-none' onChange={viewPic} />
                            </>
                            :
                            ""
                          }
                          {editMode.mode === "edit" && editMode.id == game._id && editMode.pic ?
                            showCropper ?
                              <div className="text-center">
                                <Cropper
                                  id="cropperComp"
                                  name="gameImg"
                                  src={editMode.pic}
                                  initialAspectRatio={6 / 6}
                                  aspectRatio={6 / 6}
                                  responsive={true}
                                  minCropBoxHeight={100}
                                  minCropBoxWidth={100}
                                  guides={false}
                                  autoCropArea={0.9}
                                  movable={false}
                                  checkOrientation={true}
                                  onInitialized={(instance) => {
                                    setCropper(instance);
                                  }}
                                  className="w-100 h-100"
                                />
                                <button onClick={getCropData} className="btn btn-outline-info mt-2">Crop Image</button>
                              </div>
                              :
                              <img
                                src={editMode.pic}
                                alt={game.slug}
                                className="rounded-circle img-fluid "
                                width="150"
                                name="gameImg"
                              /> :
                            <img
                              src={game.mainPic?.secure_url}
                              alt={game.slug}
                              className="rounded-circle img-fluid "
                              width="150"
                              name="gameImg"
                            />
                          }
                        </td>
                        <td className='game-name-t '>
                          {editMode.mode === "edit" && editMode.id == game._id ?
                            <textarea type="text" className='form-control' defaultValue={game.name} name='gameName' />
                            :
                            <span> {game.name}</span>}
                        </td>
                        <td className='desc-div w-50 w-sm-100'>
                          {editMode.mode === "edit" && editMode.id == game._id ?
                            <textarea type="text" className='form-control ' defaultValue={game.desc} name='gameDesc' />
                            :
                            <span>  {game.desc}</span>
                          }
                        </td>
                        <td className='price-div'>
                          {editMode.mode === "edit" && editMode.id == game._id ?
                            <textarea type="number" className='form-control' defaultValue={game.price} name="gamePrice" />
                            :
                            <span> {game.price}</span>
                          }
                        </td>
                        <td className='platform-div'>
                          {editMode.mode === "edit" && editMode.id == game._id ?
                            game.platform.map((e, idx) => <span key={idx} className='text-capitalize'> {e + " "}</span>)
                            :
                            game.platform.map((e, idx) => <span key={idx} className='text-capitalize'> {e + " "}</span>)
                          }
                        </td>
                        <td className='genre-div'>
                          {editMode.mode === "edit" && editMode.id == game._id ?
                            <select name='gameGenre' className="form-select" aria-label="Default select example">
                              <option defaultValue disabled>Choose the Genre</option>
                              {genres?.map((genre) =>
                                <option key={genre._id} value={genre._id} className='text-capitalize'>{genre.name}</option>
                              )}
                            </select>
                            :
                            <span> {game.genreId?.name}</span>
                          }
                        </td>
                        <td className="mange">
                          {editMode.mode === "edit" && editMode.id == game._id ?
                            <>
                              {showCropper ? "" : <button onClick={() => saveGame(game._id)} className={'btn btn-success m-1 '}> Save </button>}
                              <button onClick={() => setEditMode({ id: 0, mode: "view" })} className='btn btn-secondary m-1 '> Cancel </button>
                            </>
                            :
                            <>

                              {game.isDeleted ?
                                editMode.mode === "editImg" && editMode.id == game._id ? "" : <button onClick={() => { unDeleteGame(game._id) }} className='btn btn-danger m-1'> undelete </button>
                                :
                                <>
                                  {editMode.mode === "editImg" && editMode.id == game._id ? "" : game.createdBy._id === profile._id ? <button onClick={() => editGame(game._id)} className='btn btn-info m-1'> Edit </button> : ""}
                                  {game.createdBy._id === profile._id ? <button onClick={() => editImgs(game._id)} className='btn btn-primary m-1'> Imgs </button> : ""}
                                  {editMode.mode === "editImg" && editMode.id == game._id ? "" : <button onClick={() => {
                                    callModal({
                                      isMainBtn: true,
                                      header: "Delete game",
                                      body: "Are you sure?",
                                      mainBtnTxt: "Yes",
                                      mainBtnColor: "danger",
                                      mainBtnFunc: () => deleteGame(game._id),
                                      closeBtnTxt: "No",
                                      closeBtnColor: "success",
                                    });
                                  }} className='btn btn-danger m-1'> Delete </button>}
                                </>
                              }
                            </>
                          }
                        </td>

                      </tr>
                    )}

                  </tbody>
                </table>

              </div>

              <Modal
                show={showModal}
                onHide={handleCloseModal}
                className="text-white"
                backdrop={modalData.isStatic ? "static" : true}
                keyboard={modalData.isStatic ? false : true}
              >
                {modalData.isStatic ?
                  <Modal.Header >
                    <Modal.Title>{modalData.header}</Modal.Title>
                  </Modal.Header> :
                  <Modal.Header closeButton>
                    <Modal.Title>{modalData.header}</Modal.Title>
                  </Modal.Header>}

                <Modal.Body>{modalData.body}</Modal.Body>
                <Modal.Footer>
                  {modalData.isCloseBtn == true ?
                    <Button
                      variant={modalData.closeBtnColor}
                      onClick={handleCloseModal}
                    >
                      {modalData.closeBtnTxt}
                    </Button> : ""}
                  {modalData.isMainBtn == true ? (
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
            </>

        }
      </div>
    </div >
  )
}
