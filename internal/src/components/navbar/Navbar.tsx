import React, { FC } from 'react';
import { MdPerson } from 'react-icons/md';

const Navbar: FC = (props) => {
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
                            src="https://www.lolland.dk/Files/Images/system/Lolland9.png"
                            width="112"
                            height="28"
                        />
                    </a>
                </div>

                <div className="navbar-start">
                    <a
                        className="navbar-item"
                        onClick={() => props.editFavorites()}
                        // href="#"
                    >
                        Mine Favoritter
                    </a>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <span
                            id="user-name"
                            className="navbar-item noHover"
                        >
                            {user}
                        </span>

                        <span className="icon is-large">
                            <MdPerson size={30} />
                        </span>
                    </div>
                </div>
            </nav>
        </>
    );
};
export default Navbar;
