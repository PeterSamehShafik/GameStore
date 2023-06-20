import React, { useEffect, useState } from 'react'
import './Cart.css'
import axios from 'axios';
import { BEARERKEY, baseURL } from '../../index.js';
// import { useSelector, useDispatch } from 'react-redux';
// import { removeFromCart } from '../Redux/StoreSlices';
function Cart({getCart, cart, setCart}) {
    // const {games,totalPrice} = useSelector(state=>state.currentCart)
    // const dispatch = useDispatch()
    const totalPrice = 0;
    const removeGame = async(gameId, index)=> {
        const config = {
            headers: {
              authorization: BEARERKEY + localStorage.getItem("token"),
            },
        };
        const body = {
            body: "",
          };
          const result = await axios
            .put(`${baseURL}/cart/remove/${gameId}`, body, config)
            .catch(function (error) {
              if (error.response) {
                console.log(error.response);
              }
            });
          if (result?.data?.message == "done") {
            alert("Removed!");
            const newCart = {...cart};
            newCart.total -= newCart.games[index].price;
            newCart.games.splice(index, 1);
            setCart(newCart);
          }
    }

    useEffect(() => {
        getCart()
      }, []);
    return <>

        <div className="offcanvas text-bg-dark offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasExampleLabel">My Cart</h5>
                <button type="button" className="text-bg-dark close-btn" data-bs-dismiss="offcanvas" aria-label="Close">X</button>
            </div>
            <div className="offcanvas-body d-flex flex-column justify-content-between">
                <div className="games-list">
                    {
                        cart.length != 0?
                            cart.games?.map((game, idx) =>
                                <div key={idx} className="game-check my-2 p-3 rounded-4 text-white-50 d-flex justify-content-between align-items-center">
                                    <h6 className="game-name m-0">{game.name}</h6>
                                    <div className="lefted">
                                        <span>${game.price}</span>
                                        <button  onClick={() => {removeGame(game._id, idx)}} className='close-btn rounded-circle bg-transparent text-white ms-3'>X</button>
                                    </div>
                                </div>
                            )
                        
                            :
                            <>
                                <p className='fs-4'>Cart is empty.....</p>
                            </>
                    }
                    
                </div>

                <div className="checkout d-flex justify-content-between align-items-center">

                    <h5 className=" fw-bolder m-0">Total: ${cart.total}</h5>
                    <span className="cart text-muted fw-bolder">Checkout <strong>✚</strong></span>

                </div>

            </div>
        </div>

    </>
}

export default Cart