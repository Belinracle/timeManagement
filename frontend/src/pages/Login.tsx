import React, {useReducer, useEffect} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {useNavigate} from "react-router-dom";

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import UserService from '../services/UserService'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            width: 400,
            margin: `${theme.spacing(0)} auto`
        },
        loginBtn: {
            marginTop: theme.spacing(2),
            flexGrow: 1
        },
        header: {
            textAlign: 'center',
            background: '#212121',
            color: '#fff'
        },
        card: {
            marginTop: theme.spacing(10)
        }
    })
);

type State = {
    username: string
    password: string
    isButtonDisabled: boolean
    helperText: string
    isError: boolean
};

const initialState: State = {
    username: '',
    password: '',
    isButtonDisabled: true,
    helperText: '',
    isError: false
};

type Action = { type: 'setUsername', payload: string }
    | { type: 'setPassword', payload: string }
    | { type: 'setIsButtonDisabled', payload: boolean }
    | { type: 'loginSuccess', payload: string }
    | { type: 'loginFailed', payload: string }
    | { type: 'registerFailed', payload: string }
    | { type: 'setIsError', payload: boolean };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setUsername':
            return {
                ...state,
                username: action.payload
            };
        case 'setPassword':
            return {
                ...state,
                password: action.payload
            };
        case 'setIsButtonDisabled':
            return {
                ...state,
                isButtonDisabled: action.payload
            };
        case 'loginSuccess':
            return {
                ...state,
                helperText: action.payload,
                isError: false
            };
        case 'loginFailed':
            return {
                ...state,
                helperText: action.payload,
                isError: true
            };
        case 'registerFailed':
            return {
                ...state,
                helperText: action.payload,
                isError: true
            }
        case 'setIsError':
            return {
                ...state,
                isError: action.payload
            };
    }
}

const Login = () => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);
    let navigate = useNavigate()

    useEffect(() => {
        if (state.username.trim() && state.password.trim()) {
            dispatch({
                type: 'setIsButtonDisabled',
                payload: false
            });
        } else {
            dispatch({
                type: 'setIsButtonDisabled',
                payload: true
            });
        }
    }, [state.username, state.password]);

    const handleLogin = () => {
        UserService.get(state.username)
            .then((response: any) => {
                if (state.password === response.data.password) {
                    dispatch({
                        type: 'loginSuccess',
                        payload: 'Login Successfully'
                    });
                    localStorage.setItem("username", state.username);
                    navigate("/main");
                } else {
                    dispatch({
                        type: 'loginFailed',
                        payload: 'Incorrect password'
                    });
                }
            })
            .catch((e: Error) => {
                console.log(e);
                dispatch({
                    type: 'loginFailed',
                    payload: "User doesn't exist"
                });
            });
    };

    const handleRegister = () => {
        UserService.get(state.username)
            .then((response: any) => {
                dispatch({
                    type: 'registerFailed',
                    payload: 'User with this username already exists'
                });
            }).catch((e: Error) => {
            // console.log("User doesn't exist, so create him");
            UserService.create({
                id: state.username,
                password: state.password,
                disciplineSet:[]
            })
                .then((response: any) => {
                    // console.log("User created");
                })
                .catch((e: Error) => {
                    console.log("Error while creating user");
                });
        })
    };


    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13 || event.which === 13) {
            state.isButtonDisabled || handleLogin();
        }
    };

    const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setUsername',
                payload: event.target.value
            });
        };

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setPassword',
                payload: event.target.value
            });
        }
    return (
        <div>
            <form className={classes.container} noValidate autoComplete="off">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="Time Management App"/>
                    <CardContent>
                        <div>
                            <TextField
                                error={state.isError}
                                fullWidth
                                id="username"
                                type="email"
                                label="Username"
                                placeholder="Username"
                                margin="normal"
                                onChange={handleUsernameChange}
                                onKeyPress={handleKeyPress}
                            />
                            <TextField
                                error={state.isError}
                                fullWidth
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="Password"
                                margin="normal"
                                helperText={state.helperText}
                                onChange={handlePasswordChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            className={classes.loginBtn}
                            onClick={handleLogin}
                            disabled={state.isButtonDisabled}>
                            Login
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            className={classes.loginBtn}
                            onClick={handleRegister}
                            disabled={state.isButtonDisabled}>
                            Register
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </div>
    );
}

export default Login;