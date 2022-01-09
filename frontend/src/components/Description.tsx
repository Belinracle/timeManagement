import TreeNode from "primereact/treenode";

export const Description=(prop: {node:TreeNode | undefined})=>{

    if(prop?.node?.data.type==='subtask') {
        console.log(prop?.node?.data)
        return <div>{prop?.node?.data.name}</div>
    }
    else return <div>{prop?.node?.data.type}</div>
}
