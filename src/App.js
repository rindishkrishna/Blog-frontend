import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Login/Login.js";
import AuthService from "./Services/auth.service";

// import TeamPage from './Pages/Team/TeamPage';
// import CaseStudy from './Pages/CaseStudy/CaseStudy';
// import Navbar from './components/Navbar';

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut() {
    AuthService.logout();
  }
  render() {
    const { currentUser } = this.state;
    return (
      <Router>
        <div className="App">
          {currentUser ? <Link to={"/home"}></Link> : <Link to={"/"}></Link>}

          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/home" component={Landing} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
