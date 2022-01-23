import Header from "../components/Header";
import React, {useEffect, useRef, useState} from "react";
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
    generateTreeNodes, loadDisciplinesForGroups, loadGroupFromUserGroups, loadGroups,
    loadSubtasks,
    loadTasks
} from "../util/dataLoading";
import {Toast} from "primereact/toast";
import {ContextMenu} from "primereact/contextmenu";
import {Description} from "../components/Description";
import SubtaskService from "../services/SubtaskService";
import {Button} from "primereact/button";
import {Grid, Paper} from "@material-ui/core";
import {addCommand, addDisciplineToTree, deleteCommand, findNodeByKey} from "../util/treeManipulating";
import GroupData from "../types/Group";
import {Accordion, AccordionTab} from "primereact/accordion";
import {GroupsTrees} from "../components/GroupsTrees";


const Main = () => {
    let username = localStorage.getItem("username");
    const [treeNodes, setTreeNodes] = useState(Array<TreeNode>());
    const [disciplines, setDisciplines] = useState<Array<DisciplineData>>();
    let [groups, setGroups] = useState<Array<GroupData>>();
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

    const menu = [
        {
            label: 'Add Children',
            icon: 'pi pi-plus',
            command: () => {
                // @ts-ignore
                addCommand(selectedNodeKey, treeNodes)
                    .then(() => loadUserData())
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-minus',
            command: () => {
                // @ts-ignore
                deleteCommand(selectedNodeKey, treeNodes)
                    .then(() => loadUserData())
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
        loadUserData()
        loadUserGroupsData()
    }, [])

    const loadUserGroupsData = () => {
        groups=[]
        if (username) {
            UserService.getUserGroups(username)
                .then((response) => {
                    loadGroups(response,groups!)
                        .then(()=> {
                            loadDisciplinesForGroups(groups!)
                                .then(() => {
                                    setGroups(groups)
                                    console.log("are groups loaded?")
                                    console.log(groups)
                                })
                        })
                });
        }
    }

    const loadUserData = () => {
        console.log("loading data from server")
        // console.log(selectedNodeKey)
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
            addDisciplineToTree(username).then(() => loadUserData())
        }
    }

    useEffect(() => {
        // console.log("disciplineTree changed, generating tree nodes")
        let nodes = generateTreeNodes(disciplines)
        setTreeNodes(nodes)
    }, [disciplines])

    useEffect(() => {
        // console.log('treeNode changed with state')
        // console.log(treeNodes)
        let keysSelected = findDoneSubtasksNodeKeys(treeNodes);
        setSelectedKeys(keysSelected);
        let foundNode = findNodeByKey(selectedNodeKey, treeNodes);
        setDescribableNode(foundNode)
    }, [treeNodes])

    // @ts-ignore
    return (<div>
        <Header/>
        <Paper>
            <Grid container>
                <Grid item sm={6} md={6}>
                    <Toast ref={toast}/>
                    <ContextMenu model={menu} ref={cm}/>
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
                              contextMenuSelectionKey={selectedNodeKey}
                              onContextMenuSelectionChange={(event) => {
                                  setSelectedNodeKey(event!.value!.toString())
                              }}
                              onContextMenu={event => cm.current.show(event.originalEvent)}/>
                    </div>
                </Grid>
                <Grid item sm={6} md={6}>
                    <Description
                        mutable={true}
                        node={describableNode}
                        updateCB={loadUserData}
                    />
                </Grid>
            </Grid>
        </Paper>
        <GroupsTrees 
            groups={groups!}
            updateCB={loadUserGroupsData}/>
        {/*<Accordion multiple>*/}
        {/*    {groups!.map((group,index) => {*/}
        {/*         return <AccordionTab header={group.name}>*/}
        {/*            zalupa*/}
        {/*        </AccordionTab>*/}
        {/*    })}*/}
        {/*    <AccordionTab header="Header I">*/}
        {/*        Content I*/}
        {/*    </AccordionTab>*/}
        {/*    <AccordionTab header="Header II">*/}
        {/*        Content II*/}
        {/*    </AccordionTab>*/}
        {/*    <AccordionTab header="Header III">*/}
        {/*        Content III*/}
        {/*    </AccordionTab>*/}
        {/*</Accordion>*/}

    </div>)
}
export default Main;