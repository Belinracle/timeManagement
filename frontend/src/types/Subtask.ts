export default interface SubtaskData {
    id?: number,
    name: string,
    description?: any
    isDone: boolean
    deadline?: Date | Date[]
}