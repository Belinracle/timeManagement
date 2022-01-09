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
import SubtaskData from "../types/Subtask";
import TaskData from "../types/Task";
import SubtaskService from "../services/SubtaskService";


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
            marginTop: theme.spacing(5)
        }
    })
);

type SubtaskComponentState = {
    name: string
    description: string
    isDone: boolean
    isButtonDisabled: boolean
    helperText: string
    isError: boolean
};

type ActionType = { type: 'setName', payload: string }
    | { type: 'setDescription', payload: string }
    | { type: 'setIsDone', payload: boolean }
    | { type: 'setIsError', payload: boolean }
    | { type: 'setIsButtonDisabled', payload: boolean }

const reducer = (state: SubtaskComponentState, action: ActionType): SubtaskComponentState => {
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
        case 'setIsDone':
            return {
                ...state,
                isDone: action.payload,
            }
    }
}

export const TaskComponent = (prop: { subtask: SubtaskData, node: TreeNode }) => {

    const initialState: SubtaskComponentState = {
        name: '',
        description: '',
        isDone: false,
        isButtonDisabled: true,
        helperText: '',
        isError: false
    };

    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatch({
            type: 'setName',
            payload: prop.subtask.name
        });
        dispatch({
            type: 'setDescription',
            payload: prop.subtask.description
        });
        dispatch({
            type: 'setIsDone',
            payload: prop.subtask.isDone
        })
    }, [prop])

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

    const handleNameChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setName',
                payload: event.target.value
            });
        };

    const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setDescription',
                payload: event.target.value
            });
        }
    const handleIsDoneChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
        // console.log(i)
        //     // dispatch({
        //     //     type: 'setIsDone',
        //     //     payload: event.target.value
        //     // });
        }

    const handleSaveClick = () => {
        let newSubtaskState: TaskData = {
            name: state.name,
            description: state.description,
        }
        SubtaskService.updateSubtask(prop.subtask.id, newSubtaskState)
            .then((response) => {
                console.log('updated subtask')
                console.log(response)
                prop.node.label = state.name
            })
    }

    return (
        <div>
            <form className={classes.container} noValidate autoComplete="off">
                <Card className={classes.card}>
                    <CardHeader className={classes.header} title="This is Task"/>
                    <CardContent>
                        <div>
                            <TextField
                                error={state.isError}
                                fullWidth
                                value={state.name}
                                id="name"
                                label="Name"
                                placeholder="Task name"
                                margin="normal"
                                onChange={handleNameChange}
                            />
                            <TextField
                                error={state.isError}
                                fullWidth
                                value={state.description}
                                id="description"
                                label="Description"
                                placeholder="Description of Task"
                                margin="normal"
                                helperText={state.helperText}
                                onChange={handleDescriptionChange}
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