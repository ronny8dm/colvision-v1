import React from "react";
import { NavLink, useLocation } from "react-router-dom";

interface NavBarProps {
    resetState: () => void;
}

const NavBar = ({ resetState }: NavBarProps) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();
    const desktopClasses = "mr-10 font-medium text-base";
    const mobileClasses = "mx-8 text-xl font-semibold";

    return (
        <div className="sticky top-0 z-50 flex items-center justify-center w-full bg-white md:border-b-gray-200 md:border-b-[1px] pt-3 pb-3">
            <img
                onClick={() => {
                    setIsMenuOpen(true);
                }}
                className="absolute left-0 h-3 mx-6 md:hidden"
                src="/assets/hamburger.svg"
                alt="Mobile Menu"
            />
            <NavLink
                className="mt-2 text-xl font-bold leading-tight md:mx-6 lg:text-2xl"
                onClick={resetState}
                to={"/"}
                style={{ fontWeight: 700 }}
            >
                <div className="text-center">
                    Colvision app
                </div>
                <div className="text-xs font-normal justify-items-center text-center text-gray-500 lg:text-sm md:text-start">
                    Colour visualizer and colour matching
                </div>
            </NavLink>

        </div>
    );
};

export default NavBar;