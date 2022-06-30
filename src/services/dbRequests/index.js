import { separateArray } from '../helpers/'

export const dbHasData = async ({target}) => {
    return localStorage.getItem(target) !== null
}

export const getData = async ({target}) => {
    const response = await JSON.parse(localStorage.getItem(target))
    if(response) return response
    else return []
}

export const getUnparcedData = async ({target}) => {
    const response = await localStorage.getItem(target)
    return response
}

export const getDataWithLimit = async ({target, limit, page}) => {
    const data = await JSON.parse(localStorage.getItem(target))
    response = separateArray({
        sourceArray: data,
        options: {
            limit: limit,
            page: page
        }
    })
    return response
}

export const saveData = async ({target, payload}) => {
    return await localStorage.setItem(target, JSON.stringify(payload))
}
