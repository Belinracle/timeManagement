import TreeNode from "primereact/treenode";
import {useEffect} from "react";

export const Description=(prop: {node:TreeNode | undefined})=>{
    return <div>{prop?.node?.key}</div>
}
