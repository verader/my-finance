import React from "react";
import { Link } from "react-router-dom";
//useSelector hooks para acceder al state contenido en el store
//useDispatch hooks para disparar acciones y modificar el state
import { useSelector, useDispatch } from "react-redux";
//importa una accion
import { setSection } from "../actions";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import "../assets/styles/Modal.css";

const Header = () => {

    //obtiene la seccion activa desde el state almancenado en el store
    const sectionActive = useSelector((state) => state.sectionActive);
    //contiene la definicion del hook useDispatch()
    const dispatch = useDispatch();

    //recibira una seccion seleccionada y disparara la
    //accion setSection() para cambiar de seccion
    const handleSetSection = (section) => {
        dispatch(setSection(section));
    };

    return (
        <div>
        <AppBar color="primary" position="sticky">
            <Toolbar>                
                <IconButton color="inherit" onClick={() => handleSetSection("dashboard")}>
                    <Link style={{color: '#FFFFFF', textDecoration: `${sectionActive === "dashboard" ? "underline" : "none"}`}} to="/">Dashboard</Link>
                </IconButton>
                <IconButton color="inherit" onClick={() => handleSetSection("periods")}>
                    <Link style={{color: '#FFFFFF', textDecoration: `${sectionActive === "periods" ? "underline" : "none"}`}} to="/periods">Periodos</Link>
                </IconButton>
                <IconButton color="inherit" onClick={() => handleSetSection("accounts")}>
                    <Link style={{color: '#FFFFFF', textDecoration: `${sectionActive === "accounts" ? "underline" : "none"}`}}  to="/accounts">Cuentas</Link>   
                </IconButton>
            </Toolbar>
        </AppBar>
            
           
            
        </div>
        
    );
};

/*
 <header>
                <nav>
                    <ul>
                        <li onClick={() => handleSetSection("dashboard") }> 
                            <Link to="/">{`${sectionActive === "dashboard" ? "*" : ""}`}Dashboard</Link>
                        </li>
                        <li onClick={() => handleSetSection("periods")} >
                            <Link to="/periods">{`${sectionActive === "periods" ? "*" : ""}`}Periodos</Link>
                        </li>
                        <li onClick={() => handleSetSection("accounts")} >
                            <Link to="/accounts">{`${sectionActive === "accounts" ? "*" : ""}`}Cuentas</Link>
                        </li>                    
                    </ul>
                </nav>
            </header>
*/

export default Header;