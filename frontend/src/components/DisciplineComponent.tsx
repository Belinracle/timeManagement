import DisciplineData from "../types/Discipline";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React, {useEffect, useReducer} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TreeNode from "primereact/treenode";
import DisciplineService from "../services/DisciplineService";


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
    name: string
    description: string
    isButtonDisabled: boolean
    helperText: string
    isError: boolean
};

type ActionType = { type: 'setName', payload: string }
    | { type: 'setDescription', payload: string }
    | { type: 'setIsError', payload: boolean }
    | { type: 'setIsButtonDisabled', payload: boolean }
    | { type: 'updateDiscipline', payload: DisciplineData }

const reducer = (state: State, action: ActionType): State => {
    switch (action.type) {
        case 'setName':
            return {
                ...state,
                name: action.payload
            };
        case 'setIsButtonDisabled':
            return {
                ...state,
                isButtonDisabled: action.payload
            };
        case 'setDescription':
            return {
                ...state,
                description: action.payload
            };
        case 'setIsError':
            return {
                ...state,
                isError: action.payload
            };
        case 'updateDiscipline':
            return {
                ...state,
                description: action.payload.description,
                name: action.payload.name
            }
    }
}

export const DisciplineComponent = (prop: { discipline: DisciplineData, node: TreeNode, updateNodesCB:any }) => {

    const initialState: State = {
        name: '',
        description: '',
        isButtonDisabled: true,
        helperText: '',
        isError: false
    };

    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatch({
            type: 'setName',
            payload: prop.discipline.name
        });
        dispatch({
            type: 'setDescription',
            payload: prop.discipline.description
        });
    }, [])

    useEffect(() => {
        if (state.name.trim() && state.description.trim()) {
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
    }, [state.description, state.name]);

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.keyCode === 13 || event.which === 13) {
            console.log(event)
        }
    };

    const handleNameChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setName',
                payload: event.target.value
            });
        };

    const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            console.log("description changed here is state current before updating")
            console.log(state)
            dispatch({
                type: 'setDescription',
                payload: event.target.value
            });
        }

    const handleSaveClick = () => {
        let newDisciplineState: DisciplineData = {
            name: state.name,
            description: state.description,
        }
        DisciplineService.updateDiscipline(prop.discipline.id,newDisciplineState)
            .then((response)=>{
                console.log('updated discipline')
                console.log(response)
                prop.node.label = state.name
                prop.updateNodesCB()
            })
    }

    return (
        <div>
            <form className={classes.container} noValidate autoComplete="off">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="This is Discipline"/>
                    <CardContent>
                        <div>
                            <TextField
                                error={state.isError}
                                fullWidth
                                value={state.name}
                                id="name"
                                label="Name"
                                placeholder="Discipline name"
                                margin="normal"
                                onChange={handleNameChange}
                                onKeyPress={handleKeyPress}
                            />
                            <TextField
                                error={state.isError}
                                fullWidth
                                value={state.description}
                                id="description"
                                label="Description"
                                placeholder="Description of Discipline"
                                margin="normal"
                                helperText={state.helperText}
                                onChange={handleDescriptionChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.loginBtn}
                            onClick={handleSaveClick}
                            disabled={state.isButtonDisabled}>
                            Save
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </div>
    )
}