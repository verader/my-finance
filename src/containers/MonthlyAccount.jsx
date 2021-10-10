import React from "react";
import MovementList from "../components/MovementList";
import ErrorBoundary from "../components/ErrorBoundary";

const MontlyAccount = () => <ErrorBoundary><MovementList/></ErrorBoundary>;

export default MontlyAccount;