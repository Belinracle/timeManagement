import TreeNode from "primereact/treenode";
import {TaskComponent} from "./TaskComponent";
import {DisciplineComponent} from "./DisciplineComponent";
import {SubtaskComponent} from "./SubtaskComponent";
import {useParams} from "react-router-dom";

export const Description=(prop: {node:TreeNode | undefined, updateNodesCB:any})=>{

    switch (prop?.node?.data.type){
        case 'discipline':
            return <DisciplineComponent
                discipline={prop?.node?.data}
                node={prop?.node}
                updateNodesCB={prop.updateNodesCB}
            />
        case 'task':
            return <TaskComponent/>
        case 'subtask':
            return <SubtaskComponent/>
    }
    return <div>Can't determine type of node</div>
}
