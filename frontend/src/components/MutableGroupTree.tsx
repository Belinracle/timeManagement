import {Grid, Paper} from "@material-ui/core";
import {Toast} from "primereact/toast";
import {ContextMenu} from "primereact/contextmenu";
import {Button} from "primereact/button";
import {Tree, TreeEventNodeParams, TreeSelectionKeys} from "primereact/tree";
import {Description} from "./Description";
import TreeNode from "primereact/treenode";
import {addCommand, deleteCommand, findNodeByKey, newDiscipline} from "../util/treeManipulating";
import {useEffect, useRef, useState} from "react";
import GroupData from "../types/Group";
import {findDoneSubtasksNodeKeys, generateTreeNodes} from "../util/dataLoading";
import SubtaskService from "../services/SubtaskService";
import GroupService from "../services/GroupService";
import {AccordionTab} from "primereact/accordion";

export const MutableGroupTree = (prop: { updateCB: any, group: GroupData, key: number }) => {
    const [treeNodes, setTreeNodes] = useState(Array<TreeNode>());
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

    useEffect(() => {
        // console.log("disciplineTree changed, generating tree nodes")
        let nodes = generateTreeNodes(prop.group.disciplines)
        setTreeNodes(nodes)
    }, [prop.group])

    useEffect(() => {
        let keysSelected = findDoneSubtasksNodeKeys(treeNodes);
        setSelectedKeys(keysSelected);
        let foundNode = findNodeByKey(selectedNodeKey, treeNodes);
        setDescribableNode(foundNode)
    }, [treeNodes])

    const onAddDisciplineButtonClickHandler = () => {
        console.log("adding discipline to group")
        GroupService.addDiscipline(prop.group.id, newDiscipline)
            .then(() => prop.updateCB())
    }

    const menu = [
        {
            label: 'Add Children',
            icon: 'pi pi-plus',
            command: () => {
                // @ts-ignore
                addCommand(selectedNodeKey, treeNodes)
                    .then(() => prop.updateCB())
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-minus',
            command: () => {
                // @ts-ignore
                deleteCommand(selectedNodeKey, treeNodes)
                    .then(() => prop.updateCB())
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
    return (
            <Paper>
                <Grid container>
                    <Grid item sm={6} md={6}>
                        <Toast ref={toast}/>
                        <ContextMenu model={menu} ref={cm}/>
                        <div>
                            <Button label="Add discipline" icon="pi pi-plus"
                                    onClick={onAddDisciplineButtonClickHandler}/>
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
                            updateCB={prop.updateCB}
                        />
                    </Grid>
                </Grid>
            </Paper>
    )
}