import React, { useState } from 'react'
import "./CPNav.css"
import { Link, useOutletContext } from "react-router-dom";
import { roles } from '../../index.js';

export default function CPNav() {
    const [profile, setProfile, pathName, setPathname] = useOutletContext();
    return (
        <div className="cpnav">
            <main className="container nav-main ps-3 h-100">
                <div className="row g-2">
                    {profile.role === roles.superAdmin ?
                        <div className="col-lg-3 col-md-4 col-md-6">
                            <Link to='users' onClick={() => setPathname("/cpanel/users")} className="panel shadow bg-one px-0 py-5 text-center d-flex flex-column justify-content-center align-items-center">
                                <i className="fa-solid fa-triangle-exclamation display-3 mb-3 rounded-circle text-white opacity-75"></i>
                                <h2 className='text-white fw-bolder h4'>Users Control</h2>
                            </Link>
                        </div>
                        : ""}
                    <div className="col-lg-3 col-md-4 col-md-6">
                        <Link to='games' onClick={() => setPathname("/cpanel/games")} className="panel shadow bg-two px-0 py-5 text-center d-flex flex-column justify-content-center align-items-center">
                            <i className="fa-solid fa-gamepad display-3 mb-3 rounded-circle text-white opacity-75"></i>
                            <h2 className='text-white fw-bolder h4'>Games Control</h2>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-md-6">
                        <Link to='genres' onClick={() => setPathname("/cpanel/genres")} className="panel shadow bg-three px-0 py-5 text-center d-flex flex-column justify-content-center align-items-center">
                            <i className="fa-solid fa-earth-europe display-3 mb-3 rounded-circle text-white opacity-75"></i>
                            <h2 className='text-white fw-bolder h4'>Genre Control</h2>
                        </Link>
                    </div>
                    <div className="col-lg-3 col-md-4 col-md-6">
                        <Link to='support' onClick={() => setPathname("/cpanel/support")} className="panel shadow bg-four px-0 py-5 text-center d-flex flex-column justify-content-center align-items-center">
                            <i className="fa-regular fa-comments display-3 mb-3 rounded-circle text-white opacity-75"></i>
                            <h2 className='text-white fw-bolder h4'>My Support</h2>
                        </Link>
                    </div>

                </div>
            </main>
            <div className="px-3">
                <hr className='px-5 mx-auto ' />
            </div>
            <div className="last-seen  ps-3 d-flex align-items-center">
                <i className="fa-regular fa-circle-user rounded-circle text-dark display-5 opacity-25"></i>
                <div className="login-info ms-3 text-dark opacity-50">
                    <h6 className='mb-0 h5'>Last Login</h6>
                    <span>{profile.lastSeen}</span>
                </div>
            </div>

        </div>
    )
}
