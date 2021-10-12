import React, { useState, Fragment, useRef } from "react";
import useSaveData from "../custom-hooks/useSaveData";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setPeriod } from "../actions";
import { Typography, Grid, Button } from "@material-ui/core";

const PeriodForm = (props) => {
    //destructura props
    const { title, data, resetPeriodList } = props;
    const { id, active, year, month, name, totalBudget, accountsBudget } = data;
    const accBudgetArray = [];
    const accDefaultValues = [];

    const { savePeriod, deactivatePeriod, loading, error, dataSaved } = useSaveData();
    const [saveButtonPressed, setSaveButtonPressed] = useState(false);
    
    //obtiene periodo activo desde el state almancenado en el store
    const activePeriod = useSelector((state) => state.activePeriod); 
    //contiene la definicion del hook useDispatch()
    const dispatch = useDispatch();    
    
    //dado que accountsBudget no es un array, se construye array para renderizar los campos del presupuesto de cada cuenta
    //..si se esta editando un periodo existente
    if (id){        
        //y para los valores por defecto de cada campo
        for (let budget in accountsBudget){
            accBudgetArray.push(accountsBudget[budget]);
            accDefaultValues[budget] = accountsBudget[budget].accountBudget;
        }
    }
    //..si se está creando un nuevo periodo
    else{                     
        accBudgetArray.push({accountType: "T1", "accountBudget" : 0 });
        accDefaultValues["T1"] = 0;
        accBudgetArray.push({accountType: "T2", "accountBudget" : 0 });
        accDefaultValues["T2"] = 0;
    }


    //hooks para uso del formulario
    const { register, handleSubmit, watch, errors, setValue, getValues } = useForm({
        defaultValues: {
            periodId: id ? id : "",
            periodActive : active===true ? active : false,
            periodYear: year ? year : "",
            periodMonth: month ? month : "",
            periodName: name ? name : "",
            periodTotalBudget : totalBudget ? totalBudget : "0",
            periodAccountsBudget : accDefaultValues ? accDefaultValues : []
        }
      });

    //watchers
    const periodTotalBudget = useRef();
    periodTotalBudget.current = watch("periodTotalBudget");

    const periodAccountsBudget = useRef([]);
    //periodAccountsBudget.current["T1"] = accBudgetArray.map((budget) => watch("periodAccountsBudget["+ budget.accountType +"]") );
    for (let index in accBudgetArray){            
        periodAccountsBudget.current[accBudgetArray[index].accountType] = watch("periodAccountsBudget["+ accBudgetArray[index].accountType +"]");
    }

    const onSubmit = (data) => {
        
        setSaveButtonPressed(true);
        
        //estructura de un periodo segun definicion en firebase
        const periodData = {
            "id" : id,
            "active" : data.periodActive,
            "year" : data.periodYear,
            "month" : data.periodMonth,
            "name" : data.periodName,
            "totalBudget" : data.periodTotalBudget,
            "accountsBudget" : ""
        }        
        
        //crea json con la lista de cuentas según la def. en firebase
        let objStr = '{';
        
        for (let type in data.periodAccountsBudget){
            objStr += '"' + type + '" : { "accountBudget" : ' + data.periodAccountsBudget[type] + ', "accountType" : "' + type + '" },';            
        }
        
        objStr = objStr.substring(0,objStr.length-1); //elimina la última ","
        objStr += '}';
        
        periodData.accountsBudget = JSON.parse(objStr);
        
        savePeriod(periodData)
            .then(() => {
                            let changeActivePeriod = false;
                            let newActivePeriodId = null;

                            //si se está agregando un nuevo periodo activo y ya había un periodo activo en el storage...cambiar periodo activo
                            if (id === null && data.periodActive && activePeriod.id){
                                //cambiar periodo activo
                                changeActivePeriod = true;

                                //construye ID del periodo que se acaba de crear: PARCHE, ESTO SE DEBE CAPTURAR DESDE savePeriod()  !!!
                                newActivePeriodId = periodData.year + periodData.month;                                                                
                            }
                            //si se está activando un periodo existente y había otro periodo activo en el storage...cambiar periodo activo
                            else if (id !== null && data.periodActive && id !== activePeriod.id){
                                changeActivePeriod = true;
                                newActivePeriodId = id;                        
                            }
                                                                               
                            if (changeActivePeriod){
                                //desactiva el periodo actual
                                deactivatePeriod(activePeriod.id).then(() => {
                                                                                //setea el nuevo periodo activo en el store                                            
                                                                                dispatch(setPeriod({"id": newActivePeriodId, "name" : data.periodName}));
                                                                                resetPeriodList();
                                                                            });
                            }
                            else{
                                resetPeriodList();
                            }
                        });
       
    };
    
    const handleBudgetChange = () => {
        let totalBudget = 0;
        let amount = 0;
        
        for (let accType in accBudgetArray){
            amount = getValues("periodAccountsBudget[" + accBudgetArray[accType].accountType + "]");
            amount = amount ? (isNaN(amount) ? 0 : parseInt(amount)) : 0;
            totalBudget += amount;            
        }
        setValue("periodTotalBudget",totalBudget);

    }

    return (
        <div>            
            <div>
                <Typography component="h1" variant="h5">
                    {title}
                </Typography>                
                <form onSubmit={handleSubmit(onSubmit)} >
                <Grid container >
                    <Grid item xs={3}>
                        <label>Año</label>
                    </Grid>
                    <Grid item xs={5}>
                        <input type="text" name="periodYear" ref={register({required: true, pattern: /^[0-9]*$/g})} disabled={saveButtonPressed ? "disabled" : ""} />
                    </Grid>
                    <Grid item xs={4}>
                        {errors.periodYear && errors.periodYear.type === "required" && (<Typography variant="subtitle2">* Obligatorio</Typography>)}
                        {errors.periodYear && errors.periodYear.type === "pattern" && (<Typography variant="subtitle2">Solo números enteros</Typography>)}
                    </Grid>
                    <Grid item xs={3}>
                        <label>Mes</label>
                    </Grid>
                    <Grid item xs={5}>
                        <input type="text" name="periodMonth" ref={register({required: true, pattern: /^[0-9]*$/g})} disabled={saveButtonPressed ? "disabled" : ""} />
                    </Grid>
                    <Grid item xs={4}>                        
                        {errors.periodMonth && errors.periodMonth.type === "required" && (<Typography variant="subtitle2">* Obligatorio</Typography>)}
                        {errors.periodMonth && errors.periodMonth.type === "pattern" && (<Typography variant="subtitle2">Solo números</Typography>)}
                    </Grid>
                    <Grid item xs={3}>
                        <label>Activo</label>
                    </Grid>
                    <Grid item xs={9}>
                        <input type="checkbox" name="periodActive" ref={register}  disabled={saveButtonPressed ? "disabled" : ""} /><br/>                    
                    </Grid>
                    <Grid item xs={3}>
                        <label>Nombre</label>
                    </Grid>
                    <Grid item xs={5}>
                        <input type="text" name="periodName" ref={register({required: true})} disabled={saveButtonPressed ? "disabled" : ""} /><br/>
                    </Grid>
                    <Grid item xs={4}>
                        {errors.periodName && errors.periodName.type === "required" && (<Typography variant="subtitle2">* Obligatorio</Typography>)}                                        
                    </Grid>
                    <Grid item xs={12}>
                        <br/>
                        <Typography component="h4">
                            CUENTAS
                        </Typography>
                    </Grid>
                    {                    
                        accBudgetArray.map((budget) => (
                            <Fragment>
                                <Grid item xs={4}>
                                    <label>{budget.accountType === "T1" ? "Gastos Fijos" : "Gastos Variables"}</label>
                                </Grid>
                                <Grid item xs={4}>
                                <input 
                                    key={budget.accountType} 
                                    ref={register({required: true, pattern: /^[0-9]*$/g})} 
                                    type="text" 
                                    size="10"
                                    name={"periodAccountsBudget[" + budget.accountType  + "]"} 
                                    disabled={saveButtonPressed ? "disabled" : ""} 
                                    onChange={(e)=> handleBudgetChange()}
                                />                            
                                </Grid>    
                                <Grid item xs={4}>      
                                    {errors.periodAccountsBudget && errors.periodAccountsBudget[budget.accountType] && errors.periodAccountsBudget[budget.accountType].type === "required" && (<Typography variant="caption">* Obligatorio</Typography>) }
                                    {errors.periodAccountsBudget && errors.periodAccountsBudget[budget.accountType] && errors.periodAccountsBudget[budget.accountType].type === "pattern" && (<Typography variant="caption">Solo números</Typography>) }
                                </Grid>
                            </Fragment>
                        ))
                    }        
                    <Grid item xs={4}>             
                        <Typography component="h6">Presupuesto total</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <input type="text" name="periodTotalBudget" ref={register} readOnly /><br/>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit" disabled={saveButtonPressed ? "disabled" : ""}>Ingresar</Button>                            
                    </Grid>                    
                </Grid>
                </form>          

                {
                    saveButtonPressed ? (
                        loading ? (
                            <p>Guardando...</p>
                        ) : (
                            dataSaved ? (
                                <p>Datos guardados OK</p>
                                
                            ) : (
                                <p>Problema al guardar los datos</p>
                            )
                        )
                    ) : (
                        <p></p>
                    )                   
                }                

            </div>
        </div>
    );
};

export default PeriodForm;