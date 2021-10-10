import React, {Fragment} from "react";
import Modal from "./Modal";
import useModal from "../custom-hooks/useModal";
import PeriodForm from "./PeriodForm";
import useSaveData from "../custom-hooks/useSaveData";
import { TableRow } from "@material-ui/core";
import { TableCell, IconButton } from "@material-ui/core";
import { Edit, DeleteForever, CheckCircle } from "@material-ui/icons";
import { currencyFormat } from "../constants/functions";
import propTypes from "prop-types";

const Period = (props) => {
    const { data, resetPeriodList } = props
    const { id, year, month, name, totalBudget, active } = data;
    const {modal, handleCloseModal, handleOpenModal} = useModal();
    const { deletePeriod } = useSaveData();

    const handleDelete = (periodId, active) => {       
        if (active){
            alert("No se puede borrar un período activo");
            return; 
        }
        
        deletePeriod(periodId)
        .then(() => {resetPeriodList()});;
    };

    return (     
        <TableRow hover role="checkbox">
            <TableCell key="1" align="right" >                
                {(active===true ? <CheckCircle fontSize="medium" color="action"/> : "")}
            </TableCell>
            <TableCell key="2" align="right">
                {year}
            </TableCell>
            <TableCell key="3" align="right">
                {month}
            </TableCell>            
            <TableCell key="4" align="right">
                {name}
            </TableCell>            
            <TableCell key="5" align="right">
                ${currencyFormat(totalBudget)}
            </TableCell>
            <TableCell key="6" align="right">
                <IconButton onClick={handleOpenModal}>
                    <Edit fontSize="medium" color="action"/>
                </IconButton>                   
                
                <Modal isOpen={modal} onClose={handleCloseModal}>
                    <PeriodForm title="Período" data={data} resetPeriodList={resetPeriodList} />
                </Modal>                    
            </TableCell> 
            <TableCell key="7" align="right">                
                <IconButton onClick={()=> handleDelete(id, active)}>
                    <DeleteForever fontSize="medium" color="action"/>
                </IconButton>                    
            </TableCell>                          
        </TableRow>     
    );    

};

/*
        <div>
            <div>
                <div key={id}>
                <span>Id: {id}</span><br/>
                <span>Activo: {(active===true ? "Si" : "No")}</span><br/>
                <span>Año: {year}</span><br/>
                <span>Mes: {month}</span><br/>
                <span>Nombre: {name}</span><br/>
                <span>Presupuesto total: {totalBudget}</span><br/>

                <p onClick={handleOpenModal}>Ver...</p>
                <p onClick={()=> handleDelete(id)}>[Delete]</p>
            
                </div>                                 
                <Modal isOpen={modal} onClose={handleCloseModal}>
                    <PeriodForm data={data} resetPeriodList={resetPeriodList} />
                </Modal>    
            </div>                           
        </div>   
*/

Period.propTypes = {
    key: propTypes.number,
    data: propTypes.object,
    resetPeriodList: propTypes.bool
}

export default Period;