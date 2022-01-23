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
import {InputSwitch} from "primereact/inputswitch";
import {Calendar} from "primereact/calendar";


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
    deadline?: Date | Date[]
    isButtonDisabled: boolean
    helperText: string
    isError: boolean
};

type ActionType = { type: 'setName', payload: string }
    | { type: 'setDescription', payload: string }
    | { type: 'setIsDone', payload: boolean }
    | { type: 'setDeadline', payload?: Date | Date[] }
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
        case 'setDeadline':
            return {
                ...state,
                deadline: action.payload
            }
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

export const SubtaskComponent = (prop: { subtask: SubtaskData, node: TreeNode, updateCB: any, mutable: boolean }) => {

    const initialState: SubtaskComponentState = {
        name: '',
        description: '',
        isDone: false,
        deadline: undefined,
        isButtonDisabled: true,
        helperText: '',
        isError: false
    };

    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if(prop.subtask.deadline !== null){
            dispatch({
                type: 'setDeadline',
                payload: new Date(prop.subtask.deadline!.toString())
            })
        }
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

    const handleSaveClick = () => {
        let newSubtaskState: SubtaskData = {
            name: state.name,
            description: state.description,
            isDone: state.isDone,
            deadline: state.deadline
        }
        SubtaskService.updateSubtask(prop.subtask.id, newSubtaskState)
            .then((response) => {
                prop.updateCB()
            })
    }

    // @ts-ignore
    if (prop.mutable) {
        return (
            <div>
                <form className={classes.container} noValidate autoComplete="off">
                    <Card className={classes.card}>
                        <CardHeader className={classes.header} title="This is Subtask"/>
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
                                <div>Выполнена</div>
                                <InputSwitch checked={state.isDone} onChange={(e) => dispatch({
                                    type: 'setIsDone',
                                    payload: e.value
                                })}/>
                                <div>Deadline</div>
                                <Calendar value={state.deadline}
                                          onChange={(e) => {
                                              dispatch({
                                                  type: 'setDeadline',
                                                  payload: e.value
                                              })
                                          }
                                          }
                                          monthNavigator yearNavigator yearRange="2010:2030"
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
    }else {
        return(
            <div>
                <form className={classes.container} noValidate autoComplete="off">
                    <Card className={classes.card}>
                        <CardHeader className={classes.header} title="This is Subtask"/>
                        <CardContent>
                            <div>
                                <div> Subtask name: ${prop.subtask.name}</div>
                                <div> Subtask Description: ${prop.subtask.description}</div>

                                <div>Выполнена: ${prop.subtask.isDone}</div>
                                <div>Deadline: ${prop.subtask.deadline}</div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        )
    }
}