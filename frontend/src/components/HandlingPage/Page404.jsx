import React from "react";

function Page404() {
  return (
    <div>
      <div id="error-page">
        <div class="content">
          <h2 class="header" data-text="404">
            404
          </h2>
          <h4 data-text="Opps! Page not found">Opps! Page not found</h4>
          <p className="error-page">
            Sorry, the page you're looking for doesn't exist. If you think
            something is broken, report a problem.
          </p>
          <div class="btns">
            <button className="btn-home">
              <a href="/" className="returnbtn">
                return home
              </a>
            </button>
            {/* <a href="https://www.codingnepalweb.com/">report problem</a> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page404;
