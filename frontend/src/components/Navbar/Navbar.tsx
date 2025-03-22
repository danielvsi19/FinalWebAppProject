import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import "./Navbar.css";
import { createPages, Page } from "../../router";
import logo from "../../assets/logo.png";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";

export const Navbar = () => {
    const authContext = useContext<AuthContextType | undefined>(AuthContext);
    const navigate = useNavigate();
    
    if (!authContext) {
        return null;
    };
    
    const { user, setUser } = authContext || {};

    const handleLogout = () => {
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    if (!user) {
        return null;
    };

    const pages: Page[] = createPages(user.username);

    return (
        <div>
            <nav className="navbar navbar-expand navbar-light justify-content-between">
                <div className="navbar">
                    <a className="" href="/">
                        <img src={logo} id="logo" />
                    </a>
                    <ul className="navbar-nav mr-auto">
                        {pages.map((page) => (
                            <li className="nav-item" key={page.path}>
                                {page.name === "Logout" ? (
                                    <NavLink
                                        to={page.path}
                                        style={({ isActive }) => ({
                                            textDecoration: isActive ? "underline" : "none",
                                        })}
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active" : ""}`
                                        }
                                        onClick={handleLogout}
                                    >
                                        {page.name}
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        to={page.path}
                                        style={({ isActive }) => ({
                                            textDecoration: isActive ? "underline" : "none",
                                        })}
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active" : ""}`
                                        }
                                    >
                                        {page.name}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
};