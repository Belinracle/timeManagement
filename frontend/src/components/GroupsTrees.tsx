import GroupData from "../types/Group";
import {ImmutableGroupTree} from "./ImmutableGroupTree";
import {MutableGroupTree} from "./MutableGroupTree";

import {Paper} from "@material-ui/core";
import {Accordion, AccordionTab} from "primereact/accordion";

export const GroupsTrees = (prop: { updateCB: any, groups: GroupData[] }) => {
    console.log(prop.groups)
    const getImmutableTree = (group: GroupData, index: number) => {
        return <AccordionTab header={group.name}>
            <ImmutableGroupTree
                key={index}
                updateCB={prop.updateCB}
                group={group}/>
        </AccordionTab>
    }
    const getMutableTree = (group: GroupData, index: number) => {
        return <AccordionTab header={group.name}><MutableGroupTree
            key={index}
            updateCB={prop.updateCB}
            group={group}/>
        </AccordionTab>
    }

    if (prop.groups) {
        return (
            <Accordion multiple>
                {prop.groups.map((group, index) => {

                    if (group.canmodify) {
                        return getMutableTree(group, index)
                    } else {
                        return getImmutableTree(group, index)
                    }

                })}
            </Accordion>
        )
    } else return <div>Data not loaded yet</div>
}