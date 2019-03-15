import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import User from "../shared/models/User";


const FormContainer = styled.div`
color: white;
font-size: 25px;
text-align: center;
text-transform: uppercase;
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
  height: 375px;
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






class Edit extends React.Component {

    constructor() {
        super();
        this.state = {
            user: new User(),
            username: null,
            birthday: null
        };
    }


    // formatDate(dateTime) {
    //     const date = new Date(dateTime);
    //     const day = date.getDate();
    //     const monthIndex = date.getMonth() + 1; // Index 0 is january
    //     const year = date.getFullYear();
    //
    //     return `${day}. ${monthIndex}. ${year}`;
    // }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    back() {
        this.props.history.push(`/game/dashboard`);
    }

    saveChanges(){
        console.log(this.state.user)
        console.log(this.state.username)
        console.log(this.state.birthday)
        this.editUser();


    }

    editUser() {
        fetch(`${getDomain()}/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: this.state.user.id,
                username: this.state.username,
                birthday: this.state.birthday
            })
        })
        .then(response => {
            if (!response.ok) {
                    alert(response.message);

            } else {
                console.log(response.status);
                console.log(this.state.user)
                console.log(this.state.username)
                console.log(this.state.birthday)
                this.props.history.push(`/user/${this.state.user.id}`);
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

    componentDidMount() {
        const userId = localStorage.getItem("id");
        fetch(`${getDomain()}/users/${userId}`, {
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
                    const user = new User(await res.json());
                    this.setState({user: user});
                    this.setState({
                        username: this.state.user.username
                    });
                    this.setState({
                        birthday: this.state.user.birthday
                    });
                    console.log(this.state);
                    console.log(res.status);

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





    render() {

        return (
            <BaseContainer>
                <FormContainer>Edit information of {this.state.username}
                    <Form>
                        <Label>Username</Label>
                        <InputField
                            placeholder={this.state.username}
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                            }}
                        />
                        <Label>Birthday</Label>
                        <InputField
                            type={`date`}
                            placeholder={this.state.birthday}
                            onChange={e => {
                                this.handleInputChange("birthday", e.target.value);
                            }}
                        />
                    </Form>
                </FormContainer>
                <ButtonContainer>
                    <Button /* log in button */
                        width="28%"
                        onClick={() => {
                            this.back()
                        }}
                    >
                        Back
                    </Button>
                    <Button /* log in button */
                        width="28%"
                        onClick={() => {
                            this.saveChanges()
                        }}
                    >
                        save changes
                    </Button>
                </ButtonContainer>
            </BaseContainer>
        );
    }

}

 export default withRouter(Edit)










