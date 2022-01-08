import http from "../http-common";
import DisciplineData from "../types/Discipline";

const getDisciplineTasks = (disciplineId: number) => {
    return http.get<DisciplineData>(`/disciplines/${disciplineId}/tasks`)
        .then((response: any)=>{return response.data._embedded.tasks});
}

const DisciplineService = {
    getDisciplineTasks
}
export default DisciplineService