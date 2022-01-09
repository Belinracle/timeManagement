import TaskData from "./Task";

export default interface DisciplineData {
    id?: number,
    name: string,
    description: any
    tasks?:Array<TaskData>
}