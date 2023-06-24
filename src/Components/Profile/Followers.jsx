import axios from "axios";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BEARERKEY, baseURL } from "../../index.js";

export default function Followers() {
  const [profile, setProfile] = useOutletContext();
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
                        <div className="following d-flex justify-content-between align-items-center">
                          <div className="comment-details d-flex align-items-start">
                            <img
                              alt="user"
                              className=" rounded-circle user-pic me-2"
                              src={person.profilePic?.secure_url}
                            />
                          </div>
                          <div className="comment-body w-100">
                            <h4 className="user-name fs-5">
                              {person.firstName} {person.lastName}
                            </h4>
                            <h5 className="text-muted fs-6">
                              {person.userName}
                            </h5>
                          </div>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              removeFollowing(person._id, index);
                            }}
                          >
                            {" "}
                            Remove{" "}
                          </button>
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
