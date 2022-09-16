import {FETCH_LOGIN_REQUEST,FETCH_LOGIN_SUCCESS,FETCH_LOGIN_FAILED} from './action'

const initialState ={
    user : '',
    loading : false,
    error : false
}

const loginReducer = (state=initialState,action) =>{
    switch(action.type){
        case FETCH_LOGIN_REQUEST:
            return{
                ...state,
                loading : true,
                error : false
            }
        case FETCH_LOGIN_SUCCESS: 
            return {
                ...state,
                user : action.payload,
                loading : false,
                error : false
            }
        case FETCH_LOGIN_FAILED:
            return {
                ...state,
                user : '',
                loading : false,
                error : true
            }

        default : 
            return state 
    }
}

export default loginReducer