import React from "react";
import axios from "axios";
import io from "socket.io-client";
import "./Posts.css";

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      des: "",
      seemore: true,
      less: "",
      seeless:false,
      nm:''
    };
    this.seeMore = this.seeMore.bind(this);
    this.seeLess = this.seeLess.bind(this);
    this.state.des = this.props.description;
  }
  componentDidMount() {
    if (this.props.name !== undefined) {
      var n= this.props.name.slice(0,2);
      this.setState({
        nm:n
      });
      console.log(this.state.less);
    }
    if (this.props.less !== undefined) {
      this.setState({
        less: this.props.less,
      });
      console.log(this.state.less);
    }

    if (this.props.description !== undefined) {
      if (this.props.description.length < 400) {
        this.setState({
          seemore: false,
        });
      } else {
      }
    } else {
    }
  }
  seeMore() {
    this.setState({
      less: this.props.description,
      seemore: !this.state.seemore,
      seeless: !this.state.seeless
    });
  }
  seeLess() {
    this.setState({
      less: this.props.less,
      seemore: !this.state.seemore,
      seeless: !this.state.seeless
    });
  }
  render() {

    const imageClick = (id) => {
      const API_URL = "http://localhost:8080/api/user/";
      const user = JSON.parse(localStorage.getItem("user"));
      axios
        .post(
          API_URL + "likePost",
          { id: id },
          {
            headers: {
              auth: "Bearer " + user.token,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          const socket = io("http://localhost:8080/");
          socket.emit("sending");
          socket.on("post", (data) => {
            console.log(data);
          });
        });
    };
    const dislikeClick = (id) => {
      const API_URL = "http://localhost:8080/api/user/";
      const user = JSON.parse(localStorage.getItem("user"));
      axios
        .post(
          API_URL + "dislikePost",
          { id: id },
          {
            headers: {
              auth: "Bearer " + user.token,
            },
          }
        )
        .then((response) => {
          const socket = io("http://localhost:8080/");
          socket.emit("sending");
          socket.on("post", (data) => {
            console.log(data);
          });
        });
    };

    return (
      <div className="mainPost">
        <div className="inside">
          <div className="row">
            <div className="leftColumn">
              <h3 className="title">{this.props.title}</h3>
              {this.state.seemore ? (
                <div>
                  <h3 className="description">{this.state.less}</h3>{" "}
                  <button
                    className="btn seemore"
                    onClick={() => this.seeMore()}
                  >
                    <a className="seeText"href="#a">See more</a>
                  </button>
                </div>
              ) : (
                <h3 className="description">{this.props.description}</h3>
              )}
              {
                this.state.seeless?(
                  <button
                    className="btn seeless"
                    onClick={() => this.seeLess()}
                  >
                    <a className="seeText" href="#b">See less</a>
                  </button>
                ):(null)
              }
            </div>
            <div className="rightColumn">
              <div className="name">
              <h5 className="nameText">{this.state.nm}</h5>
              </div>
              <h3 className="description">{this.props.name}</h3>
            </div>

            <div className="row2">
              <div style={{"width":"200px"}}> 
                <h3 className="time">{this.props.time}</h3>
              </div>
              <div className="bar">
                <div>
                <div
                  className="barcolor"
                  style={{ width: this.props.bar + "%" }}
                ></div>
                </div>
              </div>
              <div className="row3 btn">
                <h3 className="description">{this.props.likes}</h3>
                <img
                  height="32px"
                  style={{"margin-top":"-20px"}}
                  src={require("../../Assets/like.png")}
                  alt="like"
                  onClick={() => imageClick(this.props.id)}
                />
              </div>
              <div className="row3 btn">
                <h3 className="description">{this.props.dislikes}</h3>
                <img
                  height="32px"
                  style={{"margin-top":"-20px"}}
                  alt="dislike"
                  src={require("../../Assets/unlike.png")}
                  onClick={() => dislikeClick(this.props.id)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
