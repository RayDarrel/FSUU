import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import axios from "axios";

// Private Routes
import PrivateAdmin from "./Private/PrivateAdmin";
import PrivateStudent from "./Private/PrivateStudent";
import PrivateDean from "./Private/PrivateDean";
import PrivateChairman from "./Private/PrivateChairman";
import { QueryClient, QueryClientProvider } from "react-query";
import Page404 from "./components/HandlingPage/Page404";
import SearchResult from "./components/SearchResult";
import OpenDocument from "./components/OpenDocument";
import BookingForm from "./components/BookingForm";
import Contact from "./components/Contact";
import About from "./components/About";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("auth_token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Router>
        <Switch>
          <Route exact path={"/"} component={Login}></Route>
          <Route exact path={"/about"} component={About}></Route>
          <Route exact path={"/contact"} component={Contact}></Route>
          <Route exact path={"/searchresults=:id"} component={SearchResult} />
          <Route exact path={"/document/refid=:id"} component={OpenDocument} />
          <Route exact path={"/bookform/refid=:id"} component={BookingForm} />
          {/* Admin */}
          <PrivateAdmin path="/admin" name="admin" />

          {/* Student */}
          <PrivateStudent path={"/student"} name="Student" />

          {/* Dean */}
          <PrivateDean path="/faculty" name="Faculty" />

          <Route component={Page404}></Route>
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
