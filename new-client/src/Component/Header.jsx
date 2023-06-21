import { NavLink } from "react-router-dom"

export default function Header(props){
    
    const {authenticated, userName, setAuthenticated, logoutHandler, avatar} = props

    
    return (
    <header>
        <nav className="nav" style={{display:"flex", justifyContent:"space-between"}}>
            <div>
                {avatar && <img src={avatar} alt="user-image" height={100} style={{borderRadius:'50%'}}/>}
                {authenticated && <h2 style={{color: "gold"}}>Welcome {userName}! </h2>}
            </div>
            <div>
                <NavLink to="/" className="link" >Home</NavLink>
                {!authenticated && <NavLink to="/register" className="link" >Register</NavLink>}
                <NavLink to="/posts" className="link" >Posts</NavLink>

                {authenticated && <NavLink to="/my-gallery" className="link" >My Gallery</NavLink>}
                {authenticated && <NavLink to="/create-post" className="link" >Create-Post</NavLink>}
                {authenticated && <NavLink to="/change-password" className="link" >Change-Password</NavLink>}

                {authenticated?
                <NavLink to="/login" className="link" onClick={logoutHandler}>Logout</NavLink>
                :<NavLink to="/login" className="link" >Login</NavLink>
            }
            </div>
                
        </nav>
    </header>
    )
}