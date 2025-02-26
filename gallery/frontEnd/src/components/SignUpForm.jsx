import React, {useState, useEffect, useRef} from 'react'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import './signupForm.css';




const loginFormStyle = {
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

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{7,30}$/;


function SignUpForm() {

    const userRef = useRef(); //sets the focus on the user input when the form loads.
    const errRef = useRef(); //if we get an error we put the focus on the error message.

    const [email, setEmail] = useState('');
    const [userFocus, setUserFocus] = useState(false); //checks if the user is focused
    

    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false); //checks if the password is valid
    const [pwdFocus, setPwdFocus] = useState(false); //checks if the password input is focused
    
    const [matchPwd, setMatchPwd] = useState(''); //checks the second Entry matches the first
    const [validMatch, setValidMatch] = useState(false); //checks
    const [matchFocus, setMatchFocus] = useState(false); //checks if the second password input is focused

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('false');

    useEffect (() => {
        const result = PWD_REGEX.test(password);
        console.log(result)
        console.log(password);
        setValidPwd(result);
        const match = password === matchPwd;
        setValidMatch(match);
    },[password, matchPwd])

    useEffect (() => {
        setErrMsg('');
    },[email, password, matchPwd])


    const submit = async (e) => {
        e.preventDefault();
    
        if (!email || !password) {
            setErrMsg("All fields are required!");
            return;
        }
    
        if (!PWD_REGEX.test(password)) {
            setErrMsg("Invalid password format!");
            return;
        }
    
        try {
            const res = await axios.post("http://localhost:8081/user/register", {
                email: email.trim(),
                password: password.trim()
            });
    
            if (res.data === "exists") {
                setErrMsg("User already exists!");
            } else if (res.data === "notexists") {
                alert("User created successfully!");
                window.location.href = "/login";
            } else {
                setErrMsg("Registration failed. Try again.");
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setErrMsg("Something went wrong. Please try again.");
        }
    };

  return (
    <div className="wrapper" style={loginFormStyle.wrapper}>
        <form onSubmit= {submit}>
            <h1 style={loginFormStyle.wrapperH1}>Registration</h1>
            <div className="input-box" style={loginFormStyle.wrapperInputBox}>
            <label htmlFor='userName' style={{color: 'White'}}>Username:</label>
                <input 
                style={loginFormStyle.wrapperInput} 
                type = "email"
                id="email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}} 
                placeholder="Email" 
                required/>
                <FaUser style={loginFormStyle.inputBoxIcon} className="icon"/>
            </div>
            <div className="input-box" style={loginFormStyle.wrapperInputBox}>
            <label htmlFor='password' style={{color: 'White'}}>
                Password:
                <span className={validPwd ? "valid": "hide"} ></span>
                <span className={validPwd || password ? "hide": "valid"}></span>
            </label>
                <input 
                    style={loginFormStyle.wrapperInput} 
                    type = "password" 
                    onChange={(e)=>{setPassword(e.target.value)}} 
                    placeholder="Password" 
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />
                <RiLockPasswordFill style={loginFormStyle.inputBoxIcon} className="icon"/>
                {/*
                <p id = "pwnote" className = {pwdFocus && !validPwd ? "instructions": "offScreen"}>
                    Password must be at least 7 characters long, contain at least one uppercase letter, 
                    one lowercase letter, 
                    one number, 
                    and one special character.
                </p>
                */}
            </div>
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offScreen"} aria-live="assertve">{errMsg}</p>
            </section>
            <div style={loginFormStyle.rememberMe} className = "remember-forgot">
                <label style={loginFormStyle.smallText}><input type="checkbox"/>Remember Me</label>
                <a style={loginFormStyle.forgotPassword} href="#">Forgot Password?</a>
            </div>

            <button style={loginFormStyle.LoginButton} type="submit" onClick={submit}>Register</button>
            <div style={loginFormStyle.registerText} className="register-link">
                <p style={loginFormStyle.smallText}>Already have an Account?<a style={loginFormStyle.registerLink} href="/">Login</a></p>
            </div>
        </form>
    </div>
  )
}

export default SignUpForm