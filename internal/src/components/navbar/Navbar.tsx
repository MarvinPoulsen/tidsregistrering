// Import statements
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';
import './navbar.scss';
import { SpsUser } from '../../SPS';
enum Tab {
    Basic,
    Complex,
    Statistics,
    Projects,
    Tasks,
    Users,
}
interface NavbarProps {
    user: SpsUser;
    setIsFavoriteActive: (isOn: boolean) => void;
    logo: string;
    setNote: (newNote) => void;
    setTaskId: (newTaskId) => void;
    resetForm: () => void;
    formInfo?: () => void;
}
const Navbar = (props: NavbarProps) => {
    const location = useLocation();

    const [isActiveTab, setActiveTab] = useState<Tab>(null);
    React.useEffect(() => {
        switch (location.pathname) {
            case '/':
            case '/basic':
                props.resetForm();
                setActiveTab(Tab.Basic);
                break;
            case '/complex':
                props.resetForm();
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

    const userName = props.user.name;
    return (
        <>
            <nav className="navbar is-fixed-top is-brand" role="navigation" aria-label="main navigation">
            {/* <nav className="navbar is-umbra" role="navigation" aria-label="main navigation"> */}
                <div className="navbar-brand">
                    <a className="navbar-item noHover">
                        <img src={props.logo} alt="Lolland Kommune" width="112" height="28" />
                    </a>
                </div>

                <div className="navbar-start">
                    <a className="navbar-item" onClick={() => props.setIsFavoriteActive(true)}>
                        Mine Favoritter
                    </a>
                    <Link to="/basic" className={isActiveTab === Tab.Basic ? 'is-on navbar-item' : 'navbar-item'}>
                        {/* <span>
                                <Icon path={mdiHome} size={1} />
                            </span> */}
                        <span className="navigation-text">Basic</span>
                    </Link>
                    <Link to="/complex" className={isActiveTab === Tab.Complex ? 'is-on navbar-item' : 'navbar-item'}>
                        {/* <span>
                                <Icon path={mdiHome} size={1} />
                            </span> */}
                        <span className="navigation-text">Complex</span>
                    </Link>
                </div>

                <div className="navbar-end">
                    <Link to="/statistics" className={isActiveTab === Tab.Statistics ? 'is-on navbar-item' : 'navbar-item'}>
                        {/* <span>
                                <Icon path={mdiHome} size={1} />
                            </span> */}
                        <span className="navigation-text">Statistics</span>
                    </Link>
                    {props.user.hasPermission('endpoint.ep_lk_tasm_admin') && (
                        <div className="navbar-item has-dropdown is-hoverable" key={isActiveTab}>
                            <a
                                className={
                                    isActiveTab === Tab.Projects || isActiveTab === Tab.Tasks || isActiveTab === Tab.Users
                                        ? 'navbar-link is-on'
                                        : 'navbar-link'
                                }
                            >
                                Admin
                            </a>
                            <div className="navbar-dropdown has-shadow">
                            {/* <div className="navbar-dropdown has-shadow has-background-umbra-lightest"> */}
                                <Link
                                    to="/projects"
                                    className={
                                        isActiveTab === Tab.Projects
                                            ? 'is-on navbar-item is-selected'
                                            : 'navbar-item'
                                            // : 'navbar-item has-background-umbra-lightest'
                                    }
                                >
                                    Projects
                                </Link>
                                <Link
                                    to="/tasks"
                                    className={
                                        isActiveTab === Tab.Tasks
                                            ? 'is-on navbar-item is-selected'
                                            : 'navbar-item'
                                            // : 'navbar-item has-background-umbra-lightest'
                                    }
                                >
                                    Tasks
                                </Link>
                                <Link
                                    to="/users"
                                    className={
                                        isActiveTab === Tab.Users
                                            ? 'is-on navbar-item is-selected'
                                            : 'navbar-item'
                                            // : 'navbar-item has-background-umbra-lightest'
                                    }
                                >
                                    Users
                                </Link>
                            </div>
                        </div>
                    )}
                    <div className="navbar-item">
                        <span id="user-name" className="navbar-item noHover">
                            {userName}
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
