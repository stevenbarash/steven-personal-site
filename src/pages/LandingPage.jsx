import React from "react";
import "./LandingPage.css";
const socialMediaButtons = [
  {
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png",
    linkUrl: "https://www.linkedin.com/in/stevenbarash",
  },
  {
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/X_icon_2.svg/2048px-X_icon_2.svg.png",
    linkUrl: "https://twitter.com/steven_barash",
  },
  {
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png",
    linkUrl: "https://www.instagram.com/steven.photography",
  },
];

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      {/* This div contains the actual content */}
      <div>
        {/* This div contains the actual content */}
        <h1>Hey! I'm Steven Barash</h1>
        <h5>
          I'm a{" "}
          <span className="solutions-engineer-outline">
            Solutions Engineer{" "}
            {/* <span className="tooltip-text">
              Read blog post: What the heck is a Solutions Engineer?
            </span> */}
          </span>
          at <a href="https://www.okta.com">Okta</a> and photographer based in
          Brooklyn, NY 🗽
        </h5>
        <p>Follow me here:</p>
        <div className="icon-container">
          {socialMediaButtons.map((button, index) => (
            <a className="icon-wrapper" key={index} href={button.linkUrl}>
              <img
                className="icon"
                src={button.iconUrl}
                alt="Social Media Icon"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
