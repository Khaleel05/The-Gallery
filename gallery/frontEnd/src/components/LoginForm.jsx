import React, {useState, useContext} from 'react'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';




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
        backdropFilter: "blur(5px)",
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
        padding: "1em",
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

function LoginForm() {
    //this is used to navigate through different pages. 
    const history = useNavigate();
    const { login } = useContext(AuthContext); 
    
    const authContext = useContext(AuthContext);
    console.log("AuthContext value:", authContext);
    const loginc = authContext?.login; 
    console.log(loginc)

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        
        try {
            const result = await login(email, password);
            console.log('attempted login')
            if (result.success) {
                console.log('Granted')
                console.log("AuthContext value:", authContext);
                history('/home');
            } else {
                if (result.message === 'notexists') {
                    setError('User not found!');
                    alert(error)
                    console.log('email entered:', email)
                } else if (result.message === 'wrongpassword') {
                    setError('Incorrect password');
                    alert(error)
                } else {
                    setError('An error occurred during login. Please try again.');
                    alert(error)
                    console.log('you tried to submit')
                }
            }
        } catch(e) {
            console.error('Login error:', e);
            setError('An unexpected error occurred. Please try again.');
        }
    }

  return (
    <div className="wrapper" style={loginFormStyle.wrapper}>
        <form onSubmit ={handleSubmit}>
            <h1 style={loginFormStyle.wrapperH1}>Login</h1>
            <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                <label htmlFor='userName' style={{color: 'White'}}>Username:</label>
                <input 
                    style={loginFormStyle.wrapperInput} 
                    type = "email" 
                    onChange={(e)=>{setEmail(e.target.value)}} 
                    autoComplete = "false"
                    placeholder="Username" required
                />
                <FaUser style={loginFormStyle.inputBoxIcon} className="icon"/>
            </div>
            <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                <label htmlFor='password' style={{color: 'white'}}>Password:</label>  {/* Add a label for password */}  {/* Add password strength meter */}   {/* Add password visibility toggle */}   {/* Add password rules */}   {/* Add password reset functionality */}   {/* Add password recovery functionality */}   {/* Add password recovery email */}   {/* Add password recovery link */}   {/* Add password recovery link functionality */}   {/* Add password recovery link expiration */}   {/* Add password recovery link expiration functionality */}
                <input 
                    style={loginFormStyle.wrapperInput} 
                    type = "password" 
                    onChange={(e)=>{setPassword(e.target.value)}} 
                    autoComplete = "false" 
                    placeholder="Password" required
                />
                <RiLockPasswordFill style={loginFormStyle.inputBoxIcon} className="icon"/>
            </div>
            <div style={loginFormStyle.rememberMe} className = "remember-forgot">
                <label style={loginFormStyle.smallText}><input type="checkbox"/>Remember Me</label>
                <a style={loginFormStyle.forgotPassword} href="#">Forgot Password?</a>
            </div>

            <button style={loginFormStyle.LoginButton} type="submit" >Login</button>
            <div style={loginFormStyle.registerText} className="register-link">
                <p style={loginFormStyle.smallText}>Dont have an Account?<a style={loginFormStyle.registerLink} href="/#Signup">Register</a></p>
            </div>
        </form>
    </div>
  )
}



export default LoginForm
