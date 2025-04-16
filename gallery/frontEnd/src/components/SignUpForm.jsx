import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";


const loginFormStyle = {
    wrapper: {
        width: "500px",
        background: "transparent",
        color: "#ffffff",
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
        marginBottom: "20px"
    },
    wrapperInputBox: {
        position: "relative",
        width: "100%",
        height: "50px",
        margin: "20px 0"
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
        padding: "0 45px 0 20px"
    },
    inputBoxIcon: {
        position: "absolute",
        right: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "1.2em",
        color: '#fff',
    },
    label: {
        color: 'white',
        marginBottom: '5px',
        display: 'block'
    },
    LoginButton: {
        width: "100%",
        height: "3.5em",
        backgroundColor: "white",
        border: "none",
        outline: "none",
        borderRadius: "40px",
        boxShadow: "0 0 10px rgba(0, 0, 0, .1)",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "30px"
    },
    registerText: {
        color: "#fff",
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
    errorMessage: {
        color: 'red',
        marginTop: '5px',
        fontSize: '0.9em'
    },
    validFeedback: {
        color: 'green',
        marginLeft: '10px'
    },
    invalidFeedback: {
        color: 'red',
        marginLeft: '10px'
    },
    hide: {
        display: 'none'
    },
    passwordRules: {
        color: 'white',
        fontSize: '0.8em',
        marginTop: '5px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    selectInput: {
        height: "100%",
        width: "100%",
        background: "transparent",
        border: "2px solid rgba(255, 255, 255, .2)",
        borderRadius: "40px",
        fontSize: "1em",
        color: "#fff",
        padding: "0 45px 0 20px",
        appearance: "none"
    },
    option: {
        background: "#333",
        color: "#fff"
    }
};

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{7,30}$/;

function SignUpForm() {
    const errRef = useRef(); // For error message focus

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    
    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // Validate password and match
    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPwd(result);
        const match = password === matchPwd;
        setValidMatch(match);
    }, [password, matchPwd]);

    // Clear error message when inputs change
    useEffect(() => {
        setErrMsg('');
    }, [name, email, password, matchPwd, age, gender]);

    const submit = async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        if (!name || !email || !password || !age || !gender) {
            setErrMsg("All fields are required!");
            return;
        }
        
        // Validate password format
        if (!PWD_REGEX.test(password)) {
            setErrMsg("Invalid password format!");
            return;
        }
        
        // Validate password match
        if (password !== matchPwd) {
            setErrMsg("Passwords do not match!");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8081/user/register", {
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
                age: parseInt(age),
                gender: gender
            });
            
            if (res.data === "exists") {
                setErrMsg("User already exists!");
            } else if (res.data.status === "notexists") {
                setSuccess(true);
                alert("User created successfully!");
                window.location.href = "#/genreSelection";//change this to the genre page. 
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
            <form onSubmit={submit}>
                <h1 style={loginFormStyle.wrapperH1}>Registration</h1>
                
                <p ref={errRef} className={errMsg ? "errmsg" : "offScreen"} style={errMsg ? loginFormStyle.errorMessage : loginFormStyle.hide} aria-live="assertive">{errMsg}</p>
                
                <div style={loginFormStyle.formGrid}>
                    <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                        <label htmlFor='name' style={loginFormStyle.label}>Full Name:</label>
                        <input 
                            style={loginFormStyle.wrapperInput} 
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Full Name" 
                            required
                        />
                        <FaUser style={loginFormStyle.inputBoxIcon} className="icon"/>
                    </div>
                    
                    <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                        <label htmlFor='email' style={loginFormStyle.label}>Email:</label>
                        <input 
                            style={loginFormStyle.wrapperInput} 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            required
                        />
                        <FaEnvelope style={loginFormStyle.inputBoxIcon} className="icon"/>
                    </div>
                </div>
                
                <div style={loginFormStyle.formGrid}>
                    <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                        <label htmlFor='age' style={loginFormStyle.label}>Age:</label>
                        <input 
                            style={loginFormStyle.wrapperInput} 
                            type="number"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)} 
                            placeholder="Age" 
                            required
                            min="1"
                            max="120"
                        />
                        <FaCalendarAlt style={loginFormStyle.inputBoxIcon} className="icon"/>
                    </div>
                    
                    <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                        <label htmlFor='gender' style={loginFormStyle.label}>Gender:</label>
                        <select 
                            style={loginFormStyle.selectInput} 
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)} 
                            required
                        >
                            <option value="" disabled style={loginFormStyle.option}>Select Gender</option>
                            <option value="Male" style={loginFormStyle.option}>Male</option>
                            <option value="Female" style={loginFormStyle.option}>Female</option>
                            <option value="Other" style={loginFormStyle.option}>Other</option>
                            <option value="Prefer not to say" style={loginFormStyle.option}>Prefer not to say</option>
                        </select>
                        <FaVenusMars style={loginFormStyle.inputBoxIcon} className="icon"/>
                    </div>
                </div>
                
                <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                    <label htmlFor='password' style={loginFormStyle.label}>
                        Password:
                        <span style={validPwd ? loginFormStyle.validFeedback : loginFormStyle.hide}>✓</span>
                        <span style={validPwd || !password ? loginFormStyle.hide : loginFormStyle.invalidFeedback}>✗</span>
                    </label>
                    <input 
                        style={loginFormStyle.wrapperInput} 
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <RiLockPasswordFill style={loginFormStyle.inputBoxIcon} className="icon"/>
                </div>
                
                {pwdFocus && !validPwd && (
                    <p id="pwdnote" style={loginFormStyle.passwordRules}>
                        Password must be 7-30 characters and include at least one uppercase letter, 
                        one lowercase letter, one number, and one special character (!@#$%).
                    </p>
                )}
                
                <div className="input-box" style={loginFormStyle.wrapperInputBox}>
                    <label htmlFor='confirm_pwd' style={loginFormStyle.label}>
                        Confirm Password:
                        <span style={validMatch && matchPwd ? loginFormStyle.validFeedback : loginFormStyle.hide}>✓</span>
                        <span style={validMatch || !matchPwd ? loginFormStyle.hide : loginFormStyle.invalidFeedback}>✗</span>
                    </label>
                    <input 
                        style={loginFormStyle.wrapperInput} 
                        type="password"
                        id="confirm_pwd"
                        value={matchPwd}
                        onChange={(e) => setMatchPwd(e.target.value)} 
                        placeholder="Confirm Password" 
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                    <RiLockPasswordFill style={loginFormStyle.inputBoxIcon} className="icon"/>
                </div>
                
                {matchFocus && !validMatch && matchPwd && (
                    <p id="confirmnote" style={loginFormStyle.passwordRules}>
                        Passwords must match.
                    </p>
                )}

                <button 
                    style={loginFormStyle.LoginButton} 
                    type="submit" 
                    disabled={!validPwd || !validMatch}
                >
                    Register
                </button>
                
                <div style={loginFormStyle.registerText} className="register-link">
                    <p>Already have an Account? <a style={loginFormStyle.registerLink} href="/">Login</a></p>
                </div>
            </form>
        </div>
    );
}

export default SignUpForm;