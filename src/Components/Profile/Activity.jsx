import axios from "axios";
import React, { useEffect, useState } from "react";
import { BEARERKEY, baseURL } from "../../index.js";
import { Link } from "react-router-dom";

export default function Activity() {
  const [activites, setActivites] = useState(null);
  const [limit, setLimit] = useState(0);

  const getActivities = async () => {
    const config = {
      headers: {
        authorization: BEARERKEY + localStorage.getItem("token"),
      },
    };
    const result = await axios
      .get(`${baseURL}/user/activity`, config)
      .catch((e) => {
        console.log("error" + e);
      });
    setActivites(result.data.user.activity);
  };
  const prev = () => {
    if(limit === 0)
    {
      return;
    }
    setLimit(limit-5);
  }
  const next = () => {
    if(limit === 25)
    {
      return;
    }
    setLimit(limit+5);
  }


  useEffect(() => {
    getActivities();
  }, []);

  return (
    <>
      {activites ? (
        activites.length !== 0 ? (
          <div className="bg-grey py-2">
            {activites?.map((activity, index) => {
              return index < limit + 5 && index >= limit ? (
                <div className="row gutters-sm" key={index}>
                  <div className="col">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <p className="ps-3">
                            {activity.message.split(":")[0]}{" "}
                            <Link
                              to={`/details/${activity.gameSlug}/${activity.gameId}`}
                            >
                              <span className="text-info">
                                {activity.message.split(":")[1]}
                              </span>
                            </Link>
                          </p>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              );
            })}
            <nav aria-label="Page navigation example">
              <ul className="pagination bg-transparent d-flex justify-content-center">
                {
                  limit === 0?
                  ''
                  :
                  <li className="page-item cursor-pointer">
                    <span className="page-link" href="#" onClick={prev}>
                      Previous
                    </span>
                  </li>
                }
                {
                  limit === 25?
                  ''
                  :
                  <li className="page-item cursor-pointer">
                    <span className="page-link" href="#" onClick={next}>
                      Next
                    </span>
                  </li>
                }
              </ul>
            </nav>
          </div>
        ) : (
          <div className="fs-5 text-center mt-5">
            {" "}
            What are you waiting for? <br />
            Start interacting with others...{" "}
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
