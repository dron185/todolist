import {v1} from "uuid";
import {FilterValuesType, TodolistType} from "../App";
import {
    addTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./todolists-reducer";

let todolistID1: string;
let todolistID2: string;
let startState: TodolistType[];

beforeEach(() => {
    todolistID1 = v1();
    todolistID2 = v1();
    startState = [
        { id: todolistID1, title: 'What to learn', filter: 'all' },
        { id: todolistID2, title: 'What to buy', filter: 'all' },
    ]
})

test('correct todolist should be removed', () => {

    // 2. Действие
    const endState = todolistsReducer(startState, removeTodolistAC(todolistID1))

    // 3. Проверяем, что наши действия (изменения state) соответствуют ожиданию
    // в массиве останется один тудулист
    expect(endState.length).toBe(1)
    // удалится нужный тудулист, а не любой
    expect(endState[0].id).toBe(todolistID2)
})

test('correct todolist should be added', () => {

    let newTitle = 'New Todolist'
    const endState = todolistsReducer(startState, addTodolistAC(newTitle))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(newTitle)
})

test('correct todolist should change its name', () => {

    let newTitle = 'New Todolist'

    const action = ChangeTodolistTitleAC(todolistID2, newTitle)

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTitle)
})

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'completed';

    // const action = {
    //     type: 'CHANGE-TODOLIST-FILTER',
    //     payload: {
    //         id: todolistID2,
    //         filter: 'completed',
    //     },
    // } as const

    const action = ChangeTodolistFilterAC(todolistID2, newFilter)

    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

