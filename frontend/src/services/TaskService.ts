import {simpleJSON, specialURIList} from "../http-common";
import DisciplineData from "../types/Discipline";
import SubtaskData from "../types/Subtask";

const getTaskSubtasks = (taskId: number) => {
    return simpleJSON.get<DisciplineData>(`/tasks/${taskId}/subtasks`)
        .then((response: any) => {
            return response.data._embedded.subtasks
                .sort((a: SubtaskData, b: SubtaskData) => a.name > b.name ? 1 : -1)
        });
}

const addSubtask = (taskId: number, newSubtask: SubtaskData) => {
    return simpleJSON.post(`/subtasks`, newSubtask)
        .then((response) => {
            specialURIList.put(`/subtasks/${response.data.id}/task`, `http://localhost:8080/tasks/${taskId}`).then((res) => {
                return response
            })
                .catch(function (error) {
                    console.log('cant connect new subtask to task')
                    console.log(error);
                })
        })
        .catch(function (error) {
            console.log('cant post new subtask')
            console.log(error);
        })
}

const deleteTask = (taskId: number) => {
    return simpleJSON.delete(`/tasks/${taskId}`)
        .then((response: any) => {
                console.log("удалили задачу")
                console.log(response)
            }
        )
}

const TaskService = {
    getTaskSubtasks,
    addSubtask,
    deleteTask
}
export default TaskService