import http from "../http-common";
import DisciplineData from "../types/Discipline";

const getTaskSubtasks = (taskId: number) => {
    return http.get<DisciplineData>(`/tasks/${taskId}/subtasks`)
        .then((response:any)=>{return response.data._embedded.subtasks});
}

const TaskService = {
    getTaskSubtasks
}
export default TaskService