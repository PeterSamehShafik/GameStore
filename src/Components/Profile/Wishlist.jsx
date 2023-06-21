import React, { useEffect, useState } from "react";
import { BEARERKEY, baseURL } from "../../index.js";
import axios from "axios";

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
  useEffect(() => {
    getWishList();
  }, []);

  return <>
      {
        wishList?
          <div className="row gutters-sm">
            <div className="col-sm-12 mb-3">
              <div className="card h-100">
                <div className="card-body py-0 px-0">
                  {wishList?.map((game, idx) => (
                    <div
                      key={idx}
                      className={idx != wishList.length-1? 'game-check text-white-50 d-flex justify-content-between align-items-center bg-dark mx-0 mb-3 rounded-3' : 'game-check text-white-50 d-flex justify-content-between align-items-center bg-dark mx-0 rounded-3'}
                    >
                      <div className="d-flex my-0 px-0">
                        <img
                          src={game.mainPic?.secure_url}
                          className="img-fluid rounded"
                          width={100}
                          height={100}
                          alt=""
                          srcSet=""
                        />
                        <h6 className="game-name m-0 text-center p-3">
                          {game.name}
                        </h6>
                      </div>
                      <div className="lefted pe-2">
                        <span>${game.price}</span>
                        <button className="close-btn rounded-circle bg-transparent text-white ms-3">
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        :
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
      }
    
    </>
}
