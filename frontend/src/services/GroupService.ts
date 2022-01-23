import {simpleJSON, specialURIList} from "../http-common";
import DisciplineData from "../types/Discipline";

const addDiscipline = (groupId: number, newDiscipline: DisciplineData) => {

    let postedNewDiscipline = simpleJSON.post(`/disciplines`, newDiscipline)
        .then((response) => {
            return response
        })
    return postedNewDiscipline.then((newDiscipline) => {
        return simpleJSON.post(`/disciplinesGroups`,
            {
                id: {
                    groupId: groupId,
                    disciplineId: newDiscipline.data.id
                }
            })
    })
}

const getGroupDisciplines = (groupId: number) => {
    return simpleJSON.get<DisciplineData>(`/groups/${groupId}/disciplineSet`)
        .then((response: any) => {
                return response.data._embedded.disciplines
                    .sort((a: DisciplineData, b: DisciplineData) => a.name > b.name ? 1 : -1)
            }
        );
}

const GroupService = {
    getGroupDisciplines,
    addDiscipline
}
export default GroupService