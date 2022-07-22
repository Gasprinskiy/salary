import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

db.version(1).stores({
    sales: 'id++, no, value',
    income: 'id++, no, value',
    expense: 'id++, no, value',
    archive: 'id++,  no, name, sales, income, expense, totalSalary, totalSales'
});



// db.user.defineClass({
//     id: Number,
//     name: String,
//     fixedSalary: Number,
//     fixedPercenFromSales: Number,
//     salesPlan: Number,
//     isPercentFloat: Boolean,
//     ignorePercentFromPlan: Boolean,
//     percentChangeRules: Array
// })
