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
import {Grid, Paper} from "@material-ui/core";
import {addCommand, addDisciplineToTree, deleteCommand, findNodeByKey} from "../util/treeManipulating";


const Main = () => {
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
        SubtaskService.updateSubtask(subtask.node.data.id, subtask.node.data).then(() => {
                setTreeNodes(treeNodes);
            }
        )
    }
    const onNodeUnselect = (subtask: TreeEventNodeParams) => {
        subtask.node.data.isDone = false
        SubtaskService.updateSubtask(subtask.node.data.id, subtask.node.data).then(() => {
                setTreeNodes(treeNodes);
            }
        )
    }

    const onButtonAddDisciplineClick = () => {

    }

    // @ts-ignore
    const menu = [
        {
            label: 'Add Children',
            icon: 'pi pi-plus',
            command: () => {
                // @ts-ignore
                addCommand(selectedNodeKey, treeNodes)
                    .then(() => loadData())
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-minus',
            command: () => {
                // @ts-ignore
                deleteCommand(selectedNodeKey, treeNodes)
                    .then(() => loadData())
            }
        },
        {
            label: 'Describe',
            icon: 'pi pi-search',
            command: () => {
                let foundNode = findNodeByKey(selectedNodeKey, treeNodes);
                setDescribableNode(foundNode)
            }
        }
    ];

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        if (username) {
            UserService.getUserDisciplines(username).then((disc) => {
                loadTasks(disc).then(() => loadSubtasks(disc)).then(() => {
                    setDisciplines(disc);
                })
            });
        }
    }

    const onAddDisciplineButtonClickHandler = () => {
        if (username) {
            // @ts-ignore
            addDisciplineToTree(username).then(() => loadData())
        }
    }

    useEffect(() => {
        let nodes = generateTreeNodes(disciplines)
        setTreeNodes(nodes)
    }, [disciplines])

    useEffect(() => {
        let keysSelected = findDoneSubtasksNodeKeys(treeNodes);
        setSelectedKeys(keysSelected);
    }, [treeNodes])

    const updateNodes=()=>{
        console.log('updating')
        console.log(treeNodes)
        setTreeNodes(treeNodes)
    }

    return (<div>
        <Header/>
        <Paper>
            <Grid container>
                <Grid item sm={6} md={6}>
                    <Toast ref={toast}/>
                    <ContextMenu model={menu} ref={cm} onHide={() => setSelectedNodeKey('')}/>
                    <div>
                        <Button label="Add discipline" icon="pi pi-plus" onClick={onAddDisciplineButtonClickHandler}/>
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
                </Grid>
                <Grid item sm={6} md={6}>
                    <Description
                        node={describableNode}
                        updateNodesCB={updateNodes}
                    />
                </Grid>
            </Grid>
        </Paper>


    </div>)
}
export default Main;