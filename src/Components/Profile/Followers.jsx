import axios from "axios";
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { BEARERKEY, baseURL } from "../../index.js";

export default function Followers({crrUser}) {
  const [profile, setProfile, id] = useOutletContext();
  const [limit, setLimit] = useState(0);
  const removeFollowing = async (userId, index) => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .patch(`${baseURL}/user/following/remove/${userId}`,{body:""}, config)
      .catch((e) => {
        console.log(e);
      });
    if (result?.data?.message === "done") {
      let temp = {...profile};
      temp.following.splice(index, 1);
      setProfile(temp)
    }
  };
  const prev = () => {
    setLimit(limit - 4);
  };
  const next = () => {
    setLimit(limit + 4);
  };
  return (
    <>
      {profile.following ? (
        profile.following.length !== 0 ? (
          <div className="bg-grey following">
            {profile.following.map((person, index) => {
              return (
                <div key={index}>
                  {index < limit + 4 && index >= limit ? (
                    <div className="my-2 p-3 bg-grey rounded-2">
                      <div className=" hover-75 bg-transparent">
                        <div className="following d-sm-flex justify-content-sm-between justify-content-center mx-sm-auto align-items-center">
                          <div className=" d-flex align-items-start ">
                            <img
                              alt="user"
                              className=" rounded-circle user-pic me-2"
                              src={person.profilePic?.secure_url}
                            />
                          </div>
                          <div className=" w-100">
                            {
                              person._id === crrUser._id?
                              <Link to={`/profile/info/${person._id}`} onClick={()=>{localStorage.setItem("userId", 'user')}}>
                                <h4 className="user-name fs-5  mb-3 text-success">
                                    {person.firstName} {person.lastName}
                                </h4>
                              </Link>
                              :
                              <Link to={`/profile/info/${person._id}`} onClick={()=>{localStorage.setItem("userId", 'user')}}>
                                <h4 className="user-name fs-5  mb-3">
                                  {person.firstName} {person.lastName}
                                </h4>
                              </Link>
                            }
                          </div>
                          {
                            localStorage.getItem("userId") === "user"?
                            ''
                            :
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                removeFollowing(person._id, index);
                              }}
                            >
                              {" "}
                              Unfollow{" "}
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
            <nav aria-label="Page navigation example">
              <ul className="pagination bg-transparent d-flex justify-content-center pb-2">
                {profile.following.length - limit == 0 || limit <= 0 ? (
                  ""
                ) : (
                  <li className="page-item cursor-pointer">
                    <span className="page-link" href="#" onClick={prev}>
                      Previous
                    </span>
                  </li>
                )}
                {profile.following.length - limit <= 4 || limit < 0 ? (
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
        ) : (
          <div className="fs-5 text-center mt-5">
            {" "}
            Time to make up new friends!{" "}
          </div>
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
