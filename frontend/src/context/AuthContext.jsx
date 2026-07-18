import { createContext, useEffect, useState } from "react";

import { loginUser, registerUser, getProfile } from "../api/authapi";


const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            try{
                const token = localStorage.getItem('token')
                
                if(!token){
                    setLoading(false)
                    return;
                }
                
                const {data} = await getProfile()

                setUser(data.user)
            } catch (error) {
                console.error('Error loading user profile:', error)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

        const register = async (formData) => {
        const {data} = await registerUser(formData)

        localStorage.setItem("token", data.token)
        setUser(data.user)
      }
     

        const login = async (formData) => {
        const {data} = await loginUser(formData)

        localStorage.setItem('token', data.token)

        setUser(data.user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider
          value={{
            user,
            loading,
            login,
            register,
            logout
          }}
        >     
          {children} 
        </AuthContext.Provider>
    )
}

export { AuthContext }

  