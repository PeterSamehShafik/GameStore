import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { BEARERKEY, baseURL } from "../../index.js";

export default function Info() {
  const [profile] = useOutletContext();
  const [info, setInfo] = useState(profile)
  const [edit, setEdit] = useState(false)

  const [newProfile, setNewProfile] = useState({
    firstName: '',
    lastName: '',
    DOB: '',
    phone: '',
    // Address: '',
  });
  const [errList, setErrList] = useState([]);
  const [regFlag, setRegFlag] = useState(false);


  const showPrevData = () => {
    const temp = {...newProfile};
    const inputs =  Array.from(document.getElementsByClassName("edit-input"));
      for (const input of inputs) {
        if(input.id === "DOB"){
          input.value = profile[input.id].split('T')[0]
        }else{
          input.value = profile[input.id]
        }
        temp[input.id] = input.value   
    }
    setNewProfile(temp);
  }
  const setData = (e) => {
    let temp = {...newProfile};
    temp[e.target.id] = e.target.value;
    setNewProfile(temp);
  }
  const submitForm = async(e) => {
    console.log("test")
    e.preventDefault();
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(10).alphanum(),
      lastName: Joi.string().min(3).max(10).alphanum(),
      DOB: Joi.string().min(10).max(10),
      phone: Joi.number(),
      address: Joi.string(),  
    });

    let joiResponse = schema.validate(newProfile, { abortEarly: false });
    if (joiResponse.error) {
      setErrList(joiResponse.error.details);
    } else {
      setErrList([]);
      setRegFlag(true);
      const config = {
        headers: {
          authorization: BEARERKEY + localStorage.getItem("token"),
        },
      };
      const result = await axios.put(`${baseURL}/user/profile/update`,newProfile,config).catch(function (error) {
        if (error.response) {
          console.log(error.response);
        }
      });
      if (result?.data?.message === "done") {
        setRegFlag(false);
        setInfo(result.data.updatedUser)
        setEdit(false);
      } else{
        setRegFlag(false);
        alert("Failed to update profile")
      }
    }
  }

  function getError(key) {
    for (const error of errList) {
      if (error.context.key === key) {
        return error.message;
      }
    }
    return "";
  }
  useEffect(() => {
    showPrevData();
  }, [edit]);
  return (
    <>
      {info ? (
        <div className="row gutters-sm">
          <div className="col">
            <div className="card mb-3 bg-grey">
              <div className="card-body">
              {
                edit?
                  <form id="editForm" onSubmit={submitForm}>
                    <div className="row mb-2">
                      <div className="col-md-3">
                        <label htmlFor="firstName" className="form-label col-form-label">First Name: </label>
                      </div>
                      <div className="col-md-9">
                        <input onChange={setData} type="text" className="form-control edit-input" id="firstName"/>
                        <p className=" fs-6 text-danger mb-3"> {getError("firstName")}</p>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-3">
                        <label htmlFor="lastName" className="form-label col-form-label">Last Name: </label>
                      </div>
                      <div className="col-md-9">
                        <input onChange={setData} type="text" className="form-control edit-input" id="lastName" />
                        <p className=" fs-6 text-danger mb-3"> {getError("lastName")}</p>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-3">
                        <label htmlFor="DOB" className="form-label col-form-label">Date of  Birth: </label>
                      </div>
                      <div className="col-md-9">
                        <input onChange={setData} type="date" className="form-control edit-input" id="DOB" />
                        <p className=" fs-6 text-danger mb-3"> {getError("DOB")}</p>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-3">
                        <label htmlFor="phone" className="form-label col-form-label">Phone: </label>
                      </div>
                      <div className="col-md-9">
                        <input onChange={setData} type="text" className="form-control edit-input" id="phone" />
                        <p className=" fs-6 text-danger mb-3"> {getError("phone")}</p>
                      </div>
                    </div>
                    {/* <div className="row mb-2">
                      <div className="col-md-3">
                        <label htmlFor="address" className="form-label col-form-label">Address: </label>
                      </div>
                      <div className="col-md-9">
                        <input onChange={setData} type="text" className="form-control edit-input" id="address" />
                        <p className=" fs-6 text-danger mb-3"> {getError("address")}</p>
                      </div>
                    </div> */}
                    
                    <div className="mb-3">
    
                    </div>
                    <button type="submit" className="btn btn-primary">
                      {
                        regFlag?
                          "Waiting..."
                        :
                          "Submit"
                      }
                    </button>
                  </form> 
                :
                  <div className="profileData position-relative">
                    {
                      localStorage.getItem("userId") === "user"?
                      ''
                      :
                      <i className="fa-regular fa-pen-to-square fa-lg position-absolute top-0 end-0" onClick={()=>{setEdit(true)}}></i>
                    }
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">First Name</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {info.firstName}
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Last Name</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {info.lastName}
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Date of Birth</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {info.DOB.split("T")[0]}
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">{info.email}</div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Phone</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">{info.phone}</div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Age</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">{info.age}</div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Address</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {info.address}
                        </div>
                      </div>
                      <hr />
                  </div>
              }
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row gutters-sm">
          <div className="col-sm-12 mb-3">
            <div className="mt-5 d-flex justify-content-center align-items-center top-0">
              <div className="sk-chase">
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
