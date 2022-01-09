import {simpleJSON, specialURIList} from "../http-common";
import DisciplineData from "../types/Discipline";
import TaskData from "../types/Task";
import SubtaskData from "../types/Subtask";

const getDisciplineTasks = (disciplineId: number | undefined) => {
    return simpleJSON.get<DisciplineData>(`/disciplines/${disciplineId}/tasks`)
        .then((response: any) => {
            return response.data._embedded.tasks
                .sort((a: TaskData, b: TaskData) => a.name > b.name ? 1 : -1)
        });
}

const addTask = (disciplineId: number, newTask: TaskData) => {
    return simpleJSON.post(`/tasks`, newTask)
        .then((response) => {
            specialURIList.put(`/tasks/${response.data.id}/discipline`, `http://localhost:8080/disciplines/${disciplineId}`).then((res) => {
                return response
            })
                .catch(function (error) {
                    console.log('cant connect new task to discipline')
                    console.log(error);
                })
        })
        .catch(function (error) {
            console.log('cant post new task')
            console.log(error);
        })
}

const deleteDiscipline = (disciplineId: number) => {
    return simpleJSON.delete(`/disciplines/${disciplineId}`)
        .then((response: any) => {
                console.log("удалили дисциплину")
                console.log(response)
            }
        )
}

const updateDiscipline = (disciplineId: number | undefined, newDisciplineState: DisciplineData) => {
    return simpleJSON.put(`/disciplines/${disciplineId}`,newDisciplineState)
}

const DisciplineService = {
    getDisciplineTasks,
    addTask,
    deleteDiscipline,
    updateDiscipline
}
export default DisciplineService