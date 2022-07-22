const commonDate = new Date();

export const greetByTime = () => {
    const hour = commonDate.getHours();
    const greetIndex = getGreetIndex(hour)
    const greetsList = [
        'доброе утро',
        'добрый день',
        'добрый вечер',
        'доброй ночи'
    ]
    return greetsList[greetIndex] 
}

export const toUpperCaseFirstLetter = (str) => {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}

export const separateArray = ({sourceArray, options, reverse = false}) => {
    const source = sourceArray.slice(0)
    const array = reverse ? source.reverse() : source
    return array.slice(0 , options.limit * options.page)
}

export const formatNumber = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const lastMonth = () => {
    const lastMonthIndex = commonDate.getMonth() - 1;
    const monthArray = [
        'январь', 'февраль', 'март', 
        'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь',
        'октябрь', 'ноябрь', 'декабрь',
    ]
    return monthArray[lastMonthIndex]
}

export const isArraysEqual = (a1, a2) => {
    return a1.filter(i=>!a2.includes(i))
    .concat(a2.filter(i=>!a1.includes(i)))
}

export const makeUniq = (array) => {
    const uniqSet = new Set(array);
    return [...uniqSet];
}

export const makeItemTitle = (itemName, itemNumber) => {
    if(itemNumber > 1){
        return `${itemName}[${itemNumber}]`
    }
    return itemName
}

const getGreetIndex = (hour) => {
    if(hour >= 6 && hour <= 11){ return 0 } 
    else if(hour > 11 && hour <= 16){ return 1} 
    else if(hour > 16 && hour <= 22){ return 2} 
    else if(hour > 22 || hour < 6){ return 3 } 
}


