import React from "react";
import { Link } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";
const Footer = () => {
    return (React.createElement("div", { className: "border-t bg-gray-50" },
        React.createElement("div", { className: "flex flex-row-reverse items-baseline justify-between mx-8 my-2 xl:my-4" },
            React.createElement("div", null,
                React.createElement(Link, { className: "flex mx-4 text-gray-300 justify-center items-center space-x-4", to: "https://github.com/MizzleAa/segment-anything-demo", target: "_blank" },
                    React.createElement("p", null, "Sampling by @ MizzleAa"),
                    " ",
                    React.createElement(AiFillGithub, { className: "text-gray-700 h-5 w-5" }))))));
};
export default Footer;
//# sourceMappingURL=Footer.js.map