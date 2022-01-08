import {makeStyles} from "@material-ui/core/styles";
import Header from "../components/Header";
import {useEffect, useRef, useState} from "react";
import UserService from "../services/UserService";
import DisciplineData from "../types/Discipline";
import {
    Tree,
    TreeCheckboxSelectionKeys,
    TreeCheckboxSelectionKeyType,
    TreeEventNodeParams,
    TreeSelectionKeys
} from "primereact/tree";
import TreeNode from "primereact/treenode";
import {findDoneSubtasksNodeKeys, generateTreeNodes, loadSubtasks, loadTasks} from "../util/dataLoading";
import {Toast} from "primereact/toast";
import {ContextMenu} from "primereact/contextmenu";
import {Description} from "../components/Description";

const useStyles = makeStyles({
    main: {
        width: "100%",
    }
})


const Main = () => {
    const classes = useStyles();
    let username = localStorage.getItem("username");
    let [treeNodes, setTreeNodes] = useState(Array<TreeNode>());
    let [disciplines, setDisciplines] = useState(Array<DisciplineData>());
    const [selectedKeys, setSelectedKeys] = useState<TreeSelectionKeys>();
    const [selectedNodeKey, setSelectedNodeKey] = useState<string>('');
    const [describableNode, setDescribableNode] = useState<TreeNode>();
    const toast = useRef<any>(null);
    const cm = useRef<any>(null);

    const onNodeSelect = (nodeParams: TreeEventNodeParams) => {
        nodeParams.node.data.isDone = true
    }
    const onNodeUnselect = (node: TreeEventNodeParams) => {
        node.node.data.isDone = false
    }

    const findNodeByKey = (key: string) => {
        let temp = key.split('-')
        let keys:string[] = []
        for (let i=0;i<temp.length;i++){
            if(i!=0){
                keys.push(keys[i-1].concat('-').concat(temp[i]))
            }else{
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

    const menu = [
        {
            label: 'Add Children',
            icon: 'pi pi-plus',
            command: () => {
                console.log("adding child")
                if (toast && toast.current) {
                    toast!.current!.show({severity: 'success', summary: 'Node Key', detail: selectedNodeKey});
                }
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-minus',
            command: () => {
                console.log("deleting")
            }
        },
        {
            label: 'Describe',
            icon: 'pi pi-search',
            command: () => {
                console.log("DESCRIBING")
                console.log(selectedNodeKey)
                let foundNode = findNodeByKey(selectedNodeKey);
                console.log(foundNode)
                setDescribableNode(foundNode)
            }
        }
    ];

    const loadData = () => {
            if (username) {
                let disciplinesLoaded = UserService.getUserDisciplines(username).then((disc) => {
                    return setDisciplines(disc)
                });
                let tasksLoaded = disciplinesLoaded.then(() => {
                    return loadTasks(disciplines)
                });
                let subtasksLoaded = tasksLoaded.then(() => {
                    return loadSubtasks(disciplines);
                });
                let treeNodesGenerated = subtasksLoaded.then(() => {
                    return setTreeNodes(generateTreeNodes(disciplines));
                });
                let subtasksDoneSelected = treeNodesGenerated.then(() => {
                    let keysSelected = findDoneSubtasksNodeKeys(treeNodes);
                    setSelectedKeys(keysSelected)
                })
            } else {
                console.log("Somebody corrupted localStorage")
            }
        }
    ;

    useEffect(() => {
        loadData()
    }, []);

    return <div className={classes.main}>
        <Header/>
        <div className="p-grid">
            <div className="p-col-5">
                <Toast ref={toast}/>
                <ContextMenu model={menu} ref={cm} onHide={() => setSelectedNodeKey('')}/>
                <div className="card">
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
        <div className="p-col-6">
            <Description
                node={describableNode}

            />
        </div>
    </div>
}
export default Main;