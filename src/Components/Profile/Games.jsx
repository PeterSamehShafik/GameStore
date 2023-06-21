import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Games() {

  const [games, setGames] = useState([])

  return <>
  {
      games? 
        // games.length != 0?
          <div className="container game">
            <div className="row">
              <div className="col-md-4">
                <div className="card rounded-3">
                  <img src='/default_game.jpg' className="card-img-top img-fluid" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Valorant</h5>
                    <div className="ms-auto">
                      <Link to="#" className="btn btn-primary">Go to game</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          // :
          // <div className="fs-5 "> Add you first Game! </div>
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
