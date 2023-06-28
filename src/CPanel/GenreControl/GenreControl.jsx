import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { BEARERKEY, baseURL, roles } from './../../index';
import axios from 'axios';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function GenreControl() {
  const [profile, setProfile, pathName, setPathname, totalGenres, setTotalGenres, getGenre] = useOutletContext();
  const [genres, setGenres] = useState("Loading")
  const [editMode, setEditMode] = useState({})
  const [file, setFile] = useState(null);


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

  //crop
  const [showCropper, setShowCropper] = useState(false)
  const [cropper, setCropper] = useState(null)


  const editGenre = (genreId) => {
    setEditMode({ id: genreId, mode: "edit" })
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


  // const deleteImg = async (publicId) => {
  //   const body = { publicId: publicId }
  //   const headers = {
  //     'authorization': BEARERKEY + localStorage.getItem("token"),
  //   };

  //   const result = await axios.patch(`${baseURL}/genre/${editMode.id}/pics/remove`, body, { headers }).catch(function (error) {
  //     if (error.response) {
  //       console.log(error.response);
  //       callModal({
  //         header: "Error",
  //         body: "Something went wrong, please try again",
  //         isMainBtn: false,
  //         closeBtnTxt: "OK",
  //       });
  //     }
  //   });
  //   if (result?.data?.message == "done") {
  //     callModal({ header: "Success!", body: "The picture deleted successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
  //     setgenrePics(result.data.genre.pics)
  //     getMyGenre()
  //     // console.log(result.data)

  //     // console.log(result.data.genres)
  //   }
  // }
  async function getMyGenre() {
    getGenre()
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
      // console.log(result.data)
    }

  }

  const saveGenre = async (genreId) => {
    callModal({
      header: "Loading",
      body: "Please wait....",
      isMainBtn: false,
      isCloseBtn: false,
      isStatic: true
    });
    setEditMode({ id: 0, mode: "view" })
    const genreName = document.getElementsByName('genreName')[0].value;
    const genreDesc = document.getElementsByName('genreDesc')[0].value;

    let body = { name: genreName, desc: genreDesc };

    if (file) {
      // console.log(file)
      const formData = new FormData();
      formData.append("image", file);
      body = { ...body, image: file }
    }
    const headers = {
      "Content-Type": "multipart/form-data",
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.put(`${baseURL}/genre/update/${genreId}`, body, { headers }).catch(function (error) {
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
      callModal({ header: "Success!", body: "The genre updated successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getMyGenre()
      // console.log(result.data.genres)
    }
  }

  const saveNewGenre = async (e) => {
    e.preventDefault()
    callModal({
      header: "Loading",
      body: "Please wait....",
      isMainBtn: false,
      isCloseBtn: false,
      isStatic: true
    });

    let body = new FormData();

    body.append("name", document.getElementById("newGenreName").value);
    body.append("desc", document.getElementById("newGenreDesc").value);
    if (document.getElementById("newGenreImage").files[0]) {
      body.append("image", document.getElementById("newGenreImage").files[0]);
    }

    const headers = {
      "Content-Type": "multipart/form-data",
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.post(`${baseURL}/genre/add`, body, { headers }).catch(function (error) {
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
      callModal({ header: "Success!", body: "genre has been added successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getMyGenre()
      // console.log(result.data.genres)
    }

  }

  const deleteGenre = async (genreId) => {
    const body = {}
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.delete(`${baseURL}/genre/delete/${genreId}`, { headers }).catch(function (error) {
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
      callModal({ header: "Success!", body: "The genre deleted successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getMyGenre()
      // console.log(result.data.genres)
    }
  }


  useEffect(() => {
    getMyGenre();
  }, []);

  return (
    <div className="container">
      <div className="row px-3">
        {genres === "Loading" ?
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
          genres == null ?
            <div className="m-auto d-flex flex-column align-items-center mt-5 bg-secondary">
              <img src="/error.png" className="img-fluid w-25" alt="" srcset="" />
              <p className="fs-1 mx-auto">Something went wrong....</p>
              <p className="fs-1 mx-auto">Please try again</p>
            </div>
            :
            <>
              {
                editMode.mode === "add" ?
                  <section className="add-new-genre border border-secondary mb-2 d-flex flex-column justify-content-center align-items-center ">
                    <h3 className='text-center opacity-50'>Add new genre</h3>
                    <div className="container">

                      <form onSubmit={saveNewGenre} className='p-2'>
                        <div className="mb-3 name" >
                          <label htmlFor="newGenreName" className="form-label">Name</label>
                          <input type="text" className="form-control" id="newGenreName" required />
                        </div>
                        <div className="mb-3 desc">
                          <label htmlFor="newGenreDesc" className="form-label">Description</label>
                          <input type="text" className="form-control" id="newGenreDesc" required />
                        </div>
                        <div className="mb-3 main-pic">
                          <label htmlFor="newGenreImage" className="form-label">Main Picture</label>
                          <input className="form-control" type="file" id="newGenreImage" />
                        </div>
                        <button type="submit" className="btn btn-primary me-3">Save</button>
                        <button onClick={() => { setEditMode({ id: 0, mode: "view" }) }} type="cancel" className="btn btn-secondary">Cancel</button>
                      </form>
                    </div>
                  </section>
                  :
                  ""
              }
              <div className="new-genre d-flex">
                <button
                  className="btn btn-success mb-2 ms-auto"
                  onClick={() => setEditMode({ id: 0, mode: "add" })}
                >
                  <i className="fa-solid fa-plus me-2"></i>
                  Add New genre</button>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover bg-white border ">
                  <caption>List of genres</caption>
                  <thead>
                    <tr>
                      <th className='opacity-75 ' scope="col">Picture</th>
                      <th className='opacity-75 ' scope="col">Name</th>
                      <th className='opacity-75' scope="col">Description</th>
                      <th className='opacity-75' scope="col">Manage</th>

                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {genres?.map((genre) =>
                      <tr key={genre._id} >
                        <td className='genrePic w-25 w-sm-15 position-relative'>
                          {editMode.mode === "edit" && editMode.id == genre._id ?
                            <>
                              <label htmlFor={`genrePic${genre._id}`} className='position-absolute top-0 end-0'>
                                <i className="fa-regular fa-pen-to-square fa-2xl cursor-pointer hover-50"></i>
                              </label>
                              <input id={`genrePic${genre._id}`} type="file" className='d-none' onChange={viewPic} />
                            </>
                            :
                            ""
                          }
                          {/* {editMode.mode === "edit" && editMode.id == genre._id && editMode.pic ?
                          <img src={editMode.pic} alt={genre.slug} className='img-fluid rounded-circle ' name="genreImg" />
                          :
                          <img src={genre.image?.secure_url} alt={genre.slug} className='img-fluid rounded-circle ' name="genreImg" />
                        } */}
                          {editMode.mode === "edit" && editMode.id == genre._id && editMode.pic ?
                            showCropper ?
                              <div className="text-center">
                                <Cropper
                                  id="cropperComp"
                                  name="genreImg"
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
                                alt={genre.slug}
                                className="rounded-circle img-fluid "
                                width="150"
                                name="genreImg"
                              /> :
                            <img
                              src={genre.image?.secure_url}
                              alt={genre.slug}
                              className="rounded-circle img-fluid "
                              width="150"
                              name="genreImg"
                            />
                          }
                        </td>
                        <td className='genre-name-t '>
                          {editMode.mode === "edit" && editMode.id == genre._id ?
                            <textarea type="text" className='form-control' defaultValue={genre.name} name='genreName' />
                            :
                            <span className='text-capitalize'> {genre.name}</span>}
                        </td>
                        <td className='desc-div'>
                          {editMode.mode === "edit" && editMode.id == genre._id ?
                            <textarea type="text" className='form-control ' defaultValue={genre.desc} name='genreDesc' />
                            :
                            <span> {genre.desc}</span>
                          }
                        </td>
                        <td className="mange">
                          {editMode.mode === "edit" && editMode.id == genre._id ?
                            <>
                              {showCropper ? "" : <button onClick={() => saveGenre(genre._id)} className='btn btn-success m-1 '> Save </button>}
                              <button onClick={() => setEditMode({ id: 0, mode: "view" })} className='btn btn-secondary m-1 '> Cancel </button>
                            </>
                            :
                            <>
                              {editMode.mode === "editImg" && editMode.id == genre._id ? "" : <button onClick={() => editGenre(genre._id)} className='btn btn-info m-1'> Edit </button>}
                              {editMode.mode === "editImg" && editMode.id == genre._id ? "" : <button onClick={() => {
                                callModal({
                                  isMainBtn: true,
                                  header: "Delete genre",
                                  body: "Are you sure? any game with this genre will be deleted !",
                                  mainBtnTxt: "Yes",
                                  mainBtnColor: "danger",
                                  mainBtnFunc: () => deleteGenre(genre._id),
                                  closeBtnTxt: "No",
                                  closeBtnColor: "success",
                                });
                              }} className='btn btn-danger m-1'> Delete </button>}
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
