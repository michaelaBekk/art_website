import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Pages from './pages';
import {Provider} from 'react-redux'; 
import log_in_store from './Stores/log_in_store';


ReactDOM.render(<Provider store={log_in_store}><Pages /></Provider>, document.getElementById('root'));



