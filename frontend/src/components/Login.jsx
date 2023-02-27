import React from "react";
import axios from "axios";
import swal from "sweetalert";
import { useState } from "react";
import { Button } from "primereact/button";
import { FaSearch } from "react-icons/fa";
import { InputText } from "primereact/inputtext";
import NavBar from "./NavBar";
import Banner from "./Banner";

function Login() {
  const [searchtext, setSearch] = useState({
    fulltext: "",
  });

  const handleInput = (e) => {
    e.persist();
    setSearch({ ...searchtext, [e.target.name]: e.target.value });
  };

  const Search = (e) => {
    e.preventDefault();

    if (searchtext.fulltext === "") {
      return false;
    } else {
      const data = {
        fulltext: searchtext.fulltext,
      };
      localStorage.setItem("keyword", data.fulltext);
      axios
        .post(`/api/SearchDocument`, data)
        .then((res) => {
          if (res.data.status === 200) {
            window.location.href = `/searchresults=${data.fulltext}`;
          } else if (res.data.status === 404) {
            swal("Error", res.data.error, "error");
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            swal("Warning", error.response.statusText, "warning");
          }
        });
    }
  };

  return (
    <React.Fragment>
      <NavBar />
      <Banner />
      <div className="mt-3">
        <form onSubmit={Search}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <h4 className="text-details">
                  <FaSearch /> FSUU Search Thesis{" "}
                </h4>
                <div className="p-inputgroup">
                  <InputText
                    placeholder="Keyword, Title"
                    name="fulltext"
                    className="p-inputtext"
                    onChange={handleInput}
                  />
                  <Button icon="pi pi-search" className="p-button-info" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export default Login;
