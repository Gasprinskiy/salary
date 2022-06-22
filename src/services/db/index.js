import Dexie from 'dexie';

export const db = new Dexie('userDatabase');
db.version(1).stores({
  user: '++id, name, fixedSalary, fixedPercenFromSales, isPercentFloats, percentageChangeWhenPlanCompletedOptions, salesPlan', 
});
