import { ContactSupportOutlined } from '@material-ui/icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import { compose } from "redux";
import { createStore } from "redux";
import reducer from './reducers';
import App from './routes/App';

//defincion de estado inicial
const initialState = {
  sectionActive : "dashboard",
  activePeriod : null,
  accountTypeId : null,
};

//manejador del componse aqui 

//store
const store = createStore(
  reducer,
  initialState,
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
