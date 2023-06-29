import React from 'react'
import "./NotFound.css"
import $ from "jquery";
import { Link } from 'react-router-dom';


export default function NotFound() {
    const pauseScreen = () => {
        $('.glitch-wrapper').toggleClass('paused');
        $('.not-found').toggleClass('paused');
    }
    return <div className="not-found position-absolute top-0">
        <div className="glitch-wrapper">
            <div className="glitch-text">
                ERROR 404: Not found
            </div>
        </div>
        <div className="w-100 d-flex justify-content-center">
            <Link to="/">
                <button id='homeBtn' className="mx-auto button-49" onMouseLeave={pauseScreen} onMouseEnter={pauseScreen} role="button">Home</button>
            </Link>
        </div>


    </div>
}
