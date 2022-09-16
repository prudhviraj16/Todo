import React from 'react'
import Signin from './components/Signin/Signin';
import {Routes,Route} from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard';
import Signup from './components/Signup/Signup';
import {useSelector} from 'react-redux'

const App = () => {

  const object  = useSelector((state)=>state)
  const {user} = object
  console.log(user)
  if(user.status===200){
    window.localStorage.setItem("user",JSON.stringify(user.user))
  }
  // if()

  return (
    <>
        <Routes>
          <Route path ="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/" element ={window.localStorage.getItem("user") ? <Dashboard/>:<Signin />}/>
        </Routes>
    </>
  )
}

export default App