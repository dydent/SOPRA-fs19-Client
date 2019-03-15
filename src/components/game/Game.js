import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/Player";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,

    };
  }

  showUser(id) {
    this.props.history.push(`/user/${id}`);
  }

  logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      this.props.history.push("/login");
}

  componentDidMount() {
    fetch(`${getDomain()}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
        .then(async res => {
        if (!res.ok) {
            const error = await res.json();
            alert(error.message);
            console.log(res.status);
        } else {
            const users = await res.json();
            this.setState({ users });
            console.log(res.status);

        }
        })
      .catch(err => {
        console.log(err);
        alert("Something went wrong fetching the users: " + err);
      });
  }

  render() {
    return (
      <Container>
        <h2>Happy Coding! </h2>
        <p>Get all users from secure end point:</p>
        {!this.state.users ? (
          <Spinner />
        ) : (
          <div>
            <Users>
              {this.state.users.map(user => {
                return (
                  <PlayerContainer key={user.id}>
                    <Player
                        user={user}
                        showUser={() =>{this.showUser(user.id)}}
                    />
                  </PlayerContainer>
                );
              })}
            </Users>
            <Button
              width="100%"
              onClick={() => {
                this.logout();
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Game);
