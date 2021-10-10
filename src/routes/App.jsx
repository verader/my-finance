import React,{ Suspense, lazy, useEffect, Fragment } from "react";
import { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "../containers/Dashboard";
import useGetPeriodsData from "../custom-hooks/useGetPeriodsData"  ;
import { useDispatch } from "react-redux";
//importa una accion
import { setPeriod } from "../actions";



//Lazy loading
const Periods = lazy ( () => import("../containers/Periods") );
const Accounts = lazy ( () => import( "../containers/Accounts") );
const MonthlyAccount = lazy ( () => import( "../containers/MonthlyAccount") );
const NotFound = lazy ( () => import("../components/NotFound") );

const App = () => {

  //destructuracion de las props del custom hook
  const { activePeriod, getActivePeriod, loading, setLoading } = useGetPeriodsData();  
  
  //obtiene periodo activo desde el state almancenado en el store
  //const localActivePeriod = useSelector((state) => state.activePeriod);

  //contiene la definicion del hook useDispatch()
  const dispatch = useDispatch();

  const [systemReady, setSystemReady] = useState(false);

  //hooks que se gatilla en cada vez que se monta el componente
  useEffect(() => {
    console.log("Buscando periodo activo en BD...");
    getActivePeriod();  
  },[]);

  useEffect(() => {      
    //loading cambia a false cuando getActivePeriod() finaliza
    if (activePeriod){
      console.log("Busqueda periodo activo finalizada");
      //console.log(activePeriod);
      dispatch(setPeriod(activePeriod))
      setSystemReady(true);
    }
    
    
    //dispatch(setPeriod(activePeriod));
    //setSystemReady(true);
  },[activePeriod]);


  //inicialmente el periodo activo es null, por lo que se obtiene de la BD y se almacena en store
  //console.log(localActivePeriod);
  //if (localActivePeriod == null){
    //console.log(localActivePeriod);

  //}

  return(    
    <Fragment>
    <BrowserRouter>
      <Layout>
      {
        systemReady ? (
          <Suspense fallback={<div>cargando...</div>}>
            <Switch>                
            <Route exact path="/" component={Dashboard}   />
            <Route path="/periods" component={Periods} />
            <Route path="/accounts" component={Accounts} />
            <Route path="/monthlyAccount" component={MonthlyAccount} />                                         
            <Route path="*" component={NotFound} /> 
            </Switch>   
          </Suspense>    
        ) : (
          <span></span>
        )
      }
      </Layout>      
    </BrowserRouter>    
    </Fragment>
  );
};

/*
            <Switch>                
              <Route exact path="/" component={Dashboard}   />
              <Route path="/periods" component={Periods} />
              <Route path="/accounts" component={Accounts} />
              <Route path="/monthlyAccount" component={MonthlyAccount} />                                         
              <Route path="*" component={NotFound} /> 
            </Switch>   
*/

export default App;
