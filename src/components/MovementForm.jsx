import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useSaveData from "../custom-hooks/useSaveData";
import { Typography, Grid, Button } from "@material-ui/core";
import propTypes from "prop-types";


const MovementForm = (props) => {

    //obtiene valores del store
    const activePeriod = useSelector((state) => state.activePeriod);
    const accountTypeId = useSelector((state) => state.accountTypeId);

    //destructura props
    const { title, data, resetMovementList, accountBalance } = props;
    const { movementId, type, formattedDate, name, amount } = data;

    //para una fecha en formato d/m/aaaa o dd/mm/aaaa retorna un numero en formato aaaammdd
    const getDateToNumber = (stringDate) => {
        let arr = stringDate.split("/");
        if (arr[0].length === 1 ) arr[0] = "0" + arr[0];
        if (arr[1].length === 1 ) arr[1] = "0" + arr[1];

        return parseInt(arr[2] + arr[1] + arr[0]);        

    }

    //hooks
    const { register, handleSubmit, watch, errors } = useForm({
        defaultValues: {
            movementTypeId: type ? type : "",
            movementDate: formattedDate ? formattedDate : "",
            movementName: name ? name : "",
            movementAmount: amount ? amount : "",
        }
      });

    const { saveMovement, loading, error, dataSaved } = useSaveData();

    const [saveButtonPressed, setSaveButtonPressed] = useState(false);


    const movementTypeId = useRef();
    movementTypeId.current = watch("movementTypeId");
    const movementAmount = useRef();
    movementAmount.current = watch("movementAmount");




    const onSubmit = (data) => {
        setSaveButtonPressed(true);
        
        const dateAsNumber = getDateToNumber(data.movementDate);
        
        //estructura de un movimiento segun definicion en firebase
       const movementData = {
        "amount" : isNaN(data.movementAmount)? "0": parseInt(data.movementAmount),
        "date" : dateAsNumber,
        "movementId" : movementId,
        "name" : data.movementName,
        "type" : data.movementTypeId
       }
       
       saveMovement(activePeriod.id,accountTypeId, movementId, movementData)
            .then(() => {resetMovementList()});        
       
    };

    return (
        <div>          
            <Typography component="h1" variant="h5">
                {title}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} >                    
                <Grid container>
                    <Grid item xs={3}>
                        <label>Tipo</label>
                    </Grid>
                    <Grid item xs={5}>
                        <select name="movementTypeId" ref={register({required : true})} disabled={saveButtonPressed ? "disabled" : ""}>
                            <option value=""></option>
                            <option value="c">Cargo</option>
                            <option value="a">Abono</option>
                        </select>                            
                    </Grid>
                    <Grid item xs={4}>
                        {errors.movementTypeId && errors.movementTypeId.type === "required" && (<Typography variant="subtitle2">* Obligatorio</Typography>)}
                    </Grid>                        
                    <Grid item xs={3}>
                        <label>Fecha</label>
                    </Grid>
                    <Grid item xs={5}>
                        <input 
                            type="text" 
                            name="movementDate" 
                            placeholder = "dd/mm/aaaa"
                            ref={register({required : true, pattern: /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/})} 
                            disabled={saveButtonPressed ? "disabled" : ""} 
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {errors.movementDate && errors.movementDate.type === "required" && (<p>Campo obligatorio</p>)}
                        {errors.movementDate && errors.movementDate.type === "pattern" && (<p>Ingresar fecha en formado dd/mm/aaaa</p>)}                            
                    </Grid>
                    <Grid item xs={3}>
                        <label>Nombre</label>
                    </Grid>
                    <Grid item xs={5}>
                        <input type="text" name="movementName" ref={register({required : true})} disabled={saveButtonPressed ? "disabled" : ""} />
                    </Grid>
                    <Grid item xs={4}>
                        {errors.movementName && errors.movementName.type === "required" && (<p>Campo obligatorio</p>)}
                    </Grid>
                    <Grid item xs={3}>
                        <label>Monto</label>
                    </Grid>
                    <Grid item xs={5}>
                        <input 
                            type="text" 
                            name="movementAmount" 
                            ref={register({required : true, pattern: /^[0-9]*$/g, validate: (value) => movementTypeId.current === 'a' ? true : ((isNaN(value) ? 0 : parseInt(value)) <= accountBalance) })} 
                            disabled={saveButtonPressed ? "disabled" : ""} 
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {errors.movementAmount && errors.movementAmount.type === "required" && (<p>Campo obligatorio</p>)}
                        {errors.movementAmount && errors.movementAmount.type === "pattern" && (<p>Solo números enteros</p>)}                    
                        {errors.movementAmount && errors.movementAmount.type === "validate" && (<p>Se excede el saldo disponible ({accountBalance})</p>)}
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
                    <span></span>
                )                   
            }
        </div>
    );
};

MovementForm.propTypes = {
    title: propTypes.string,
    data: propTypes.object,
    resetMovementList: propTypes.func,
    accountBalance: propTypes.number
}

export default MovementForm;