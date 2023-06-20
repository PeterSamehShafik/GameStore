import React from 'react'
import { useOutletContext } from "react-router-dom"

export default function Info() {
  const [profile] = useOutletContext()
  return <>
    <div className="row gutters-sm">
      <div className="col">
        <div className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">First Name</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {profile.firstName}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Last Name</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {profile.lastName}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Date of Birth</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {profile.DOB.split("T")[0]}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Email</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {profile.email}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Phone</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {profile.phone}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Age</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {profile.age}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-sm-3">
                <h6 className="mb-0">Address</h6>
              </div>
              <div className="col-sm-9 text-secondary">
                {profile.address}
              </div>
            </div>
            <hr />
          </div>
        </div>

      </div>
    </div>
  </>
}
