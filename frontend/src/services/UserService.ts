import {simpleJSON, specialURIList} from "../http-common";
import UserData from "../types/User";
import DisciplineData from "../types/Discipline";
import GroupData from "../types/Group";

const getAll = () => {
    return simpleJSON.get<Array<UserData>>("/users");
};

const get = (id: any) => {
    return simpleJSON.get<UserData>(`/users/${id}`);
};

const create = (data: UserData) => {
    return simpleJSON.post<UserData>("/users", data);
};

const addDiscipline = (userName: string, newDiscipline: DisciplineData) => {

    let postedNewDiscipline = simpleJSON.post(`/disciplines`, newDiscipline)
        .then((response) => {
            return response
        })
    return postedNewDiscipline.then((newDiscipline) => {
        return simpleJSON.post(`/disciplineUsers`,
            {
                id: {
                    username: userName,
                    disciplineId: newDiscipline.data.id
                }
            })
    })
}

const getUserDisciplines = (username: string) => {
    return simpleJSON.get<DisciplineData>(`/users/${username}/disciplineSet`)
        .then((response: any) => {
                return response.data._embedded.disciplines
                    .sort((a: DisciplineData, b: DisciplineData) => a.name > b.name ? 1 : -1)
            }
        );
}

const getUserGroups = (username: string) => {
    return simpleJSON.get<GroupData>(`/users/${username}/groups`)
        .then((response: any) => {
                return response.data._embedded.groupsUsers;
            }
        );
}
const UserService = {
    getAll,
    get,
    create,
    getUserDisciplines,
    getUserGroups,
    addDiscipline
}
export default UserService