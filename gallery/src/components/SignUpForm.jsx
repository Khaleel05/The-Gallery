import React, {useState} from 'react'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";




const loginFormStyle = {
    LoginFields:{
        marginBottom: "10px",
    },
    ButtonWrapper:{
        display: "flex",
        justifyContent: "center",
        marginTop: "4em",
        marginBottom: "10px",
    },
    button:{
        backgroundColor:'black',
        padding: '10px',
        color: 'white',
        borderRadius: '5px',
        width: '150%',
        cursor: 'pointer',
        marginTop: '10px',
        marginBottom: '10px',
    },
    wrapper:{
        height: "400px",
        width: "420px",
        background: "transparent",
        color: "ffffff",
        border: "2px white solid",
        boxShadow: "0 0 10px rgba(255, 255, 255, .2)",
        backdropFilter: "blur(30px)",
        borderRadius: "20px",
        padding: "30px 40px"
        
    },
    wrapperH1: {
        color: "#fff",
        fontSize: "2em",
        textAlign: "center",
    },
    wrapperInputBox: {
        position: "relative",
        width: "100%",
        height: "50px",
        margin: "30px 0"
    },
    wrapperInput: {
        height: "100%",
        width: "100%",
        background: "transparent",
        border: "none",
        outline: "none",
        border: "2px solid rgba(255, 255, 255, .2)",
        borderRadius: "40px",
        fontSize: "1em",
        color: "#fff",
        padding: "0.5em"
    },
    inputBoxIcon: {
        postion: "absolute",
        right: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "1.5em",
        color: '#fff',
    },
    rememberMe: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.8em",
        margin: "-1em 0 1em",
    },
    forgotPassword: {
        color: "white",
        textDecoration: "none",
    },
    LoginButton: {
        width: "100%",
        height: "3.5em",
        backgroundColor: "white",
        border: "none",
        outline: "none",
        borderRadius: "40px",
        boxShadow: "0 0 10px rgba(0, 0, 0, .1",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
    },
    registerText: {
        color: "#ffg",
        fontSize: "14.5px",
        textAlign: "center",
        margin: "20px 0 15px"
    },
    registerLink: {
        color: "white",
        textDecoration: "none",
        marginLeft: "10px",
        fontWeight: "600"
    },
    smallText:{
        color: 'red'
    }
    
}

function SignUpForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e){
        e.preventDefault();
        
        try{
            await axios.post("http://localhost:3000/",{
                email, password
            })
            .then(res=>{
                if(res.data==="exists"){
                    alert("User already exists!")
                }
                else if(res.data==="notexists"){
                    alert("User created successfully!")
                    window.location.href = "/login" // Redirect to login page after successful registration
                }   
            })
            .catch(e => {
                alert("Wrong Details")
            })
        }
        catch{
            console.log(e)
        }
    }

  return (
    <div className="wrapper" style={loginFormStyle.wrapper}>
        <form action= "POST">
            <h1 style={loginFormStyle.wrapperH1}>Registration</h1>
            <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                <input style={loginFormStyle.wrapperInput} type = "email" onChange={(e)=>{setEmail(e)}} placeHolder="Username" required/>
                <FaUser style={loginFormStyle.inputBoxIcon} className="icon"/>
            </div>
            <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                <input style={loginFormStyle.wrapperInput} type = "password" onChange={(e)=>{setPassword(e)}} placeHolder="Password" required/>
                <RiLockPasswordFill style={loginFormStyle.inputBoxIcon} className="icon"/>
            </div>
            <div style={loginFormStyle.rememberMe} className = "remember-forgot">
                <label style={loginFormStyle.smallText}><input type="checkbox"/>Remember Me</label>
                <a style={loginFormStyle.forgotPassword} href="#">Forgot Password?</a>
            </div>

            <button style={loginFormStyle.LoginButton} type="submit" onClick={submit}>Register</button>
            <div style={loginFormStyle.registerText} className="register-link">
                <p style={loginFormStyle.smallText}>Don't have an account?<a style={loginFormStyle.registerLink} href="/">Login</a></p>
            </div>
        </form>
    </div>
  )
}

export default SignUpForm