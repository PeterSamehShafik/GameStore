import React, { useState } from 'react'
import "./MySupport.css"
import emailjs from '@emailjs/browser';
import { useOutletContext } from 'react-router-dom';

//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function MySupport() {
    const [profile] = useOutletContext();

    //modal
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        header: "",
        body: "",
        isMainBtn: true,
    });
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const callModal = ({
        header = "Are you sure?",
        body,
        closeBtnColor = "secondary",
        closeBtnTxt = "Close",
        mainBtnColor = "primary",
        mainBtnTxt,
        mainBtnFunc,
        isMainBtn = true,
        isCloseBtn = true,
        isStatic = false
    } = {}) => {
        setModalData({
            ...modalData,
            header,
            body,
            closeBtnColor,
            closeBtnTxt,
            mainBtnColor,
            mainBtnTxt,
            mainBtnFunc,
            isMainBtn,
            isCloseBtn,
            isStatic
        });
        handleShowModal();
    };
    const applyCloseModel = () => {
        modalData.mainBtnFunc();
        handleCloseModal();
    };
    //end of modal

    const sendEmail = (e) => {
        e.preventDefault()
        callModal({
            header: "Loading",
            body: "Please wait....",
            isMainBtn: false,
            isCloseBtn: false,
            isStatic: true,
          });

        emailjs.send('service_721mdfl', 'template_x4hurtm', {
            subject: document.getElementById('subject').value,
            user_name: `${profile.firstName} ${profile.lastName} `,
            user_email: profile.email,
            message: document.getElementById('message').value,
        }, 'VzoIZXhoU3k2oltf9')
            .then((result) => {
                document.getElementById('message').value=""
                document.getElementById('subject').value=""
                handleCloseModal()
                callModal({
                    header: "Success!",
                    body: "We've got your message, thank you for helping.",
                    isMainBtn: false,
                    closeBtnTxt: "Close",
                    closeBtnColor: "success",
                });
            }, (error) => {
                console.log(error)
                handleCloseModal()
                callModal({
                    header: "Error",
                    body: "Something went wrong, please try again",
                    isMainBtn: false,
                    closeBtnTxt: "OK",
                });
            });
    
    }

    return (
        <div className="my-support">
            <div className="container rounded shadow">
                <div className="contact w-100 w-sm-75 mx-auto">
                    <div className="contact-data w-100 w-sm-75 mx-auto">
                        <h2 className='h1 text-white'>Contact Us</h2>
                        <hr />
                        <form onSubmit={sendEmail}> 
                            <label htmlFor="user_name"><input disabled readOnly className='form-control my-2' type="text" id="name" value={`${profile.firstName} ${profile.lastName} `} /></label>
                            <label htmlFor="user_email"><input disabled readOnly className='form-control my-2' type="email" id="email" value={profile.email} /></label>
                            <label htmlFor="subject"><input required className='form-control my-2' type="text" id="subject" placeholder='Subject' /></label>
                            <label htmlFor="message"><textarea required   className='form-control my-2' name="message" id="message" cols="30" rows="10" placeholder="Leave us a message."></textarea></label>
                            <input className='btn p-4 fa-xl' type="submit" value="Send Email" />

                        </form>

                    </div>
                </div>
            </div>
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                className="text-white"
                backdrop={modalData.isStatic ? "static" : true}
                keyboard={modalData.isStatic ? false : true}
            >
                {modalData.isStatic ?
                    <Modal.Header >
                        <Modal.Title>{modalData.header}</Modal.Title>
                    </Modal.Header> :
                    <Modal.Header closeButton>
                        <Modal.Title>{modalData.header}</Modal.Title>
                    </Modal.Header>}

                <Modal.Body>{modalData.body}</Modal.Body>
                <Modal.Footer>
                    {modalData.isCloseBtn == true ?
                        <Button
                            variant={modalData.closeBtnColor}
                            onClick={handleCloseModal}
                        >
                            {modalData.closeBtnTxt}
                        </Button> : ""}
                    {modalData.isMainBtn == true ? (
                        <Button
                            variant={modalData.mainBtnColor}
                            onClick={applyCloseModel}
                        >
                            {modalData.mainBtnTxt}
                        </Button>
                    ) : (
                        ""
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    )
}
