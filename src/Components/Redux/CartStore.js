import { configureStore } from '@reduxjs/toolkit'
import {CurrentCartReducer} from './StoreSlices';
import {APIreducer} from './StoreSlices';

export const CartStore = configureStore({
    reducer: {
        currentCart: CurrentCartReducer,
        APIs: APIreducer
    }
});