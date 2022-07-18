import { separateArray } from '../helpers/'
import { db } from '../dexieDb/'
import { toRaw } from 'vue'

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

export const getDataById = async ({target, id}) => {
    return await db[target].filter(item => item.id === id)
}

export const getDataByDb = async ({target}) => {
    return await db[target].toArray()
}

export const saveData = async ({target, payload}) => {
    return await localStorage.setItem(target, JSON.stringify(payload))
}

export const testPut = async ({target, payload}) => {
    const has = await getDataById({
        target: target,
        id: payload.id
    })
    let testPayload = {};
    Object.keys(payload).forEach(key => {
        testPayload[key] = toRaw(payload[key])
        // if(Array.isArray(payload[key])){
        //     console.log(toRaw(payload[key]));
            
        // }
    })
    console.log(testPayload);
    if(has.length > 0){
        await db[target].put(testPayload)
        return
    }
    await db[target].add(testPayload)
}

