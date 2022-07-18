import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

db.version(1).stores({
    user: 'id++, name, fixedSalary, fixedPercenFromSales, salesPlan, isPercentFloat, ignorePercentFromPlan, percentChangeRules',
    sales: 'id, value',

});



db.user.defineClass({
    id: Number,
    name: String,
    fixedSalary: Number,
    fixedPercenFromSales: Number,
    salesPlan: Number,
    isPercentFloat: Boolean,
    ignorePercentFromPlan: Boolean,
    percentChangeRules: Array
})
