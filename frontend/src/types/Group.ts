import DisciplineData from "./Discipline";

export default interface GroupData{
    id: number
    name: string
    description: string
    canmodify: boolean
    disciplines?: DisciplineData[]
}