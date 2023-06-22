import React, { useState } from "react";

export default function Activity() {
  const [activites, setActivites] = useState([])



  return <>
  {
    activites?
      activites.length != 0?
        <div className="row gutters-sm">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <p className="ps-3">
                    You have added <span className="text-info">game</span>
                  </p>
                </div>
                <hr className="my-0" />
              </div>
            </div>
          </div>
        </div>
      :
        <div className="fs-5 text-center mt-5"> What are you waiting for? <br />Start interacting with others... </div>
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
