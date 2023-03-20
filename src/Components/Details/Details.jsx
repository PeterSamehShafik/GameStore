import React from 'react'
import './Details.css'
import { Link } from 'react-router-dom';
function Details() {
    
  return <>

    <div className="container-fluid px-5">
        <header className='d-flex justify-content-between align-items-center'>
            <Link to='/home' className="back-store h4 fw-bolder">
                <i className="fa-solid fa-arrow-left me-2"></i>
                <strong>Store</strong>
            </Link>
            <div className="game-name">
                <h2 className="display-4 fw-bolder">Multiversus</h2>
            </div>
        </header>

        <div className="row">

            <div className=" col-lg-8">
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="5" aria-label="Slide 6"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="6" aria-label="Slide 7"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="https://media.rawg.io/media/games/d2e/d2ee15fda80056efef174da4ca5ae54f.jpg" className="d-block w-100" alt="..."/>
                        </div>
                        <div className="carousel-item">
                            <img src="https://media.rawg.io/media/screenshots/a95/a959b88387c0093242a5c27dad481a78.jpg" className="d-block w-100" alt=""/>
                        </div>
                        <div className="carousel-item">
                            <img src="https://media.rawg.io/media/screenshots/5cd/5cd7bf0302ac24f1c8fb6ce2c21c173e.jpg" className="d-block w-100" alt=""/>
                        </div>
                        <div className="carousel-item">
                            <img src="https://media.rawg.io/media/screenshots/5cd/5cd7bf0302ac24f1c8fb6ce2c21c173e.jpg" className="d-block w-100" alt=""/>
                        </div>
                        <div className="carousel-item">
                            <img src="https://media.rawg.io/media/screenshots/0cf/0cf0614b14c5440d2ba62c5fcda83929.jpg" className="d-block w-100" alt=""/>
                        </div>
                        <div className="carousel-item">
                            <img src="https://media.rawg.io/media/screenshots/b2c/b2c6020fb03c349a8e9528291f166b87_rkiWwUQ.jpg" className="d-block w-100" alt=""/>
                        </div>
                        <div className="carousel-item">
                            <img src="https://media.rawg.io/media/screenshots/a86/a86bc8f003efcbe42a00d05f77a3ae33.jpg" className="d-block w-100" alt=""/>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div className=" col-lg-4 d-flex flex-column justify-content-between align-items-center">
                <div className="about-section">
                    <div className="accordion text-bg-dark accordion-flush" id="accordionExample">
                        <div className="card text-bg-dark ">
                            <div className="card-header fw-bolder h4">
                                About
                            </div>
                            <div className="card-body">
                                <p className="card-text">MultiVersus is a platform fighter that lets you team up with or against your friends using some of the world’s most iconic characters including Batman, Shaggy, Superman, Bugs Bunny & more. Use unique co-op abilities, find your favorite fighter combos and save the Multiverse!</p>
                            </div>
                            <div className="card-footer text-muted p-0 bg-dark">
                                <div className="accordion-item text-bg-test ">
                                    <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                        <div className="accordion-body">
                                            <ul className='text-bg-test'>
                                                <li className='fw-bolder'>Multiverse website</li>
                                                <li className='text-white-50'>Relased: </li>
                                                <li className='text-white-50'>Platforms: </li>
                                                <li className='text-white-50'>Main Genres: </li>
                                                <li className='text-white-50'>Devlopers:</li>
                                                <li className='text-white-50'>Publishers: </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <h2 className="accordion-header" id="flush-headingOne">
                                        <button className="accordion-button collapsed text-bg-test " type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                            More
                                        </button>   
                                    </h2>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="game-functionalities mt-3 w-100 text-bg-dark d-flex p-3 justify-content-between align-items-center">
                    <div className="price-lv h5 text-muted">
                        <span className='fw-bolder m-0 me-2'>$60.32</span>
                        <span className="fav ms-auto h4">♥</span>
                    </div>
                    <span className="cart text-muted fw-bolder">Add to cart <strong>✚</strong></span>
                </div>
            </div>
        </div>
    </div>

  
  </>
}

export default Details