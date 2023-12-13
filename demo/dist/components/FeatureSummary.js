import React from "react";
import { NavLink } from "react-router-dom";
import { getTextColors } from "./helpers/metaTheme";
export default function FeatureSummary({ label, actions, darkMode, centerAlign, small, style, children, className, useNavLink, justifyCenter, }) {
    const { primary, secondary } = getTextColors(darkMode || false);
    const uiColor = darkMode ? "bg-gray-800" : "bg-white";
    const linkBody = (l) => (React.createElement(React.Fragment, null,
        React.createElement("button", null,
            React.createElement("svg", { width: "26", height: "26", viewBox: "0 0 26 26", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                React.createElement("path", { className: `${darkMode ? "" : ""}`, opacity: "0.4", fillRule: "evenodd", clipRule: "evenodd", d: "M13 25C6.37258 25 0.999999 19.6274 0.999999 13C0.999999 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13C25 19.6274 19.6274 25 13 25Z", stroke: `${darkMode ? "white" : "#1C2B33"}` }),
                React.createElement("path", { className: `${darkMode
                        ? "fill-white group-hover:fill-blue-200"
                        : "fill-gray-600 group-hover:fill-primary"}`, d: "M14.3214 9L18 13L14.3214 17L13.6711 16.3068L16.2521 13.5L8 13.5V12.5L16.2396 12.5L13.6711 9.70711L14.3214 9Z", fill: "#1C2B33" }))),
        React.createElement("span", { className: `font-bold ${primary} ${darkMode ? "group-hover:text-blue-200" : "group-hover:text-primary"}` }, l.action)));
    return (React.createElement("div", { className: `comp_summary ${darkMode ? "dark-mode" : ""} ${centerAlign ? "text-center" : "text-left"} ${className}` },
        label &&
            (small ? (React.createElement("p", { className: `${secondary} mb-0` }, label)) : (React.createElement("h6", { className: `${secondary} mb-2` }, label))),
        React.createElement("div", null, children),
        React.createElement("div", { className: `flex gap-5 ${centerAlign ? "items-center" : "items-start w-full"} ${justifyCenter && "justify-center"}` }, actions &&
            actions.map((l, key) => {
                return useNavLink ? (React.createElement(NavLink, { key: key, to: l.actionUrl, className: "flex items-center gap-2 py-2 mt-4 no-underline group" }, linkBody(l))) : (React.createElement("a", { key: key, href: l.actionUrl, className: "flex items-center gap-2 py-2 mt-4 no-underline group" }, linkBody(l)));
            }))));
}
//# sourceMappingURL=FeatureSummary.js.map