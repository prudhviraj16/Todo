import axios from 'axios'

export const FETCH_LOGIN_REQUEST = 'FETCH_LOGIN_REQUEST'
export const FETCH_LOGIN_SUCCESS = 'FETCH_LOGIN_SUCCESS'
export const FETCH_LOGIN_FAILED = 'FETCH_LOGIN_FAILED'

export const fetchdataRequested = () => ({
    type : FETCH_LOGIN_REQUEST
})

export const fetchdataSuccess = (news) => ({
    type : FETCH_LOGIN_SUCCESS,
    payload : news
})

export const fetchdataFailed = (errorMessage) => ({
    type : FETCH_LOGIN_FAILED, 
    payload : errorMessage 
})



export const fetchData = (login) => {
    return async (dispatch) => {
        try{
            dispatch(fetchdataRequested())
            let res = await axios.post('http://localhost:4000/login',login)
            console.log("Hello" ,res)
            window.localStorage.setItem("token",res.data.token)
            dispatch(fetchdataSuccess(res.data))
        }   
        catch(err){
            dispatch(fetchdataFailed(err.message))
        }
    }
}