import React from "react";
const SPACE = "%20";
const NEW_LINE = "%0D%0A";
const EMAIL = "segment-anything@meta.com";
const SUBJECT = "Segment Anything Demo Feedback";
const BODY = `Hello Segment Anything team,${NEW_LINE}${NEW_LINE}I'd like to give you some feedback about your demo.`;
const subject = SUBJECT.replaceAll(" ", SPACE);
const body = BODY.replaceAll(" ", SPACE);
const FeedbackModal = () => {
    return (React.createElement("div", { className: "modal", id: "feedback-modal" },
        React.createElement("div", { className: "modal-box" },
            React.createElement("div", { className: "flex flex-row justify-between mb-2 text-sm" },
                React.createElement("h3", { className: "text-xl" }, "Feedback"),
                React.createElement("span", null,
                    React.createElement("a", { href: "#", className: "font-bold" }, "Close"))),
            React.createElement("p", null,
                "Please email all feedback to ",
                React.createElement("br", { className: "md:hidden" }),
                React.createElement("a", { href: `mailto:${EMAIL}?subject=${subject}&body=${body}`, style: { fontWeight: "bold" }, className: "hover:underline" }, EMAIL)))));
};
export default FeedbackModal;
//# sourceMappingURL=FeedbackModal.js.map