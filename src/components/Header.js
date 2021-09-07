import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import auth from '../auth';
import { useHistory } from 'react-router';
const Header=()=>{
    let history=useHistory();
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/" className="navbar-brand">
            Book
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/list"} className="nav-link">
                Books
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li>
            <li className="nav-item" onClick={()=>{
              auth.logout(()=>{
                history.push("/");
              })
              console.log(localStorage.getItem("authenticated"))
            }}>
                <Link className="nav-link">
                Logout
              </Link>
            </li>
          </div>
        </nav>
    )
}

export default Header;