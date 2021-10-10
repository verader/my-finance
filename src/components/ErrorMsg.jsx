import React, {Fragment} from "react";
import { Typography } from "@material-ui/core";

const ErrorMsg = (props) => (
    <Fragment>
    <Typography variant="h3">Se ha producido un error</Typography>
    <Typography variant="h6">{props.text}</Typography>
    </Fragment>
);

export default ErrorMsg;