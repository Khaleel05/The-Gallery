import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //configure axios with credentials
    axios.defaults.withCredentials = true;
    
    useEffect(() => {
        const checkAuth = async () => {
            try{
                const res = await axios.get('http://localhost:8081/user/checkAuth');
                if (res.data.authenticated){
                    setCurrentUser(res.data.user);
                    setIsAuthenticated(true);
                }else{
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }
            }catch (err){
                console.error('Auth check error:', err);
                setCurrentUser(null);
                setIsAuthenticated(false);
            }finally{
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    //login function
    const login = async(email, password)=>{
        try{
            const res = await axios.post('http://localhost:8081/user', { email, password});
            if (res.data.status === 'exists'){
                setCurrentUser(res.data.user);
                setIsAuthenticated(true);
                return{success: true, message: res.data};
            }else{
                return{ success: false, message: res.data };
            }
        }catch (err){
            console.error('Login error:', err);
            return{success: false, message: 'An error during login'};
        }
    };

    //Register function 
    const register = async(userData) =>{
        try{
            const res = await axios.post('http://localhost:8081/user/register', userData);
            if (res.data.status === 'nonexists'){
                setCurrentUser(res.data.user);
                setIsAuthenticated(true);
                return{success: true};
            }else{
                return{success: false, message:res.data};
            }
        }catch(err){
            console.error('Registration error:', err);
            return{sucess: false, message: 'An error occured during registration'};
        }
    };

    //logout function
    const logout = async () =>{
        try{
            await axios.get('http://localhost:8081/user/logout');
            setCurrentUser(null);
            setIsAuthenticated(false);
            return{success: true};
        }catch(err){
            console.error('Logout error:', err);
            return{success: false, message:'An error occured during logout'};
        }
    };

    return(
        <AuthContext.Provider value={{ 
            currentUser, 
            isAuthenticated, 
            loading, 
            login, 
            register, 
            logout 
          }}>
            {children}
          </AuthContext.Provider>
    );
};