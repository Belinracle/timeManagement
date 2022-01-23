import {simpleJSON} from "../http-common";
import SubtaskData from "../types/Subtask";
import TaskData from "../types/Task";

const updateSubtask = (subtaskId: number | undefined, updatedSubtask: SubtaskData) => {
    return simpleJSON.put(`/subtasks/${subtaskId}`, updatedSubtask)
        .then((response: any) => {
            // console.log("бновилась подзадача")
        })
}

const deleteSubtask = ((subtaskId: number) => {
    return simpleJSON.delete(`/subtasks/${subtaskId}`)
        .then((response: any) => {
                // console.log("удалили подзадачу")
                // console.log(response)
            }
        )
})

const SubtaskService = {
    updateSubtask,
    deleteSubtask
}
export default SubtaskService