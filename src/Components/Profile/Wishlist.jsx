import React, { useEffect, useState } from "react";
import { BEARERKEY, baseURL } from "../../index.js";
import axios from "axios";
import { Link } from "react-router-dom";
//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import jwtDecode from "jwt-decode";

export default function Wishlist() {
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
          <div className="container game">
            <div className="row">
              {wishList?.map((game, idx) =>
                  <div className="col-xl-4 col-sm-6">
                    <div className="card rounded-3 bg-grey text-center mb-3" key={idx}>
                      <Link
                          to={`/details/${game.slug}/${game._id}`}
                        >
                      <img src={game.mainPic?.secure_url} className="card-img-top img-fluid" alt="..." />
                      <div className="card-body">
                        <h5 className="card-title mx-0">
                          {game.name}
                        </h5>
                        <span className="text-success fw-bold">${game.price}</span>
                      </div>
                      </Link>
                      <button className="btn btn-outline-danger w-100" onClick={() => {
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
                          }}> Remove</button>
                    </div>
                  </div>
              )}
              
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
