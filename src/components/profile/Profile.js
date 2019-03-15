import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import User from "../shared/models/User";


const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const Container = styled(BaseContainer)`
  color: white;
  border-color: white;
  text-align: center;
  width: 60%;
  margin: auto;
`;
const Users = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff26;
  border-radius: 5px;
 
  
`;


class Profile extends React.Component {

    state = {
        user: null,

    };


    componentDidMount() {
        const {id} = this.props.match.params;
        fetch(`${getDomain()}/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                if (!res.ok) {
                    const error = await res.json();
                    alert(error.message);
                    this.props.history.push("/game");
                } else {
                    console.log(res.status);
                    console.log(this.state.user);
                    const user = new User(await res.json());
                    this.setState({user: user});
                    console.log(this.state.user);
                }
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
    }

    back() {
        this.props.history.push(`/game/dashboard`);
    }
    editUser(){
        // const {id} = this.props.match.params;
        this.props.history.push(`/edit`);
    }

    formatDate(dateTime) {
        const date = new Date(dateTime);
        const day = date.getDate();
        const monthIndex = date.getMonth() + 1; // Index 0 is january
        const year = date.getFullYear();

        return `${day}. ${monthIndex}. ${year}`;
    }


    render() {

        return (
            <Container>
                <h2>User Information </h2>
                <p></p>
                {!this.state.user ? (
                    <Spinner />
                ) : (
                    <div>
                        <Users>
                            {"Username:"}   {this.state.user.username}
                        </Users>
                        <p></p>

                        <Users>
                            {"Birthday:"}   {this.state.user.birthday}
                        </Users>
                        <p></p>
                        <Users>
                            {"Creation Date:"}   {this.formatDate(this.state.user.createDate)}
                        </Users>
                        <p></p>
                        <Users>
                            {"Status:"}   {this.state.user.status}
                        </Users>
                        <ButtonContainer>
                            <Button /* log in button */
                                width="50%"
                                onClick={() => {
                                    this.back();
                                }}
                            >
                                Back
                            </Button>
                            <Button /* register button */
                                width="50%"
                                onClick={() => {
                                    this.editUser();
                                }}
                            >
                                Edit User
                            </Button>
                        </ButtonContainer>
                    </div>

                )}
            </Container>
        );
    }






}

export default withRouter(Profile)










