import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { baseURL } from './../../index.js';

export default function Games() {

  
  const [profile] = useOutletContext();
  const [games, setGames] = useState(null)
  const [allDeleted, setAllDeleted] = useState(false)
  const getGames = async() => {
    const result = await axios.get(`${baseURL}/game/user/${profile?._id}`).catch(e=>
      console.log(e)
    )
    let count = 0;
    for(let i = 0;i < result?.data?.games?.length;i++){
      if(result?.data?.games[i].isDeleted){
        count++;
      }
    }
    if(count == result?.data?.games?.length){
      setAllDeleted(true)
    }
    setGames(result?.data?.games)
  }

  useEffect(() => {
    getGames()

  }, [])
  

  return <>
  {
      games? 
        games.length !== 0 && !allDeleted?
          <div className="container game">
            <div className="row">
            {
              games?.map((game, idx) => {
                return <>
                {
                  game.isDeleted?
                  ''
                  :
                  <div className="col-xl-4 col-sm-6" key={idx}>
                  <div className="card rounded-3 bg-grey mb-3 text-center hover-50">
                    <img src={game.mainPic.secure_url} className="card-img-top img-fluid" alt="..." />
                    <div className="card-body pb-0 px-0">
                      <h5 className="card-title text-truncate">{game.name}</h5>
                      <div className="mt-3">
                        <Link to={`/details/${game.gameSlug}/${game._id}`} className="btn btn-outline-primary w-100">Go to game</Link>
                      </div>
                    </div>
                  </div>
                </div>
                }
                </>
              })
            }
            </div>
          </div>
          :
          <div className="fs-5 text-center mt-5"> Add you first Game! </div>
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
