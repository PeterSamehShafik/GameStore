import React from 'react'
import { Link } from 'react-router-dom'
import './StartScreen.css'

function StartScreen() {
    return (<>
        <div className='myVideo'>
            <video autoPlay muted loop>
                <source src="/liveWP.mp4" type="video/mp4" />
            </video>
        </div>

        <div className="mt-5 start-screen d-flex align-items-center">
            <div className="container-fluid ">
                <div className="row gy-4 mt-3">
                    <div className="col-lg-6 d-flex align-content-center align-self-end ">
                        <div className="first-row ms-lg-3 mt-lg-auto mt-5">
                            <div className="info p-3 bg-blur d-flex flex-column text-center">
                                <h1 className='display-1 fw-bolder'>Game Store</h1>
                                <p>The best destination to buy new games to competitive prices. 24 hour support, "best price" guarantee and a flawless UX. Wish for more? Tell us below — or check out our careers.</p>
                            </div>
                            <div className="app-route bg-blur mt-4 py-3 px-2 d-flex justify-content-between">
                                <button className='btn btn-info rounded-5 px-4 py-1'>
                                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                    <Link to='/home'>
                                        <span className="ms-2">Browse</span>
                                    </Link>
                                </button>
                                <button className='btn btn-light rounded-5 px-4 py-1'>
                                    <i className="fa-solid fa-dice"></i>
                                    <span className="ms-2">Play dice</span>
                                </button>
                                <button className='btn btn-light rounded-5 px-4 py-1'>
                                    <i className="fa-brands fa-github"></i>
                                    <span className="ms-2">Github</span>
                                </button>
                                <button className='btn btn-light rounded-5 px-4 py-1'>
                                    <i className="fa-brands fa-linkedin-in"></i>
                                    <span className="ms-2">LinkedIn</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="info bg-blur d-flex flex-column text-center text-white w-50 ms-lg-auto mx-auto me-lg-4">
                            <h3 className='fw-bolder mt-3'>Quick Navigation</h3>
                            <div className="app-route mt-4 pb-3 px-5 d-flex flex-column ">
                                <button className='btn btn-light mb-1 rounded-5 px-4 py-2'>
                                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                    <Link to='home'>
                                        <span className="ms-2">Game Page</span>
                                    </Link>
                                </button>
                                <button className='btn btn-light my-1 rounded-5 px-4 py-2'>
                                    <i className="fa-solid fa-bug"></i>
                                    <span className="ms-2">404 Page</span>
                                </button>
                                <button className='btn btn-light my-1 rounded-5 px-4 py-2'>
                                    <i className="fa-solid fa-bug"></i>
                                    <span className="ms-2">404 Query</span>
                                </button>
                                <button className='btn btn-light my-1 rounded-5 px-4 py-2'>
                                    <i className="fa-solid fa-address-card"></i>
                                    <span className="ms-2">About</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default StartScreen