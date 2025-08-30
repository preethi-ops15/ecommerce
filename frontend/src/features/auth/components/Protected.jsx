import { useSelector } from "react-redux"
import { selectLoggedInUser } from "../AuthSlice"
import { Navigate } from "react-router"


export const Protected = ({children}) => {
    const loggedInUser=useSelector(selectLoggedInUser)

    // For now, allow access if user exists (temporary fix)
    if(loggedInUser){
        return children
    }
    return <Navigate to={'/login'} replace={true}/>
}

export const AdminProtected = ({children}) => {
    const loggedInUser=useSelector(selectLoggedInUser)

    // For now, allow access if user exists and is admin (temporary fix)
    if(loggedInUser && loggedInUser?.isAdmin){
        return children
    }
    return <Navigate to={'/login'} replace={true}/>
}
