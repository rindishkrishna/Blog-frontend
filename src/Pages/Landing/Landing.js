import React, { button } from "react";
import io from "socket.io-client";
import "./Landing.css";
import axios from "axios";
import Posts from "../../Components/Posts/Posts";
import dateFormat from "dateformat";

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [""],
      textAreaValue: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.logout = this.logout.bind(this);
  }
  handleChange(e) {
    this.setState({
      textAreaValue: e.target.value,
    });
  }

  handleClick(e) {
    e.preventDefault();
    const API_URL = "http://localhost:8080/api/user/";
    const user = JSON.parse(localStorage.getItem("user"));
    var str = this.state.textAreaValue;
    let len = this.state.textAreaValue.length;
    var title = str.slice(0, len / 3);
    axios
      .post(
        API_URL + "createPost",
        { title: title, description: this.state.textAreaValue },
        {
          headers: {
            auth: "Bearer " + user.token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      });
    const socket = io("http://localhost:8080/");
    socket.emit("sending");
    socket.on("post", (data) => {
      console.log(data);
      this.setState({
        result: data.query,
      });
    });
  }
  componentDidMount() {
    const API_URL = "http://localhost:8080/api/user/";
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axios
        .get(API_URL + "posts", {
          headers: {
            auth: "Bearer " + user.token,
          },
        })
        .then((response) => {
          const socket = io("http://localhost:8080/");
          socket.emit("sending");
          socket.on("post", (data) => {
            console.log(data);
            this.setState({
              result: data.query,
            });
          });
        });
    } else {
      window.open("/");
    }
  }
  logout() {
    localStorage.removeItem("user");
    window.open("/");
  }
  render() {
  
    return (
      <div className="main">
        <div>
          <div className="inner">
            <div className="row1">
              <textarea
                className="textArea"
                value={this.state.textAreaValue}
                onChange={this.handleChange}
                placeholder="What do you want to tell world?"
              />

              <div className="logDiv">
                <button className="btn" onClick={() => this.logout()}>
                  <img height="32px"  alt="log out"src={require("../../Assets/logout.png")} />
                  <h1 className="logout">Log Out</h1>
                </button>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block"
              style={{ width: "100px", "margin-top": "10px" }}
              onClick={this.handleClick}
            >
              Post
            </button>
          </div>
          <div className="post">
            {this.state.result.map((item) => {
              if (item.description !== undefined) {
                var less = item.description.slice(0, 100);
              }

              return (
                <Posts
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  description={item.description}
                  less={less}
                  time={dateFormat(item.createdOn, "mmmm dS, yyyy, h:MM TT")}
                  name={item.createdBy}
                  likes={item.likes}
                  dislikes={item.dislikes}
                  bar={(item.likes / (item.likes + item.dislikes)) * 100}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
