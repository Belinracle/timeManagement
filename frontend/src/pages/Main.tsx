import {makeStyles} from "@material-ui/core/styles";
import Header from "../components/Header";
import {useEffect, useRef, useState} from "react";
import UserService from "../services/UserService";
import DisciplineData from "../types/Discipline";
import {
    Tree,
    TreeEventNodeParams,
    TreeSelectionKeys
} from "primereact/tree";
import TreeNode from "primereact/treenode";
import {
    convertSubtaskToTreeNode,
    findDoneSubtasksNodeKeys,
    generateTreeNodes,
    loadSubtasks,
    loadTasks
} from "../util/dataLoading";
import {Toast} from "primereact/toast";
import {ContextMenu} from "primereact/contextmenu";
import {Description} from "../components/Description";
import SubtaskService from "../services/SubtaskService";
import TaskService from "../services/TaskService";
import SubtaskData from "../types/Subtask";
import DisciplineService from "../services/DisciplineService";
import TaskData from "../types/Task";
import {Button} from "primereact/button";

const useStyles = makeStyles({
    main: {
        width: "90%",
    }
})


const Main = () => {
    const classes = useStyles();
    let username = localStorage.getItem("username");
    const [treeNodes, setTreeNodes] = useState(Array<TreeNode>());
    const [disciplines, setDisciplines] = useState<Array<DisciplineData>>();
    const [selectedKeys, setSelectedKeys] = useState<TreeSelectionKeys>();
    const [selectedNodeKey, setSelectedNodeKey] = useState<string>('');
    const [describableNode, setDescribableNode] = useState<TreeNode>();
    const toast = useRef<any>(null);
    const cm = useRef<any>(null);

    const onNodeSelect = (subtask: TreeEventNodeParams) => {
        subtask.node.data.isDone = true
        SubtaskService.updateSubtask(subtask.node.data.id,subtask.node.data).then(()=> {
                setTreeNodes(treeNodes);
            }
        )
    }
    const onNodeUnselect = (subtask: TreeEventNodeParams) => {
        subtask.node.data.isDone = false
        SubtaskService.updateSubtask(subtask.node.data.id,subtask.node.data).then(()=> {
                setTreeNodes(treeNodes);
            }
        )
    }

    const findNodeByKey = (key: string) => {
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

    const newSubtask:SubtaskData={
        name: "test deleting task subtask",
        description: "мне лень придумывать",
        isDone: false
    }

    const newTask:TaskData={
        name: "test deleting task",
        description: "мне лень придумывать",
    }

    const menu = [
        {
            label: 'Add Children',
            icon: 'pi pi-plus',
            command: () => {
                console.log("adding child")
                let foundNode = findNodeByKey(selectedNodeKey);
                switch (foundNode?.data.type){
                    case 'task':
                        TaskService.addSubtask(foundNode?.data.id, newSubtask)
                            .then(()=>loadData())
                        break;
                    case 'discipline':
                        DisciplineService.addTask(foundNode?.data.id, newTask)
                            .then(()=>loadData())
                        break
                }
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-minus',
            command: () => {
                console.log("deleting")
                let foundNode = findNodeByKey(selectedNodeKey);
                switch (foundNode?.data.type){
                    case 'subtask':
                        SubtaskService.deleteSubtask(foundNode?.data.id)
                            .then(()=>loadData())
                        break;
                    case 'task':
                        TaskService.deleteTask(foundNode?.data.id)
                            .then(()=>loadData())
                        break;
                    case 'discipline':
                        DisciplineService.deleteDiscipline(foundNode?.data.id)
                            .then(()=>loadData())
                }
            }
        },
        {
            label: 'Describe',
            icon: 'pi pi-search',
            command: () => {
                let foundNode = findNodeByKey(selectedNodeKey);
                setDescribableNode(foundNode)
            }
        }
    ];

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        if (username) {
            console.log("test")
            console.log(disciplines)
            UserService.getUserDisciplines(username).then((disc) => {
                loadTasks(disc).then(() => loadSubtasks(disc)).then(() => {
                    setDisciplines(disc);
                })
            });
        }
    }

    useEffect(() => {
        console.log("discipline changed: ")
        console.log(disciplines)
        let nodes = generateTreeNodes(disciplines)
        setTreeNodes(nodes)
    }, [disciplines])

    useEffect(() => {
        console.log("tree node changed")
        let keysSelected = findDoneSubtasksNodeKeys(treeNodes);
        setSelectedKeys(keysSelected);
    }, [treeNodes])

    return (<div className={classes.main}>
        <Header/>
        <div className="p-grid">
            <div className="p-col-6">

                <Toast ref={toast}/>
                <ContextMenu model={menu} ref={cm} onHide={() => setSelectedNodeKey('')}/>
                <div className="card">
                    <Button></Button>
                    <Tree selectionMode="checkbox"
                          onSelect={onNodeSelect}
                          onUnselect={onNodeUnselect}
                          selectionKeys={selectedKeys}
                          onSelectionChange={e => {
                              if (e !== null) setSelectedKeys(e.value)
                          }}
                          value={treeNodes}
                          onNodeClick={(param) => {
                              console.log("node clicked")
                              console.log(param.node)
                          }}
                          contextMenuSelectionKey={selectedNodeKey}
                          onContextMenuSelectionChange={(event) => {
                              setSelectedNodeKey(event!.value!.toString())
                          }}
                          onContextMenu={event => cm.current.show(event.originalEvent)}/>
                </div>
            </div>
        </div>
        <div className="p-col-4">
            <Description
                node={describableNode}
            />
        </div>
    </div>)
}
export default Main;