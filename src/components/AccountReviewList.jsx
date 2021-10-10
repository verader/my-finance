import React, { useEffect, Fragment } from "react";
//import Error from "./Error";
//import Loader from "./Loader";
import { Link } from "react-router-dom";
import useGetAccountData from "../custom-hooks/useGetAccountData"  ;
import { useSelector, useDispatch } from "react-redux";
//importa una accion
import { setSection, setAccountTypeId } from "../actions";
import ErrorMsg from "./ErrorMsg";

import { Card } from "@material-ui/core";
import { CardActions } from "@material-ui/core";
import { CardContent } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Chip } from "@material-ui/core";
import { ListAlt } from "@material-ui/icons";
import { withRouter } from "react-router";

import { currencyFormat } from "../constants/functions";


const AccountReviewList = ({history}) => {
    //destructuracion de las props del custom hook
    const { periodSummary, loading, error, getPeriodSummary } = useGetAccountData();

    //obtiene periodo activo desde el state almancenado en el store
    const activePeriod = useSelector((state) => state.activePeriod); 
    
    //contiene la definicion del hook useDispatch()
    const dispatch = useDispatch();

    //hooks que se gatilla en cada vez que se monta el componente
    useEffect(() => {
        
        if (activePeriod.id){
            getPeriodSummary(activePeriod.id);        
        }
        else{            
            throw new Error("No existe período activo !!!");
        }
    },[]);

    //recibira una seccion seleccionada y disparara la
    //accion setSection() para cambiar de seccion
    const handleSelectAccount = (section, accountTypeId) => {
        dispatch(setSection(section));
        dispatch(setAccountTypeId(accountTypeId));
        history.push("/monthlyAccount");
    };

    //dependiendo de las variable de estado
    //muestra el Loading, muestra Error
    //o despliega lista de componentes 
    return (
        <Fragment>
            <Typography variant="h3">{activePeriod.name}</Typography>
            <Divider variant="middle" />
            {
            loading ? (
                <Box>
                    <CircularProgress />
                </Box>
            ): error ? (
                <ErrorMsg text={"Problemas al obtener información del período " + activePeriod.name} />
            ) : (                
                periodSummary.map((account) => (                                    
                    <Card key={account.accountTypeId} variant="outlined">
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }}  gutterBottom>
                            Cuenta: {account.accountName}
                            </Typography>
                            <Typography variant="h5" component="div">
                            Saldo ${currencyFormat(account.balance.toString())}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} >
                            Cargos: $ {currencyFormat(account.c.toString())}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} >
                            Abonos: ${currencyFormat(account.a.toString())}
                            </Typography>                            
                            <Typography variant="body2">
                            Presupuesto: ${currencyFormat(account.budget.toString())}
                            </Typography>
                        </CardContent>
                        <CardActions>

                            <Chip icon={<ListAlt/>} label="Movimientos" color="primary" onClick={() => handleSelectAccount("monthlyAccount",account.accountTypeId)}>
                                <Link to="/monthlyAccount">Movimientos</Link>
                            </Chip>

                            </CardActions>                            
                        </Card>                                                                                               
                ))
            )
            }
        </Fragment>
    );    

};

/*
                            <Button size="small" 
                                onClick={() => handleSelectAccount("monthlyAccount",account.accountTypeId) }                                
                            >
                                <Link to="/monthlyAccount">Movimientos</Link>
                            </Button>
*/

export default withRouter(AccountReviewList);