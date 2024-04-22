import {v1} from "uuid";
import {TodolistType} from "../App";
import {todolistsReducer} from "./todolists-reducer";


test('correct todolist should be removed', () => {
    let todolistID1 = v1()
    let todolistID2 = v1()

    // 1. Стартовый state
    const startState: TodolistType[] = [
        { id: todolistID1, title: 'What to learn', filter: 'all' },
        { id: todolistID2, title: 'What to buy', filter: 'all' },
    ]

    // 2. Действие
    const action = {
        type: 'REMOVE-TODOLIST',
        payload: {
            id: todolistID1,
        },
    }
    const endState = todolistsReducer(startState, action)

    // 3. Проверяем, что наши действия (изменения state) соответствуют ожиданию
    // в массиве останется один тудулист
    expect(endState.length).toBe(1)
    // удалится нужный тудулист, а не любой
    expect(endState[0].id).toBe(todolistID2)
})


test('correct todolist should be added', () => {
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TodolistType[] = [
        { id: todolistID1, title: 'What to learn', filter: 'all' },
        { id: todolistID2, title: 'What to buy', filter: 'all' },
    ]

    const action = {
        type: 'ADD-TODOLIST',
        payload: {
            title: 'New Todolist',
        },
    }
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(action.payload.title)
})

test('correct todolist should change its name', () => {
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TodolistType[] = [
        { id: todolistID1, title: 'What to learn', filter: 'all' },
        { id: todolistID2, title: 'What to buy', filter: 'all' },
    ]

    const action = {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            id: todolistID2,
            title: 'New Todolist',
        },
    }
    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(action.payload.title)
})

test('correct filter of todolist should be changed', () => {
    let todolistID1 = v1()
    let todolistID2 = v1()

    const startState: TodolistType[] = [
        { id: todolistID1, title: 'What to learn', filter: 'all' },
        { id: todolistID2, title: 'What to buy', filter: 'all' },
    ]

    const action = {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            id: todolistID2,
            filter: 'completed',
        },
    }
    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(action.payload.filter)
})