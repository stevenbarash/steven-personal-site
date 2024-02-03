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

// LandingPage component using Bulma CSS
const LandingPage = () => {
  return (
    <section className="section has-background-dark"> {/* Use has-background-dark for a dark background */}
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half has-text-centered">
            <figure className="image is-128x128 is-inline-block">
              <img className="is-rounded" src="./images/me.png" alt="me" />
            </figure>
            <h1 className="title has-text-light">Hey! I'm Steven</h1> {/* Use has-text-light for light text */}
            <h2 className="subtitle has-text-light">
              I'm a Sr. Solutions Engineer at <a href="https://www.id.me" className="has-text-info">ID.me</a> and photographer based in Brooklyn, NYC 🗽
            </h2>
            <p className="has-text-light">Follow me here:</p> {/* Use has-text-light for light text */}
            <div className="buttons is-centered">
              {socialMediaButtons.map((button, index) => (
                <a key={index} className="button is-dark is-inverted" href={button.linkUrl}> {/* Use is-dark and is-inverted for legible buttons */}
                  <span className="icon">
                    <img src={button.iconUrl} alt="Social Media Icon" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;