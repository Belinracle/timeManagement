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
import TaskData from "../types/Task";
import TaskService from "../services/TaskService";


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

type TaskComponentState = {
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
    | { type: 'updateTask', payload: TaskData }

const reducer = (state: TaskComponentState, action: ActionType): TaskComponentState => {
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
        case 'updateTask':
            return {
                ...state,
                description: action.payload.description,
                name: action.payload.name
            }
    }
}

export const TaskComponent = (prop: { task: TaskData, node: TreeNode}) => {

    const initialState: TaskComponentState = {
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
            payload: prop.task.name
        });
        dispatch({
            type: 'setDescription',
            payload: prop.task.description
        });
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

    const handleSaveClick = () => {
        let newTaskState: TaskData = {
            name: state.name,
            description: state.description,
        }
        TaskService.updateTask(prop.task.id,newTaskState)
            .then((response)=>{
                console.log('updated task')
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