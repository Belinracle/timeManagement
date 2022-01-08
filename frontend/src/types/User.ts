import DisciplineData from "./Discipline";

export default interface UserData {
    id: string,
    password: string,
    disciplineSet: DisciplineData[]
}