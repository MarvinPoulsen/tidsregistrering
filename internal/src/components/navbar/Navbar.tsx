import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';
import './navbar.scss';
enum Tab {
    Basic,
    Complex,
    Statistics,
    Projects,
    Tasks,
    Users,
}
interface NavbarProps  {
    user: any;
    editFavorites: () => void;
    logo:string;
  }
const Navbar = (props: NavbarProps) => {
    let location = useLocation();

    const [isActiveTab, setActiveTab] = useState<Tab>(null);
    React.useEffect(() => {
        switch (location.pathname) {
            case '/':
            case '/basic':
                setActiveTab(Tab.Basic);
                break;
            case '/complex':
                setActiveTab(Tab.Complex);
                break;
            case '/statistics':
                setActiveTab(Tab.Statistics);
                break;
            case '/projects':
                setActiveTab(Tab.Projects);
                break;
            case '/tasks':
                setActiveTab(Tab.Tasks);
                break;
            case '/users':
                setActiveTab(Tab.Users);
                break;
            default:
                setActiveTab(null);
        }
    }, [location]);

    const user = props.user.name;
    return (
        <>
            <nav
                className="navbar"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <a className="navbar-item noHover">
                        <img
                            src={props.logo}
                            alt="Lolland Kommune"
                            width="112"
                            height="28"
                        />
                    </a>
                </div>

                <div className="navbar-start">
                    <a
                        className="navbar-item"
                        onClick={() => props.editFavorites()}
                    >
                        Mine Favoritter
                    </a>
                        <Link to="/basic" className={
                            isActiveTab === Tab.Basic
                                ? 'is-on navbar-item'
                                : 'navbar-item'
                        }>
                            {/* <span>
                                <Icon path={mdiHome} size={1} />
                            </span> */}
                            <span className="navigation-text">Basic</span>
                        </Link>
                        <Link to="/complex" className={
                            isActiveTab === Tab.Complex
                                ? 'is-on navbar-item'
                                : 'navbar-item'
                        }>
                            {/* <span>
                                <Icon path={mdiHome} size={1} />
                            </span> */}
                            <span className="navigation-text">Complex</span>
                        </Link>
                </div>

                <div className="navbar-end">
                        <Link to="/statistics" className={
                            isActiveTab === Tab.Statistics
                                ? 'is-on navbar-item'
                                : 'navbar-item'
                        }> 
                            {/* <span>
                                <Icon path={mdiHome} size={1} />
                            </span> */}
                            <span className="navigation-text">Statistics</span>
                        </Link>
                    <div
                        className="navbar-item has-dropdown is-hoverable"
                        key={isActiveTab}
                    >
                        <a className="navbar-link">
                            <span className={
                            isActiveTab === Tab.Projects || isActiveTab === Tab.Tasks || isActiveTab === Tab.Users
                                ? 'is-on navigation-text'
                                : 'navigation-text'
                        }>Admin</span>
                        </a>
                        <div className="navbar-dropdown has-background-info-dark">
                            <Link to="/projects" className={
                            isActiveTab === Tab.Projects
                                ? 'is-on navbar-item'
                                : 'navbar-item'
                        }>
                                <span className="navigation-text">
                                    Projects
                                </span>
                            </Link>
                            <Link to="/tasks" className={
                            isActiveTab === Tab.Tasks
                                ? 'is-on navbar-item'
                                : 'navbar-item'
                        }>
                                <span className="navigation-text">Tasks</span>
                            </Link>
                            <Link to="/users" className={
                            isActiveTab === Tab.Users
                                ? 'is-on navbar-item'
                                : 'navbar-item'
                        }>
                                <span className="navigation-text">Users</span>
                            </Link>
                        </div>
                    </div>
                    <div className="navbar-item">
                        <span id="user-name" className="navbar-item noHover">
                            {user}
                        </span>
                        <span className="icon is-large">
                            <Icon path={mdiAccount} size={1.2} />
                        </span>
                    </div>
                </div>
            </nav>
        </>
    );
};
export default Navbar;
