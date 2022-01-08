import SubtaskData from "./Subtask";

export default interface TaskData {
    id: number,
    name: string,
    description: any
    subtasks?:Array<SubtaskData>
}