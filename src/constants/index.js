const baseUrl = "https://gastosv1-8299e-default-rtdb.firebaseio.com/";

export const accountTypesURL = () => `${baseUrl}accountTypes/.json`;
export const monthlyAccountURL = (periodId, accountTypeId) => `${baseUrl}monthlyAccounts/${periodId}${accountTypeId ? "/"+accountTypeId : "" }.json`;
export const movementListURL = (periodId, accountTypeId) => `${baseUrl}monthlyAccounts/${periodId}/${accountTypeId}/movements.json`;
export const movementURL = (periodId, accountTypeId, movementId) => `${baseUrl}monthlyAccounts/${periodId}/${accountTypeId}/movements/${movementId}.json`;
export const periodURL = periodId => `${baseUrl}periods/${periodId}.json`;
export const periodListURL = () => `${baseUrl}periods.json`;