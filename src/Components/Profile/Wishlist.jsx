import React, { useEffect, useState } from "react";
import { BEARERKEY, baseURL } from "../../index.js";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Wishlist() {
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
          <div className="row gutters-sm">
            <div className="col-sm-12 mb-3">
              <div className="card h-100 ">
                <div className="card-body py-0 px-0">
                  {wishList?.map((game, idx) => (
                    <div
                      key={idx}
                      className={
                        idx != wishList.length - 1
                          ? "game-check text-white-50 d-flex justify-content-between align-items-center bg-dark mx-0 mb-3 rounded-3"
                          : "game-check text-white-50 d-flex justify-content-between align-items-center bg-dark mx-0 rounded-3"
                      }
                    >
                      <div className="d-flex my-0 px-0 align-items-center">
                        <img
                          src={game.mainPic?.secure_url}
                          className="img-fluid rounded"
                          width={100}
                          height={100}
                          alt=""
                          srcSet=""
                        />
                        <Link to={`/details/${game.slug}/${game._id}`}>
                          <h6 className="game-name m-0 text-center p-3">
                            {game.name}
                          </h6>
                        </Link>
                      </div>
                      <div className="lefted pe-2">
                        <span>${game.price}</span>
                        <button
                          className="close-btn rounded-circle bg-transparent text-white ms-3"
                          onClick={() => {
                            removeFromWishList(game._id, idx);
                          }}
                        >
                          <i className="fa-solid fa-xmark fa-xs"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
