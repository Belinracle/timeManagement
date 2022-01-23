import DisciplineData from "../types/Discipline";
import DisciplineService from "../services/DisciplineService";
import TaskData from "../types/Task";
import TaskService from "../services/TaskService";
import SubtaskData from "../types/Subtask";
import TreeNode from "primereact/treenode";
import {TreeCheckboxSelectionKeys} from "primereact/tree";
import GroupData from "../types/Group";
import {simpleJSON} from "../http-common";
import GroupService from "../services/GroupService";

export const loadTasksForDiscipline = (disc: DisciplineData) => {
    return DisciplineService.getDisciplineTasks(disc.id)
        .then((tasks: Array<TaskData>) => {
            disc.tasks = tasks;
        })
}

export const loadDisciplineForGroup = (group: GroupData) => {
    return GroupService.getGroupDisciplines(group.id)
        .then((disciplines: Array<DisciplineData>) => {
            group.disciplines = disciplines;
        }).then(()=>loadTasks(group.disciplines!))
        .then(()=>loadSubtasks(group.disciplines!))
}

export const loadSubtasksForTask = (task: TaskData) => {
    return TaskService.getTaskSubtasks(Number(task.id!.toString()))
        .then((subtasks: Array<SubtaskData>) => {
            task.subtasks = subtasks
        })
}

export const loadTasks = (disciplines: DisciplineData[]) => {
    let promises: Array<Promise<void>> = [];
    disciplines.map((disc) => {
        promises.push(loadTasksForDiscipline(disc))
    })
    return Promise.all(promises);
}

export const loadSubtasks = (disciplines: DisciplineData[]) => {
    let promises: Array<Promise<void>> = [];
    disciplines.map((disc) => {
        disc.tasks?.map((task) => {
            promises.push(loadSubtasksForTask(task))
        })
    })
    return Promise.all(promises);
}

export const loadDisciplinesForGroups=(groups:GroupData[])=>{
    let promises: Array<Promise<void>> = [];
    groups.map((group) => {
        // @ts-ignore
        return promises.push(loadDisciplineForGroup(group));
    })
    return Promise.all(promises);
}

export const loadGroupFromUserGroups = (userGroupId: number, canModify: boolean, groups: GroupData[]) => {
    console.log("loading group from user groupe with attribute can modify")
    console.log(canModify)
    return simpleJSON.get<GroupData>(`/groupsUsers/${userGroupId}/group`)
        .then((response) => {
            console.log("loaded group")
            groups.push({
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                canmodify: canModify
            })
        })
}

export const loadGroups = (userGroups: { id: number; canmodify: boolean; }[], groups: GroupData[]) => {
    console.log("loading groups")
    console.log(userGroups)
    let promises: Array<Promise<void>> = [];
    userGroups.map((userGroup) => {
        promises.push(loadGroupFromUserGroups(userGroup.id, userGroup.canmodify, groups))
    })
    return Promise.all(promises).then(()=>{
        groups
            .sort((a: GroupData, b: GroupData) => a.name > b.name ? 1 : -1)
    });
}

export const convertSubtaskToTreeNode = (subtask: SubtaskData, taskKey: string) => {
    // @ts-ignore
    let subtaskKey = taskKey.concat('-').concat(subtask.id.toString())
    return {
        key: subtaskKey,
        label: subtask.name,
        leaf: true,
        selectable: true,
        data: {...subtask, type: 'subtask'}
    }
}

export const convertSubtasksToTreeNode = (subtasks: Array<SubtaskData> | undefined, taskKey: string) => {
    let subtaskNodes: Array<TreeNode> = []
    subtasks?.map((subtask) => {
        subtaskNodes.push(convertSubtaskToTreeNode(subtask, taskKey))
    })
    return subtaskNodes
}

export const findDoneSubtasksNodeKeys = (treeNodes: TreeNode[]) => {
    let selectedKeys: TreeCheckboxSelectionKeys = {}
    treeNodes.map((disc) => {
        disc.children?.map((task) => {
            task.children?.map((subtask: TreeNode) => {
                if (subtask.key && subtask.data.isDone) {
                    selectedKeys[subtask.key.toString()] = {checked: true};
                }
            })
        })
    })
    return selectedKeys
}
export const convertTaskToTreeNode = (task: TaskData, disciplineId: string) => {
    const taskKey = disciplineId.concat('-').concat(<string>task?.id?.toString());
    return {
        key: taskKey,
        label: task.name,
        data: {...task, type: 'task'},
        children: convertSubtasksToTreeNode(task.subtasks, taskKey),
        selectable: false,
    }
}

export const convertTasksToTreeNode = (tasks: Array<TaskData> | undefined, disciplineId: string) => {
    let taskNodes: Array<TreeNode> = [];
    tasks?.map((task) => {
        taskNodes.push(convertTaskToTreeNode(task, disciplineId))
    })
    return taskNodes;
}

export const convertDisciplineToTreeNode = (disc: DisciplineData) => {
    // @ts-ignore
    let discKey = disc.id.toString();
    return {
        key: discKey,
        label: disc.name,
        selectable: false,
        data: {...disc, type: 'discipline'},
        children: convertTasksToTreeNode(disc.tasks, discKey),
    }
}

export const generateTreeNodes = (disciplines: DisciplineData[] | undefined) => {
    let nodes: TreeNode[] = [];
    disciplines?.map((disc) => {
        nodes.push(convertDisciplineToTreeNode(disc))
    })
    return nodes;
}