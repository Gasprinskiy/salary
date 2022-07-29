import { separateArray } from '../helpers/'
import { db } from '../dexieDb/'


// export const getData = async ({target}) => {
//     const response = await JSON.parse(localStorage.getItem(target))
//     if(response) return response
//     else return []
// }

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
export const getData = async ({target, fromLocalStore = false}) => {
    if(fromLocalStore){
        return await JSON.parse(localStorage.getItem(target))
    }
    return await db[target].toArray()
}

export const getDataById = async ({target, id}) => {
    return await db[target].filter(item => item.id === id).toArray()
}

export const getReverceData = async ({target, limit, offset = 0}) => {
    return await db[target].reverse().toArray()
    
}

export const getReverceWithLimitData = async ({target, limit, offset = 0}) => {
    return await db[target]
        .reverse()
        .limit(limit)
        .offset(offset)
        .toArray()
    
}

// export const saveData = async ({target, payload}) => {
//     return await localStorage.setItem(target, JSON.stringify(payload))
// }

export const saveData = async ({target, payload, toLocalStore = false}) => {
    if(toLocalStore){
        return localStorage.setItem(target, JSON.stringify(payload))
    } else {
        const has = await getDataById({
            target: target,
            id: payload.id
        })
        if(has.length > 0){
            return await db[target].put(payload)
        }
        return await db[target].add(payload)  
    }
    
}

export const removeData = async ({target, id}) => {
    return await db[target].delete(id)
}

export const getDbTotalCountWhereTargetEqualsOptions = async ({target, options: {where, equals}}) => {
    return await db[target].where(where).equalsIgnoreCase(equals).count();
}

export const getDbDataWhereOptionIsUqual = async ({target, where}) => {
    return await db[target].get(where);
}

export const getDbTotalCount = async ({target}) => {
    return await db[target].count()
}

export const dbHasData = ({target}) => {
    return localStorage.getItem(target) !== null
}


