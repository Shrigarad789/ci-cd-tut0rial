global class MyBatchClass implements Database.Batchable<sObject>,Schedulable {

    global Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator('SELECT Id, Name FROM Account');
    }

    global void execute(Database.BatchableContext bc, List<Account> scope) {
        for(Account acc : scope) {
            acc.Name = 'Test' + acc.Name;
        }
        update scope;
    }

    global void finish(Database.BatchableContext bc){
        System.debug('Batch job completed.');
    }
     global void execute(SchedulableContext sc) {
        MyBatchClass batchJob = new MyBatchClass();
        Database.executeBatch(batchJob);
    }
}