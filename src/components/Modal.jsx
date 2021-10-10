import React from "react";
import "../assets/styles/Modal.css";
//funcion para modales
import { createPortal } from "react-dom";
import { Box, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
//import "../assets/styles/components/Modal.scss";
//import {ReactComponent as SVGClose} from "../assets/close.svg"

//En las props recibe la funcion para cerrar el modal
//y el componente hijo
//createPortal() requiere del contenido del modal y del objeto DOM en el index.html
//sobre el que se renderizará
const Modal = ( props ) => (
    props.isOpen ? 
        createPortal(
            <div className="modal">            
                <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '400px',
                    bgcolor: '#FFFFFF',
                }}
                >
                <IconButton onClick={props.onClose}>
                    <Close fontSize="large" color="action"/>
                </IconButton>                 
                {props.children}
                </Box>
            </div>,
            document.getElementById("modal"),
        ) :
        ""
);

export default Modal;