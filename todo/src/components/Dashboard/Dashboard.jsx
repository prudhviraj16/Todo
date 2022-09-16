import React,{useState} from 'react'
import axios from 'axios'
import './Dashboard.css'
const Dashboard = () => {

  const logoutHandler= () =>{
    localStorage.removeItem("user")
    try{

      axios.post("http://localhost:4000/logout").then(res=>console.log(res)).catch(err=>console.log(err))

      window.location.reload()
    }
    catch(err){
      console.log(err)
    }

  }

  const [data,setData] = useState({})

  const changeHandler = (e) => {
    const {name,value} = e.target

    setData(prevState=>{
      return {
        ...prevState, 
        [name] : value
      }
    })

  }
  const submitHandler = (e) =>{
    e.preventDefault()
    const token = window.localStorage.getItem('token')
    console.log(token)
    axios.post("http://localhost:4000/create-todo",{...data,token : window.localStorage.getItem('token')}).then(res=>console.log(res)).catch(err=>console.log(err))

  }
  return (
    <div className='fire'>
      <h1 className="header">Welcome </h1>
      <input type="text" onChange={changeHandler} name="todo" placeholder='Enter Something ...'/>
      <button className='plane' onClick={submitHandler}><i className="fa-regular fa-paper-plane"></i></button>
      <button onClick={logoutHandler} className='logout'><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
    </div>
  )
}

export default Dashboard