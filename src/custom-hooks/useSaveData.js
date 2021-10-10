import axios from "axios";
import { useState } from "react";
import { movementURL, periodURL } from "../constants";

const useSaveData = () => {

    const [loading, setLoading] = useState(true);
    const [dataSaved, setDataSaved] = useState(false);
    const [error, setError] = useState(false);
    

    async function saveMovement(periodId, accountTypeId, movementId, movementData){
        try{
            
            let result;

            if (movementId){
                result = await axios.patch(movementURL(periodId, accountTypeId, movementId), movementData);                
            }else{
                const date = new Date();
                movementId = date.getTime();
                movementData.movementId = movementId;                
                result = await axios.put(movementURL(periodId, accountTypeId,movementId), movementData);
            }

            //let data = result.data;            
            setDataSaved(true);
            setLoading(false);
            setError(false);
        } catch (error){
            console.log(error);
            setLoading(false);
            setError(error);            
        }
    }    

    async function deleteMovement(periodId, accountTypeId, movementId){
        try{
            
            let result;

            if (periodId){                                
                result = await axios.delete(movementURL(periodId, accountTypeId,movementId));                
            }

            //let data = result.data;
               
            setDataSaved(true);
            setLoading(false);
            setError(false);
        } catch (error){
            console.log(error);
            setLoading(false);
            setError(error);            
        }
    }

    async function savePeriod(periodData){
        try{
            
            let result;

            if (periodData.id){
                result = await axios.patch(periodURL(periodData.id), periodData);                
            }else{                
                let periodId = periodData.year + periodData.month;
                periodData.id = periodId;                
                result = await axios.put(periodURL(periodData.id), periodData);
            }

            //let data = result.data;
                 
            setDataSaved(true);
            
            setLoading(false);
            setError(false);
        } catch (error){
            console.log(error);
            setLoading(false);
            setError(error);            
        }

        
    }

    async function deletePeriod(periodId){
        try{
            
            let result;

            if (periodId){                
                result = await axios.delete(periodURL(periodId));                
            }

            //let data = result.data;
               
            setDataSaved(true);
            setLoading(false);
            setError(false);
        } catch (error){
            console.log(error);
            setLoading(false);
            setError(error);            
        }
    }

    async function deactivatePeriod(periodId){
        try{
            
            let result;            

            if (periodId){

                const data = { "active" : false }
                result = await axios.patch(periodURL(periodId), data);                
            }

            //let data = result.data;
            
            setDataSaved(true);
            setLoading(false);
            setError(false);
        } catch (error){
            console.log(error);
            setLoading(false);
            setError(error);            
        }        
    }

    //disponibiliza las props y funciones del custom hook
    return { saveMovement, deleteMovement, savePeriod, deletePeriod, deactivatePeriod, loading, error,dataSaved  }

};

export default useSaveData;