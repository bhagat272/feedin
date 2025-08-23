import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import formReducer from './reducers/formSlice';
import responseReducer from './reducers/responseSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    forms : formReducer,
    responses: responseReducer,
  },
});

export default store;