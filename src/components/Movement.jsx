import React from "react";
import { Fragment } from "react";
import Modal from "./Modal";
import useModal from "../custom-hooks/useModal";
import MovementForm from "./MovementForm";
import useSaveData from "../custom-hooks/useSaveData";
import { useSelector } from "react-redux";
import propTypes from "prop-types";

import { TableCell, IconButton } from "@material-ui/core";
import { Edit, DeleteForever } from "@material-ui/icons";
import { currencyFormat } from "../constants/functions";

const Movement = (props) => {
    const { data, resetMovementList, accountBalance } = props
    const { movementId, date, name, amount, type } = data;
    const {modal, handleCloseModal, handleOpenModal} = useModal();
    const { deleteMovement } = useSaveData();
    //obtiene periodo activo y tipo de cuenta desde el state almancenado en el store
    const activePeriod = useSelector((state) => state.activePeriod); 
    const accountTypeId = useSelector((state) => state.accountTypeId);

    //para una fecha en formato aaaammdd retorna en formato dd/mm/aaaa
    const getNumberToDate = (intDate) => {
        let strDate = intDate.toString();
        return strDate.substring(6) + "/" + strDate.substring(4,6) + "/" + strDate.substring(0,4);

    }

    //date viene en formato aaaammdd, se convierte a dd/mm/aaaa
    const strDate = date ? getNumberToDate(date) : "";
    data.formattedDate = strDate;

    const handleDelete = (movementId) => {
        deleteMovement(activePeriod.id, accountTypeId, movementId)
        .then(() => {resetMovementList()});;
    };

    return (     
        <Fragment>
            <TableCell key="1" align="right" >
                {strDate}
            </TableCell>
            <TableCell key="2" align="right">
                {name}
            </TableCell>
            <TableCell key="3" align="right">
                {type=== 'c' ? "$" + currencyFormat(amount.toString()) : ""}
            </TableCell>            
            <TableCell key="4" align="right">
                {type=== 'a' ? "$" + currencyFormat(amount.toString()) : ""}
            </TableCell>            
            <TableCell key="5" align="right">
                <IconButton onClick={handleOpenModal}>
                    <Edit fontSize="medium" color="action"/>
                </IconButton>                
                <Modal isOpen={modal} onClose={handleCloseModal}>
                        <MovementForm title="Movimiento" data={data} resetMovementList={resetMovementList} accountBalance={accountBalance} />
                </Modal>                  
            </TableCell> 
            <TableCell key="6" align="right">
                <IconButton onClick={()=> handleDelete(movementId)}>
                    <DeleteForever fontSize="medium" color="action"/>
                </IconButton>                                
            </TableCell>                          
        </Fragment>
    );    

};

/*
<div>                
                <div>
                    <div key={movementId}>
                    <span>Fecha {strDate}</span><br/>
                    <span>Nombre {name}</span><br/>
                    <span>amount: {amount}</span><br/>
                    <span>type: {type}</span><br/><br/>
                    <p onClick={handleOpenModal}>[Ver...]</p>
                    <p onClick={()=> handleDelete(movementId)}>[Delete]</p>
                    </div>                                 
                    <Modal isOpen={modal} onClose={handleCloseModal}>
                        <MovementForm data={data} resetMovementList={resetMovementList} accountBalance={accountBalance} />
                    </Modal>    
                </div>                           
            </div>     */

Movement.propTypes = {
    data: propTypes.object,
    resetMovementList: propTypes.bool,
    accountBalance: propTypes.number
}
            
export default Movement;