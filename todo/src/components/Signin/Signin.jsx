import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import './Signin.css'
import axios from 'axios'
import { fetchData } from './../../Redux/action';
import {useDispatch} from 'react-redux'

const Signin = () => {

  const dispatch = useDispatch()  



  const [login,setLogin] = useState({
    email: '',
    password : ''
  })

  const handleChange = (e) => {
    const {name,value} = e.target

    setLogin((prevState)=>{
      return {
        ...prevState,
        [name] : value
      }
    })
  }

  useEffect(()=>{
    dispatch(fetchData(login))
  },[])
  
  const submitHandler = (e)=>{
    e.preventDefault();
    try{
      axios.post('http://localhost:4000/login',login).then(res =>{ console.log(res)
      }).catch((err)=>console.log(err))

    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div className='container'>
      <div className="subcontainer">
        <div className='imagecontainer'>
            <h1>Nothing to Forget</h1>
            <img src="https://www.google.com/images/icons/product/keep-512.png" alt="" />
        </div>
        <div className="logincontainer">
          <input type="text"  placeholder='Email' name="email" onChange={handleChange}/>
          <input type="password" placeholder='Password' name="password" onChange={handleChange}/>
          <button className="button" onClick={()=>dispatch(fetchData(login))} onSubmit={submitHandler}>Sign In</button>
           <p>Don't Have an account ? <Link to="/signup">Sign Up</Link></p>
          
        </div>
      </div>
    </div>
  )
}

export default Signin