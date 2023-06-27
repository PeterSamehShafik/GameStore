import React, { useEffect, useState } from "react";
import { BEARERKEY, baseURL } from "../../index.js";
import axios from "axios";
import { Link } from "react-router-dom";
//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import jwtDecode from "jwt-decode";

export default function Wishlist() {
  const [limit, setLimit] = useState(0);
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
    });
    handleShowModal();
  };
  const applyCloseModel = () => {
    modalData.mainBtnFunc();
    handleCloseModal();
  };
  const prev = () => {
    setLimit(limit - 4);
  };
  const next = () => {
    setLimit(limit + 4);
  };
  //end of modal
  const [wishList, setWishList] = useState(null);

  const getWishList = async () => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .get(`${baseURL}/user/wishlist`, config)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
      });
    if (result?.data?.message == "done") {
      setWishList(result.data.wishList);
    }
  };
  const removeFromWishList = async (gameId, index) => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .patch(`${baseURL}/user/wishlist/remove/${gameId}`, {}, config)
      .catch((error) => {
        // handle errors
        console.log(error);
      });
    if (result?.data?.message == "done") {
      let tempWishlist = [...wishList];
      tempWishlist.splice(index, 1);
      // localStorage.setItem("wishlist", JSON.stringify(result?.data?.update?.wishList))
      setWishList(tempWishlist);
    } else {
      alert("Failed to remove game from wishlist");
    }
  };

  useEffect(() => {
    getWishList();
  }, []);

  return (
    <>
      {wishList ? (
        wishList.length != 0 ? (
          <div className="row gutters-sm wishlist">
            <div className="col-sm-12 mb-3">
              <div className="card h-100 ">
                <div className="card-body py-0 px-0">
                  {wishList?.map((game, idx) =>
                    idx < limit + 4 && idx >= limit ? (
                      <div
                        key={idx}
                        className={
                          idx != limit + 3
                            ? "game-check text-white-50 d-flex justify-content-between align-items-center bg-dark mx-0 mb-3 rounded-3"
                            : "game-check text-white-50 d-flex justify-content-between align-items-center bg-dark mx-0 rounded-3"
                        }
                      >
                        <div className="d-flex my-0 px-0 align-items-center">
                          <img
                            src={game.mainPic?.secure_url}
                            className="img-fluid rounded d-none d-sm-inline"
                            width={100}
                            height={100}
                            alt=""
                          />
                          <Link
                            to={`/details/${game.slug}/${game._id}`}
                            className=" text-truncate p-3 p-sm-0"
                          >
                            <h6 className="game-name m-0 text-center p-0 p-sm-3">
                              {game.name}
                            </h6>
                          </Link>
                          <div className="lefted pe-2 d-flex">
                            <span>${game.price}</span>
                            <button
                              className="close-btn rounded-circle bg-transparent text-white ms-3"
                              onClick={() => {
                                callModal({
                                  isMainBtn: true,
                                  header: "Are you sure?",
                                  body: "You're going to delete this game from your wishlist.",
                                  mainBtnTxt: "Yes",
                                  mainBtnColor: "danger",
                                  mainBtnFunc: () => {
                                    removeFromWishList(game._id, idx);
                                  },
                                  closeBtnTxt: "No",
                                  closeBtnColor: "success",
                                });
                              }}
                            >
                              <i className="fa-solid fa-xmark fa-xs"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )}
                  <nav aria-label="Page navigation example">
                    <ul className="pagination bg-transparent d-flex justify-content-center my-2">
                      {wishList.length - limit == 0 || limit <= 0 ? (
                        ""
                      ) : (
                        <li className="page-item cursor-pointer">
                          <span className="page-link" href="#" onClick={prev}>
                            Previous
                          </span>
                        </li>
                      )}
                      {wishList.length - limit <= 4 || limit < 0 ? (
                        ""
                      ) : (
                        <li className="page-item cursor-pointer">
                          <span className="page-link" href="#" onClick={next}>
                            Next
                          </span>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <Modal
              show={showModal}
              onHide={handleCloseModal}
              className="text-white"
            >
              <Modal.Header closeButton>
                <Modal.Title>{modalData.header}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{modalData.body}</Modal.Body>
              <Modal.Footer>
                <Button
                  variant={modalData.closeBtnColor}
                  onClick={handleCloseModal}
                >
                  {modalData.closeBtnTxt}
                </Button>
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
          </div>
        ) : (
          <div className="fs-5 text-center mt-5"> Wishlist is empty... </div>
        )
      ) : (
        <div className="row gutters-sm">
          <div className="col-sm-12 mb-3">
            <div className="mt-5 d-flex justify-content-center align-items-center top-0">
              <div className="sk-chase">
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
