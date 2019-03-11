import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 600px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

class Register extends React.Component {

    constructor() {
        super();
        this.state = {
            name: "",
            username: "",
            birthday: "",
            password: "",
            passwordRepeat: "",
            passwordNotIdentical: false
        };
    }

    filledIn () {
        return !this.state.username || !this.state.name || !this.state.birthday || !this.state.password || !this.state.passwordRepeat
            || this.state.passwordNotIdentical
    };

    checkPassword(){
        if (this.state.password!==this.state.passwordRepeat) {
            this.setState({[this.state.passwordNotIdentical] : true})
            return alert("password not identical")
        }
        else {
            this.register()
        }
    };

    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    register() {
        fetch(`${getDomain()}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                name: this.state.name,
                birthday: this.state.birthday,
                password: this.state.password,
                passwordRepeat: this.state.passwordRepeat,
                passwordNotIdentical: this.state.passwordNotIdentical
            })
        })
            .then(async response => {
                if (!response.ok) {
                    const error = await response.json();
                    alert(error.message);
                    this.props.history.push(`/register`);
                }
               else{const user = new User(response);
                    // store the token into the local storage
                    localStorage.setItem("token", user.token);
                    // user login successfully worked --> navigate to the route /game in the GameRouter
                    this.props.history.push(`/game`);

                }
            })
            // .then(returnedUser => {
            //     const user = new User(returnedUser);
            //     // store the token into the local storage
            //     localStorage.setItem("token", user.token);
            //     // user login successfully worked --> navigate to the route /game in the GameRouter
            //     this.props.history.push(`/game`);
            // })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });

    };

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>Username</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                            }}
                        />
                        <Label>Name</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("name", e.target.value);
                            }}
                        />
                        <Label>birthday</Label>
                        <InputField
                            type={`date`}
                            //placeholder={"dd.mm.yyyy"}
                            onChange={e => {
                                this.handleInputChange("birthday", e.target.value);
                            }}
                        />
                        <Label>Password</Label>
                        <InputField
                            type={"password"}
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("password", e.target.value);
                            }}
                        />
                        <Label>Repeat Password</Label>
                        <InputField
                            type={"password"}
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("passwordRepeat", e.target.value);
                            }}
                        />
                        <ButtonContainer>
                            <Button /* register button */
                                color="red"
                                disabled={this.filledIn()} width="50%"
                                onClick={() => {
                                    this.checkPassword();
                                }}
                            >
                                register
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Register);