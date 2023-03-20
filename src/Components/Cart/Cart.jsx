import React, { useState } from 'react'
import './Cart.css'
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../Redux/StoreSlices';
function Cart() {
    // const {games,totalPrice} = useSelector(state=>state.currentCart)
    // const dispatch = useDispatch()
    const games = []
    const totalPrice = 0;
    function removeGame(game) {
        //     dispatch(removeFromCart(game))
        //     console.log(game)
    }

    return <>

        <div className="offcanvas text-bg-dark offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">My Cart</h5>
                <button type="button" className="text-bg-dark close-btn" data-bs-dismiss="offcanvas" aria-label="Close">X</button>
            </div>
            <div className="offcanvas-body d-flex flex-column justify-content-between">
                <div className="games-list">
                    {games?.map((game, idx) =>
                        <div key={idx} className="game-check my-2 p-3 rounded-4 text-white-50 d-flex justify-content-between align-items-center">
                            <h6 className="game-name m-0">{game.name}</h6>
                            <div className="lefted">
                                <span>${game.price}</span>
                                <button onClick={() => removeGame(game)} className='close-btn rounded-circle bg-transparent text-white ms-3'>X</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="checkout d-flex justify-content-between align-items-center">

                    <h5 className=" fw-bolder m-0">Total: ${totalPrice}</h5>
                    <span className="cart text-muted fw-bolder">Checkout <strong>✚</strong></span>

                </div>

            </div>
        </div>

    </>
}

export default Cart