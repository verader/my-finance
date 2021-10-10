import axios from "axios";
import { useState } from "react";
//import { useLocalStorage } from "./useLocalStorage";
import { monthlyAccountURL, periodURL, accountTypesURL } from "../constants";

const useGetAccountData = () => {
    
    //define las props de estado del componente interactuando con 
    //el hook para acceder al local storage y almacenar data ahi
    //const [accountData, setAccountData] = useLocalStorage("accounts", "");  
    const [periodSummary, setPeriodSummary] = useState([]);
    const [monthlyAccount, setMonthlyAccount] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    async function getPeriodSummary(periodId){
        
        try{
            let generalSummary = [];

            let accountSum = [];
            let accountSummary;
            let accountsBudget = [];           

            //obtiene movimientos del periodo
            const response = await axios.get(monthlyAccountURL(periodId));
            const monthlyResult = response.data;            
            
            //obtiene datos del periodo            
            const response2 = await axios.get(periodURL(periodId));
            const budgetResult = response2.data;   
            //console.log(budgetResult);
            
            //obtiene tipos de cuenta
            const response3 = await axios.get(accountTypesURL());
            const accountTypes = response3.data;            

            for(let accountTypeId in budgetResult.accountsBudget){
                accountsBudget[accountTypeId] = budgetResult.accountsBudget[accountTypeId].accountBudget;
            }            
            
            //recorre cada tipo de cuenta del periodo
            for (let accountTypeId in budgetResult.accountsBudget){     
                //si hay movimientos en el periodo para la cuenta
                if (monthlyResult !== null && monthlyResult[accountTypeId] != null){                        
                    let account = monthlyResult[accountTypeId];
                    let movements = account.movements;
                    
                    accountSummary = null;                
                    accountSum['c'] = 0;
                    accountSum['a'] = 0;

                    for (let movementId in movements){                                                    
                        accountSum[movements[movementId].type] += parseInt(movements[movementId].amount);
                    }                

                    //resumen del mes para la cuenta
                    accountSummary = {
                        accountTypeId : accountTypeId,
                        accountName : accountTypes[accountTypeId].name,
                        c : accountSum['c'],
                        a : accountSum['a'],
                        budget : accountsBudget[accountTypeId],
                        balance : accountsBudget[accountTypeId] + accountSum['a'] - accountSum['c']
                    };        
                }   
                //si no, arma resumen del mes vacío para la cuenta
                else{
                    accountSummary = {
                        accountTypeId : accountTypeId,
                        accountName : accountTypes[accountTypeId].name,
                        c : 0,
                        a : 0,
                        budget : budgetResult.accountsBudget[accountTypeId].accountBudget,
                        balance : budgetResult.accountsBudget[accountTypeId].accountBudget
                    };
                }                    
                generalSummary.push(accountSummary);

            }
            
            setPeriodSummary(generalSummary);
            setLoading(false);
            setError(false);
        } catch (error){
            setLoading(false);
            setError(error);
            console.log(error);
        }
        
    };

    async function getMonthlyAccount(periodId, accountTypeId){
        try{
            const account = {
                accountBudget : 0,
                totalBudget : 0,
                accountName : "",
                accountType : "",
                movementList : []
            };            
            
            //obtiene movimientos del periodo
            const response = await axios.get(monthlyAccountURL(periodId,accountTypeId));
            const accountData = response.data;                        
            
            //obtiene presupuesto para el tipo de cuenta en el periodo
            const response2 = await axios.get(periodURL(periodId));
            const periodData = response2.data;
            
            let accountName = "";
            if (accountTypeId === "T1") accountName = "Gastos Fijos";
            if (accountTypeId === "T2") accountName = "Gastos Variables";

            account.accountBudget = periodData.accountsBudget[accountTypeId].accountBudget;
            account.totalBudget = periodData.totalBudget;
            account.accountName = accountName;
            account.accountType = accountTypeId;//accountData.accountType;
            account.totalCharges = 0;
            account.totalCredit = 0;    
            account.balance = 0;        
            
            //si hay movimientos
            if (accountData){
                for (let movement in accountData.movements){
                    
                    if (accountData.movements[movement].type === "c"){
                        account.totalCharges += accountData.movements[movement].amount;
                    }
                    if (accountData.movements[movement].type === "a"){
                        account.totalCredit += accountData.movements[movement].amount;
                    }                
                    account.movementList.push(accountData.movements[movement]);
                }          
                account.balance = account.accountBudget + account.totalCredit - account.totalCharges;
            }
            else{
                //si no hay movimientos
                account.balance = account.accountBudget;
            }
                        
            setMonthlyAccount(account);            
            setLoading(false);
            setError(false);
        } catch (error){
            console.log(error);
            setLoading(false);
            setError(error);            
        }
    };

    //disponibiliza las props y funciones del custom hook
    return { periodSummary, monthlyAccount, loading, setLoading, error, getPeriodSummary, getMonthlyAccount, setMonthlyAccount }

};

export default useGetAccountData;