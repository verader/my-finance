import axios from "axios";
import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { periodListURL } from "../constants";

const useGetPeriodsData = () => {
    
    //define las props de estado del componente interactuando con 
    //el hook para acceder al local storage y almacenar data ahi
    //const [accountData, setAccountData] = useLocalStorage("accounts", "");  
    const [periodList, setPeriodList] = useState([]);
    //const [activePeriod, setActivePeriod] = useLocalStorage("activePeriod", "");  
    const [activePeriod, setActivePeriod] = useState(null);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    async function getPeriodList(){
        try{
            //obtiene lista de periodos
            let periodList = [];            
            const response = await axios.get(periodListURL());
            const result = response.data;
            

            for (let period in result){
                periodList.push(result[period]);
            }            
            setPeriodList(periodList);
            setLoading(false);
            setError(false);            
        } catch (error){
            setLoading(false);
            setError(error);
        }
    }

    async function getActivePeriod(){
        const active = {"id": null, "name" : null, "accountsBudget": 0};
        
        try{
            //obtiene lista de periodos
            const response = await axios.get(periodListURL());
            const result = response.data;            

            for (let period in result){
                if (result[period].active){
                    active.id = result[period].id;                    
                    active.name = result[period].name;
                    active.accountsBudget = result[period].accountsBudget;
                    break;
                }
            }                        
            setLoading(false);
            
            setError(false);            
        } catch (error){
            setLoading(false);
            setError(error);
            console.log("ERROR al obtener periodo activo");
        }

        setActivePeriod(active);
        
    }

    //disponibiliza las props y funciones del custom hook
    return { periodList, loading, setLoading, error, getPeriodList, activePeriod, getActivePeriod  }

};

export default useGetPeriodsData;