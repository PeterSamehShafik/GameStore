import React from 'react'
import './Navigation.css'
import './NavigationMediaQuery.css'
function Navigation() {
    return <>

    <nav className='side-nav'>
        <div className="d-flex flex-column flex-shrink-0 p-3 pt-3 text-white bg-transparent ms-4 me-0 " >
            <div className="fllters">
                <ul className="nav nav-pills flex-column mb-auto">
                    <h2 className='fw-bolder h3 mb-3'>Filters</h2>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-gift icon me-2 rounded-3"></i>
                            <span>Wishlist</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-star icon me-2 rounded-3"></i>
                            <span>Ratings</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-hand-sparkles icon me-2 rounded-3"></i>
                            <span>Reviews</span>
                        </a>                        
                    </li>
                </ul>
            </div>
            <div className="geners mt-3 ">
                <ul className="nav nav-pills flex-column mb-auto">
                    <h2 className='fw-bolder h3 mb-3'>Genres</h2>
                    <li className="nav-item my-2 ">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-hand-back-fist icon me-2 rounded-3"></i>
                            <span>Action</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-chess-knight icon me-2 rounded-3"></i>
                            <span>Strategy</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-khanda icon me-2 rounded-3"></i>
                            <span>RPG</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-gun icon me-2 rounded-3"></i>
                            <span>Shooter</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-brands fa-space-awesome icon me-2 rounded-3"></i>
                            <span>Adventure</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-puzzle-piece icon me-2 rounded-3"></i>
                            <span>Puzzle</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-flag-checkered icon me-2 rounded-3"></i>
                            <span>Racing</span>
                        </a>                        
                    </li>
                    <li className="nav-item my-2">
                        <a href="#" className="nav-link ps-0  d-flex align-items-center" aria-current="page">
                            <i className="fa-solid fa-football icon me-2 rounded-3"></i>
                            <span>Sports</span>
                        </a>                        
                    </li>
                </ul>
            </div>


            {/* <hr/>
            <div className="dropdown">
            <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2"/>
                <strong>mdo</strong>
            </a>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li><a className="dropdown-item" href="#">New project...</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><hr className="dropdown-divider"/></li>
                <li><a className="dropdown-item" href="#">Sign out</a></li>
            </ul>
            </div> */}
        </div>
    </nav>

    </>
}

export default Navigation