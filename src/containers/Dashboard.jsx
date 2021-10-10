import React from "react";
import AccountReviewList from "../components/AccountReviewList";
import ErrorBoundary from "../components/ErrorBoundary";

const Dashboard = () => <ErrorBoundary><AccountReviewList/></ErrorBoundary>;

export default Dashboard;