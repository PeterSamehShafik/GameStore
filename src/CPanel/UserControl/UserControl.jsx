import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { BEARERKEY, baseURL, roles } from './../../index';
import axios from 'axios';
//modal
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function UserControl() {
  const [profile, setProfile] = useOutletContext();
  const [users, setUsers] = useState("Loading")
  const [editMode, setEditMode] = useState({})
  const navigate = useNavigate()


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
    });
    handleShowModal();
  };
  const applyCloseModel = () => {
    modalData.mainBtnFunc();
    handleCloseModal();
  };
  //end of modal

  async function getUsers() {
    if (profile.role !== roles.superAdmin) {
      navigate("/cpanel")
    } else {
      const config = {
        headers: { authorization: BEARERKEY + localStorage.getItem("token") }
      };
      const result = await axios.get(`${baseURL}/user/users`, config).catch(function (error) {
        if (error.response) {
          console.log(error.response);
          setUsers(null);
        }
      });
      if (result?.data?.message == "done") {
        setUsers(result.data.users);
        // console.log(result.data.users)
      }
    }

  }

  useEffect(() => {
    getUsers();
  }, []);

  const editUser = (userId) => {
    setEditMode({ id: userId, mode: "edit" })
  }

  const saveUser = async (userId) => {
    setEditMode({ id: userId, mode: "view" })
    const role = document.getElementById(userId).value

    const body = { role: role };
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.patch(`${baseURL}/user/role/${userId}`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The User updated successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getUsers()
      // console.log(result.data.users)
    }
  }

  const blockUser = async (userId) => {
    const body = {}
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.patch(`${baseURL}/user/block/${userId}`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The User blocked successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getUsers()
      // console.log(result.data.users)
    }
  }
  const unBlockUser = async (userId) => {
    const body = {}
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.patch(`${baseURL}/user/unblock/${userId}`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The User unblocked successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getUsers()
      // console.log(result.data.users)
    }
  }
  const deleteUser = async (userId) => {
    const body = {}
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.patch(`${baseURL}/user/delete/${userId}`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The User deleted successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getUsers()
      // console.log(result.data.users)
    }
  }
  const unDeleteUser = async (userId) => {
    const body = {}
    const headers = {
      'authorization': BEARERKEY + localStorage.getItem("token"),
    };

    const result = await axios.patch(`${baseURL}/user/undelete/${userId}`, body, { headers }).catch(function (error) {
      if (error.response) {
        console.log(error.response);
        callModal({
          header: "Error",
          body: "Something went wrong, please try again",
          isMainBtn: false,
          closeBtnTxt: "OK",
        });
      }
    });
    if (result?.data?.message == "done") {
      callModal({ header: "Success!", body: "The User undeleted successfully", isMainBtn: false, closeBtnTxt: "Close", closeBtnColor: "success" })
      getUsers()
      // console.log(result.data.users)
    }
  }

  return (
    <div className="container">
      <div className="row px-3">
        {users === "Loading" ?
          <div className="w-100 d-flex justify-content-center align-items-center bg-secondary p-5 ">
            {/* position-absolute top-0 */}
            <div className="sk-chase">
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
            </div>
          </div>
          :
          users == null ?
            <div className="m-auto d-flex flex-column align-items-center mt-5 bg-secondary">
              <img src="/error.png" className="img-fluid w-25" alt="" srcset="" />
              <p className="fs-1 mx-auto">Something went wrong....</p>
              <p className="fs-1 mx-auto">Please try again</p>
            </div>
            :
            <>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover bg-white border ">
                  <caption>List of users</caption>
                  <thead>
                    <tr>
                      <th className='opacity-75 ' scope="col">Contact</th>
                      <th className='opacity-75' scope="col">Role</th>
                      <th className='opacity-75' scope="col">Manage</th>

                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {users?.map((user) =>
                      <tr key={user._id} className={user._id === profile._id ? "table-success" : ""}>
                        <td className='user-info w-sm-50 w-25 '>
                          <div className="row align-items-center">
                            <div className="col-2 d-none d-md-inline">
                              <img src={user.profilePic?.secure_url} alt={user.firstName} className='img-fluid rounded-circle' />
                            </div>
                            <div className="col-5">
                              <span className='text-muted'>{user.userName}</span>
                              <h3 className='h6'> {user.email}</h3>
                              <span class="badge text-bg-secondary opacity-75 text-capitalize fw-bold">{user.accountType}</span>
                            </div>
                          </div>

                        </td>
                        <td className='role-div'>
                          {editMode.mode === "edit" && editMode.id == user._id ?
                            <select id={user._id} className="form-select" aria-label="Default select example">
                              <option defaultValue disabled>Choose the role</option>
                              <option value={roles.superAdmin}>superAdmin</option>
                              <option value={roles.admin}>Admin</option>
                              <option value={roles.user}>User</option>
                            </select> :
                            <span> {user.role}</span>
                          }
                        </td>
                        {user._id === profile._id ?
                          <td>ME</td> :
                          <td className="mange">
                            {editMode.mode === "edit" && editMode.id == user._id ?
                              <button onClick={() => saveUser(user._id)} className='btn btn-success m-1 '> Save </button>
                              :
                              <button onClick={() => editUser(user._id)} className='btn btn-info m-1'> Edit </button>
                            }

                            {!user.isDeleted ?
                              user.isBlocked ?
                                <button onClick={() => { unBlockUser(user._id) }} className='btn btn-warning m-1'> Unblock </button> :
                                <button onClick={() => {
                                  callModal({
                                    isMainBtn: true,
                                    header: "Block User",
                                    body: "Are you sure?",
                                    mainBtnTxt: "Yes",
                                    mainBtnColor: "danger",
                                    mainBtnFunc: () => blockUser(user._id),
                                    closeBtnTxt: "No",
                                    closeBtnColor: "success",
                                  });
                                }} className='btn btn-warning m-1'> Block </button>
                              : ""}

                            {!user.isBlocked ?
                              user.isDeleted ?
                                <button onClick={() => { unDeleteUser(user._id) }} className='btn btn-danger m-1'> undelete </button> :
                                <button onClick={() => {
                                  callModal({
                                    isMainBtn: true,
                                    header: "Delete User",
                                    body: "Are you sure?",
                                    mainBtnTxt: "Yes",
                                    mainBtnColor: "danger",
                                    mainBtnFunc: () => deleteUser(user._id),
                                    closeBtnTxt: "No",
                                    closeBtnColor: "success",
                                  });
                                }} className='btn btn-danger m-1'> Delete </button>
                              : ""}
                          </td>
                        }
                      </tr>
                    )}

                  </tbody>
                </table>

              </div>
              <Modal
                show={showModal}
                onHide={handleCloseModal}
                className="text-white"
              >
                <Modal.Header closeButton>
                  <Modal.Title>{modalData.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalData.body}</Modal.Body>
                <Modal.Footer>
                  <Button
                    variant={modalData.closeBtnColor}
                    onClick={handleCloseModal}
                  >
                    {modalData.closeBtnTxt}
                  </Button>
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
            </>

        }
      </div>
    </div>
  )
}
