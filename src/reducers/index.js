const reducer = (state, action) => {
    switch (action.type){
        case "SET_SECTION":
            return {
                ...state,
                sectionActive: action.payload,
            };
            case "SET_PERIOD":
                return {
                    ...state,
                    activePeriod: action.payload,
                };       
            case "SET_ACCOUNT_TYPE":
                return {
                    ...state,
                    accountTypeId: action.payload,
                };                                                         
        default: 
            return state;
    }
}

export default reducer;
