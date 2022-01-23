import TreeNode from "primereact/treenode";
import {TaskComponent} from "./TaskComponent";
import {DisciplineComponent} from "./DisciplineComponent";
import {SubtaskComponent} from "./SubtaskComponent";
import {useEffect} from "react";
import {Paper} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Card} from "primereact/card";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mock: {
            margin: theme.spacing(5)
        }
    })
);


export const Description = (prop: { node: TreeNode | undefined, updateCB: any, mutable: boolean}) => {

    const classes = useStyles();

    useEffect(() => {

    }, [prop.node])
    switch (prop?.node?.data.type) {
        case 'discipline':
            return <DisciplineComponent
                mutable={prop.mutable}
                discipline={prop?.node?.data}
                node={prop?.node}
                updateCB={prop.updateCB}

            />
        case 'task':
            return <TaskComponent
                mutable={prop.mutable}
                task={prop?.node?.data}
                node={prop?.node}
                updateCB={prop.updateCB}
            />
        case 'subtask':
            return <SubtaskComponent
                mutable={prop.mutable}
                subtask={prop?.node?.data}
                node={prop?.node}
                updateCB={prop.updateCB}
            />
    }
    return <div>
        <Card className={classes.mock}>Choose TreeNode that you want to describe</Card>
    </div>
}
