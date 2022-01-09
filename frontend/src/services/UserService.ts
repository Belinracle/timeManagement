import {simpleJSON} from "../http-common";
import UserData from "../types/User";
import DisciplineData from "../types/Discipline";

const getAll = () => {
    return simpleJSON.get<Array<UserData>>("/users");
};

const get = (id: any) => {
    return simpleJSON.get<UserData>(`/users/${id}`);
};

const create = (data: UserData) => {
    return simpleJSON.post<UserData>("/users", data);
};

const getUserDisciplines = (username: string) => {
    return simpleJSON.get<DisciplineData>(`/users/${username}/disciplineSet`)
        .then((response: any)=>{
            return response.data._embedded.disciplines
                .sort((a:DisciplineData, b:DisciplineData) => a.name > b.name ? 1 : -1)}
        );
}

const UserService = {
    getAll,
    get,
    create,
    getUserDisciplines
}
export default UserService