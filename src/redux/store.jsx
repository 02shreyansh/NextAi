import { configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    persistReducer,
    persistStore,
    REGISTER
} from "redux-persist"
import reduxStorage from "./storage";
import rootReducer from "./rootReducer";
const persistConfig={
    key:"root",
    storage:reduxStorage,
    blacklist:[],
    whitelist:["chat"],
}
const persistedReducer=persistReducer(persistConfig,rootReducer);

export const store=configureStore({
    reducer:persistedReducer,
    middleware:getDefaultMiddleware=>
        getDefaultMiddleware({
            serializableCheck:{
                ignoreActions:[FLUSH,REHYDRATE,REGISTER,PAUSE,PURGE,PERSIST],
            },
        }),
});
export const persistor=persistStore(store)