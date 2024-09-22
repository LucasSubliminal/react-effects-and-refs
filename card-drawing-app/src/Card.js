import React from "react";

function Card({ image }) {
  // Generate a random rotation angle between -20 and 20 degrees
  const randomRotation = Math.floor(Math.random() * 40 - 20);

  return (
    <img
      src={image}
      alt="Playing card"
      style={{
        width: "100px",
        margin: "10px",
        transform: `rotate(${randomRotation}deg)`,
        position: "absolute",
      }}
    />
  );
}

export default Card;
