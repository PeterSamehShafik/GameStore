import React, { useEffect, useState } from 'react'
import './Cart.css'
import axios from 'axios';
import { BEARERKEY, baseURL } from '../../index.js';
//modal
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';

// import { useSelector, useDispatch } from 'react-redux';
// import { removeFromCart } from '../Redux/StoreSlices';
function Cart({ getCart, cart, setCart }) {
    const navigate = useNavigate()
    // const {games,totalPrice} = useSelector(state=>state.currentCart)
    // const dispatch = useDispatch()
    //modal
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        header: "",
        body: "",
        isMainBtn: true

    });
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const callModal = ({ header = "Are you sure?", body, closeBtnColor = "secondary", closeBtnTxt = "Close", mainBtnColor = "primary", mainBtnTxt, mainBtnFunc, isMainBtn = true } = {}) => {
        setModalData({ ...modalData, header, body, closeBtnColor, closeBtnTxt, mainBtnColor, mainBtnTxt, mainBtnFunc, isMainBtn })
        handleShowModal()
    }
    const applyCloseModel = () => {
        modalData.mainBtnFunc()
        handleCloseModal()
    }
    const navigateToGame = (gameSlug, gameId) => {
        navigate(`/details/${gameSlug}/${gameId}`)
    }
    //end of modal
    const totalPrice = 0;
    const removeGame = async (gameId, index) => {
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
            callModal({header:"Success!", body:"The game removed successfully", isMainBtn:false, closeBtnTxt:"Close", closeBtnColor:"success"})
            const newCart = { ...cart };
            newCart.total -= newCart.games[index].price;
            newCart.games.splice(index, 1);
            setCart(newCart);
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getCart()
        }
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
                        cart?.games?.length != 0 && cart.length != 0 ?
                            cart.games?.map((game, idx) =>
                                <div key={idx} className="game-check my-2 p-3 rounded-4 text-white-50 d-flex justify-content-between align-items-center">
                                    <h6 className="game-name m-0" onClick={()=>{navigateToGame(game.slug, game._id)}}>{game.name}</h6>
                                    <div className="lefted">
                                        <span>${game.price}</span>
                                        <button onClick={() => { callModal({header:"Warning!", body:"Are you sure?", mainBtnFunc:()=>{removeGame(game._id, idx)},mainBtnTxt:"Yes", mainBtnColor:"danger",closeBtnTxt:"No", closeBtnColor:"success" }) }}
                                         className='close-btn rounded-circle bg-transparent text-white ms-3'>X</button>
                                    </div>
                                </div>
                            )
                            :
                            <>
                                <div className='text-center mb-3'>
                                    <img src='/cart.png' height={300} alt="" />
                                </div>
                                    <p className='fs-4'>Cart is empty.....</p>
                            </>
                    }

                </div>

                <div className="checkout d-flex justify-content-between align-items-center">

                    <h5 className=" fw-bolder m-0">Total: ${cart.total}</h5>
                    <span className="cart text-muted fw-bolder">Checkout <strong>✚</strong></span>

                </div>

            </div>
            <Modal show={showModal} onHide={handleCloseModal} className="text-white" >
                <Modal.Header closeButton>
                    <Modal.Title>{modalData.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalData.body}</Modal.Body>
                <Modal.Footer>
                    <Button variant={modalData.closeBtnColor} onClick={handleCloseModal}>
                        {modalData.closeBtnTxt}
                    </Button>
                    {modalData.isMainBtn == true ?
                        <Button variant={modalData.mainBtnColor} onClick={applyCloseModel}>
                            {modalData.mainBtnTxt}
                        </Button>
                        : ""
                    }

                </Modal.Footer>
            </Modal>
        </div>

    </>
}

export default Cart