import React, { useEffect, useState, Fragment } from "react";
//import Error from "./Error";
//import Loader from "./Loader";
import useGetAccountData from "../custom-hooks/useGetAccountData"  ;
import { useSelector } from "react-redux";
import Movement from "./Movement";
import Modal from "./Modal";
import useModal from "../custom-hooks/useModal";
import MovementForm from "./MovementForm";
import { currencyFormat } from "../constants/functions";
import ErrorMsg from "./ErrorMsg";

import { Paper } from "@material-ui/core";
import { Table } from "@material-ui/core";
import { TableBody } from "@material-ui/core";
import { TableCell } from "@material-ui/core";
import { TableContainer } from "@material-ui/core";
import { TableHead } from "@material-ui/core";
import { TableRow } from "@material-ui/core";
import { Typography, Divider, Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Box } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { Chip } from "@material-ui/core";

const MovementList = () => {
    //destructuracion de las props del custom hook
    const { monthlyAccount, loading, setLoading, error, getMonthlyAccount } = useGetAccountData();
    const {modal, handleCloseModal, handleOpenModal} = useModal();
    const [reloadSwitch, setReloadSwitch] = useState(true);

    //obtiene periodo activo y tipo de cuenta desde el state almancenado en el store
    const activePeriod = useSelector((state) => state.activePeriod);
    const accountTypeId = useSelector((state) => state.accountTypeId);
    //agrega el saldo de la cuenta a los datos del movimiento
    
    const newMovementData = {};

    //se gatilla en cada vez que se monta el componente, y cada vez que reloadSwitch cambia de valor
    useEffect(() => {
         getMonthlyAccount(activePeriod.id, accountTypeId);                                                                        
    },[reloadSwitch]);
   

    const resetMovementList = () => {
        setLoading(true);        
        //setMonthlyAccount(null);        
        setReloadSwitch(!reloadSwitch);              
    };
    
    //dependiendo de las variable de estado
    //muestra el Loading, muestra Error
    //o despliega lista de componentes 
    return (     
        <Fragment>          
            {
            loading ? (
                <span></span>
            ): error ? (
                <span></span>
            ) : ( monthlyAccount ? ( 
                        <Fragment>       
                            <Grid container spacing={2} align="center">
                                <Grid item>
                                    <Typography variant="h4">{monthlyAccount.accountName + " " + activePeriod.name}</Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={handleOpenModal}>
                                        <Add fontSize="large" color="action"/>
                                    </IconButton>                               
                                </Grid>
                            </Grid>
                            <Divider variant="middle" />    
                            <Grid container spacing={2} >
                                <Grid item>
                                    <Chip label={"Cargos: $" + currencyFormat(monthlyAccount.totalCharges.toString())} variant="outlined" color="primary" />                                    
                                </Grid>
                                <Grid item>
                                    <Chip label={"Abonos: $" + currencyFormat(monthlyAccount.totalCredit.toString())} variant="outlined" color="primary" />
                                </Grid>
                                <Grid item>
                                    <Chip label={"Saldo:$" + currencyFormat(monthlyAccount.balance.toString())} variant="outlined"  color="primary" />                                    
                                </Grid>                           
                            </Grid>                                                                                                                                   
                            <Modal isOpen={modal} onClose={handleCloseModal} >
                                <MovementForm title="Nuevo Movimiento" data={newMovementData} resetMovementList={resetMovementList} accountBalance={monthlyAccount.balance}/>
                            </Modal> 
                        </Fragment>          
                    ) : (
                        <span></span>
                    )

                )
            }

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>         
                            <TableCell key="1" align='right' >
                                Fecha
                            </TableCell>
                            <TableCell key="2" align='right' >
                                Nombre
                            </TableCell>                            
                            <TableCell key="3" align='right' >
                                Cargo
                            </TableCell>
                            <TableCell key="4" align='right' >
                                Abono
                            </TableCell>          
                            <TableCell key="5" align='right' >
                                
                            </TableCell>    
                            <TableCell key="6" align='right' >
                                
                            </TableCell>                                                                          
                        </TableRow>
                    </TableHead>       
                    <TableBody>
                    {
                        loading ? (
                            <Box>
                                <CircularProgress />
                            </Box>
                        ): error ? (
                            <ErrorMsg text="Probablemente no se ha seleccionado una cuenta" />
                        ) : (
                            monthlyAccount && monthlyAccount.movementList.map((movement) => (
                                    <TableRow hover role="checkbox" key={movement.movementId}>
                                        <Movement key={movement.movementId} data={movement} resetMovementList={resetMovementList} accountBalance={monthlyAccount.balance} />
                                    </TableRow>
                                )
                            )
                        )
                    }
                    </TableBody>                                                      
                </Table>
            </TableContainer>
            </Paper>               
        </Fragment>        
    );    

};

/*
         {
            loading ? (
                <span>Componente LOADER aqui</span>
            ): error ? (
                <span>Componente ERROR aqui</span>
            ) : (
                    monthlyAccount.movementList.map((movement) => (
                        <Movement key={movement.movementId} data={movement} resetMovementList={resetMovementList} accountBalance={monthlyAccount.balance} />
                    )
                )
            )
            }
*/

export default MovementList;