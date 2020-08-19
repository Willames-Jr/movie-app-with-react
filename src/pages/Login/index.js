import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, Card, CardBody } from 'reactstrap';
import Header from '../../components/Header';
import usersApi from '../../services/usersApi';
import NavBar from '../../components/NavBar';
import './styles.css'
export default class Login extends Component {

    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            message: this.props.history.action === 'POP' ? [] : [this.props.location.state.message]
        };
    }

    showErrors = () => {
        return this.state.message.forEach((element, index, array) => {
            return <Alert color="danger" className="text-center">oi</Alert>

        })


    }

    signIn = () => {

        var errors = [];

        if (!this.password || typeof this.password == undefined || this.password == null) {
            errors.push('A senha não pode estar vazia');
        } else if (this.password.length < 6) {
            errors.push('A senha deve possuir mais de 5 caracteres');
        }
        if (!this.email || typeof this.email == undefined || this.email == null) {
            errors.push('O email não pode estar vazio');
        } else if (!this.email.includes('@') || !this.email.includes('.com')) {
            errors.push('Email inválido');
        }
        if (errors.length > 0) {
            return this.setState({
                message: errors
            });

        }

        const data = {
            email: this.email, password: this.password
        };


        usersApi.post('login', data)
            .then(response => {
                if (response.data.error) {
                    return this.setState({
                        message: [response.data.error]
                    });
                }
                localStorage.setItem('token', response.data.token);
                this.setState({
                    message: []
                });
                this.props.history.push('/admin');
                return;
            }).catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container mt-4" id = "container">
                    <Card id = "card">
                        <CardBody>
                            <Form>
                                <Header title="Login" />
                                <hr className="my-3" />
                                {
                                    this.state.message.map((err) => {
                                        return <Alert color="danger" key={err} className="text-center">{err}</Alert>
                                    })
                                }
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input type="text" id="email" onChange={e => this.email = e.target.value} placeholder="informe seu e-mail" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Senha</Label>
                                    <Input type="password" id="password" onChange={e => this.password = e.target.value} placeholder="informe sua senha" />
                                </FormGroup>
                                <Button color="primary" block onClick={this.signIn}>Entrar</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </div>

            </div>
        );
    }
}