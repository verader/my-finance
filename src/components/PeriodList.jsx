import React, { useState, useEffect, Fragment } from "react";
//import Error from "./Error";
//import Loader from "./Loader";
import useGetPeriodsData from "../custom-hooks/useGetPeriodsData";
import Period from "./Period";
import Modal from "./Modal";
import useModal from "../custom-hooks/useModal";
import PeriodForm from "./PeriodForm";

import { Paper } from "@material-ui/core";
import { Table } from "@material-ui/core";
import { TableBody } from "@material-ui/core";
import { TableCell } from "@material-ui/core";
import { TableContainer } from "@material-ui/core";
import { TableHead } from "@material-ui/core";
import { TableRow } from "@material-ui/core";
import { Grid, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Box } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";


const PeriodsList = () => {
    //destructuracion de las props del custom hook
    const { periodList, loading, error, getPeriodList, setLoading } = useGetPeriodsData();
    const {modal, handleCloseModal, handleOpenModal} = useModal();
    const [reloadSwitch, setReloadSwitch] = useState(true);

    const newPeriodData = {id:null};

    //hooks que se gatilla en cada vez que se monta el componente
    useEffect(() => {
        getPeriodList();        
    },[reloadSwitch]);

    const resetPeriodList = () => {
        setLoading(true);                
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
            ) : ( periodList ? ( 
                    <Fragment>
                    <Grid container spacing={2} align="center">
                        <Grid item>
                            <Typography variant="h4">Períodos</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={handleOpenModal}>
                                <Add fontSize="large" color="action"/>
                            </IconButton>                             
                        </Grid>
                    </Grid>
                                
                    <Modal isOpen={modal} onClose={handleCloseModal} >
                        <PeriodForm title="Nuevo Período" data={newPeriodData} resetPeriodList={resetPeriodList}/>
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
                                Activo
                            </TableCell>
                            <TableCell key="2" align='right' >
                                Año
                            </TableCell>                            
                            <TableCell key="3" align='right' >
                                Mes
                            </TableCell>
                            <TableCell key="4" align='right' >
                                Nombre
                            </TableCell>          
                            <TableCell key="5" align='right' >
                                Presupuesto total
                            </TableCell>                                      
                            <TableCell key="6" align='right' >
                                
                            </TableCell>    
                            <TableCell key="7" align='right' >
                                
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
                        <span>Componente ERROR aqui</span>
                    ) : (                     
                        periodList.map((period) => (                            
                            <Period key={period.id} data={period} resetPeriodList={resetPeriodList} />
                        ))                
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

*/

export default PeriodsList;