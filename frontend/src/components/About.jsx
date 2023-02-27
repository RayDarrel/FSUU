import React from "react";
import NavBar from "./NavBar";

function About() {
  return (
    <div>
      <NavBar />
      <div className="container mt-3">
        <h4>About</h4>
        <div className="text-container">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
            fugit, quia rerum consequatur harum cumque libero voluptates culpa
            facilis delectus, ducimus doloremque quod ullam deleniti explicabo.
            Inventore adipisci eaque explicabo?
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
