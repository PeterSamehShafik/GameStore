import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL, BEARERKEY } from "./../../index.js";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [wishList, setWishList] = useState([])
  const getProfile = async () => {
    const config = {
        headers: {
          authorization: BEARERKEY + localStorage.getItem("token"),
        },
      };
    const result = await axios
      .get(`${baseURL}/user/profile`, config)
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
      });
    if(result?.data?.message  == "done"){
        setProfile(result.data.user)
    }
  };
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
    if(result?.data?.message  == "done"){
        setWishList(result.data.wishList)
    }
  };
  useEffect(() => {
    getProfile();
    getWishList();
  }, []);


  return <>
      {
        profile?
        <div className="container profile">
        <header className="d-flex justify-content-between align-items-center mb-2">
          <Link to="/home" className="back-store h4 fw-bolder">
            <i className="fa-solid fa-arrow-left me-2"></i>
            <strong>Store</strong>
          </Link>
        </header>
        <div className="main-body">
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb"></ol>
          </nav>

          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center ">
                    <img
                      src={profile.profilePic?.secure_url }
                      alt="Profile Picture"
                      className="rounded-circle"
                      width="150"
                    />
                    <div className="mt-3">
                      <h4>{profile.firstName} {profile.lastName}</h4>
                      <h6 className="text-muted text-center">{profile.userName}</h6>
                      <p className="text-muted fs-6 mb-0">Followers: {profile.followings}</p>
                      <p className="text-muted fs-6">Following: </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <h3> Personal Information </h3>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">First Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {profile.firstName}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Last Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{profile.lastName}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Date of Birth</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{profile.DOB}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{profile.email}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Phone</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                    {profile.phone}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Age</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{profile.age}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Address</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                    {profile.address}
                    </div>
                  </div>
                  <hr />
                </div>
              </div>

              <div className="row gutters-sm">
                <h3>WishList</h3>
                <div className="col-sm-12 mb-3">
                  <div className="card h-100">
                    <div className="card-body ps-0">
                        {
                            wishList?.map((game, idx) =>
                                    <div key={idx} className="game-check my-2 rounded-4 text-white-50 d-flex justify-content-between align-items-center">
                                        <div className="d-flex ">

                                        <img src={game.mainPic?.secure_url} className="img-fluid rounded" width={100} height={100} alt="" srcSet="" />
                                        <h6 className="game-name m-0 text-center p-3">{game.name}</h6>
                                        </div>
                                        <div className="lefted pe-3">
                                            <span>${game.price}</span>
                                            <button className='close-btn rounded-circle bg-transparent text-white ms-3'>X</button>
                                        </div>
                                    </div>
                            )
                        }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        :
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
      }
    </>

}
