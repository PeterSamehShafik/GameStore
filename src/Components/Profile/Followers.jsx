import React, { useState } from 'react'

export default function Followers() {
  const [followings, setFollowings] = useState([])
  return <>
    {
      followings?
        followings.length != 0?
          <div>follower</div>
        :
        <div className="fs-5 "> Time to make up new friends! </div>
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
