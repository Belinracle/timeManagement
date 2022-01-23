import SubtaskService from "../services/SubtaskService";
import TaskService from "../services/TaskService";
import DisciplineService from "../services/DisciplineService";
import TreeNode from "primereact/treenode";
import SubtaskData from "../types/Subtask";
import TaskData from "../types/Task";
import UserService from "../services/UserService";
import DisciplineData from "../types/Discipline";

export const newSubtask: SubtaskData = {
    name: "new subtask",
    description: "мне лень придумывать",
    isDone: false
}

export const newTask: TaskData = {
    name: "new Task",
    description: "мне лень придумывать",
}

export const newDiscipline: DisciplineData = {
    name: "new Discipline",
    description: "мне лень придумывать",
}

export const findNodeByKey = (key: string, treeNodes: Array<TreeNode>) => {
    let temp = key.split('-')
    let keys: string[] = []
    for (let i = 0; i < temp.length; i++) {
        if (i != 0) {
            keys.push(keys[i - 1].concat('-').concat(temp[i]))
        } else {
            keys.push(temp[i]);
        }
    }
    let layer: TreeNode[] = treeNodes;
    for (let i: number = 0; i < keys.length; i++) {
        for (let j: number = 0; j < layer.length; j++) {
            if (layer[j].key == keys[i]) {
                if (i === keys.length - 1) {
                    return layer[j]
                } else {
                    // @ts-ignore
                    layer = layer[j].children
                }
                break
            }
        }
    }
}

export const deleteCommand=(selectedNodeKey:any, treeNodes: Array<TreeNode>) => {
    // console.log("deleting")
    let foundNode = findNodeByKey(selectedNodeKey,treeNodes);
    switch (foundNode?.data.type) {
        case 'subtask':
            return SubtaskService.deleteSubtask(foundNode?.data.id)
        case 'task':
            return TaskService.deleteTask(foundNode?.data.id)
        case 'discipline':
            return DisciplineService.deleteDiscipline(foundNode?.data.id)
    }
    return null
}

export const addCommand=(selectedNodeKey:any, treeNodes: Array<TreeNode>) => {
    // console.log("adding child")
    let foundNode = findNodeByKey(selectedNodeKey,treeNodes);
    switch (foundNode?.data.type) {
        case 'task':
            return TaskService.addSubtask(foundNode?.data.id, newSubtask)
        case 'discipline':
            return DisciplineService.addTask(foundNode?.data.id, newTask)
    }
}

export const addDisciplineToTree=(username:string)=>{
    // console.log("adding discipline")
    return UserService.addDiscipline(username,newDiscipline)
}