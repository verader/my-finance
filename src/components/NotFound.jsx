import React, { Fragment } from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";


const NotFound = () => (
    <Fragment>
        <Typography variant="h3">404: Página no encontrada</Typography>
        <Link to="/">Volver a Dashboard</Link>
    </Fragment>
);

export default NotFound;