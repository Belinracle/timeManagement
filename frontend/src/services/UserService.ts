import http from "../http-common";
import UserData from "../types/User";
import DisciplineData from "../types/Discipline";

const getAll = () => {
    return http.get<Array<UserData>>("/users");
};

const get = (id: any) => {
    return http.get<UserData>(`/users/${id}`);
};

const create = (data: UserData) => {
    return http.post<UserData>("/users", data);
};

const getUserDisciplines = (username: string) => {
    return http.get<DisciplineData>(`/users/${username}/disciplineSet`)
        .then((response: any)=>{return response.data._embedded.disciplines});
}

const UserService = {
    getAll,
    get,
    create,
    getUserDisciplines
}
export default UserService