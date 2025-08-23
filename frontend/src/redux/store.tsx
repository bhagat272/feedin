import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import formReducer from './reducers/formSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    forms : formReducer,
  },
});

export default store;