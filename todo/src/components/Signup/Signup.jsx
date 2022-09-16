import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Signup.css'
const Signup = () => {

  const navigate = useNavigate()
  
  const [register,setRegister] = useState({
    username: '',
    email : '',
    password : ''
  })

  const changeHandler = (e) => {
    const {name,value} = e.target

    setRegister((prevState)=>{
      return {
        ...prevState,
        [name] : value
      }
    })
  }

  const submitHandler = (e)=>{
    e.preventDefault();

    try{

      console.log(register)
      axios.post('http://localhost:4000/register',register).then(res=>res.status===200 ? navigate('/signin') : '').catch((err)=>console.log(err))


    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div>
        <div className='container'>
      <div className="subcontainer">
        <div className='imagecontainer'>
            <h1>Nothing to Forget</h1>
            <img src="https://www.google.com/images/icons/product/keep-512.png" alt="" />
        </div>
        <div className="logincontainer">
            <input type="text" placeholder= "Username" onChange={changeHandler} name="username"/>
            <input type="email"  placeholder='Email' onChange={changeHandler} name="email"/>
            <input type="password" placeholder='Password' onChange={changeHandler} name="password"/>
            <button onClick={submitHandler} classname="button">Sign Up</button> <p>Don't Have an account ? <Link to="/signin">Sign In</Link></p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Signup