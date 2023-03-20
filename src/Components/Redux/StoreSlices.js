import { createSlice  } from "@reduxjs/toolkit";
// import axios from "axios";

function remove(games,payload){
    
    const index = games.findIndex(object => {
        return object.name === payload.name;
      });

    games.splice(index,1)
}


const CurrentCart = createSlice({
    name: "myCart",
    initialState: {
        games:[],
        totalPrice:0
    },
    reducers:{
        addToCart: (state,{payload})=>{
            state.games.push(payload)
            state.totalPrice+= ( payload.price)
        },
        removeFromCart: (state,{payload})=>{
            remove(state.games,payload)
            state.totalPrice-= ( payload.price)
        }
        
    }
})
const APIs = createSlice({
    name: "APIs",
    initialState: {
        mainPage: 'test'
    },
    reducers:{
    }
})

export const {addToCart,removeFromCart} = CurrentCart.actions 

export const CurrentCartReducer = CurrentCart.reducer
export const APIreducer = APIs.reducer

