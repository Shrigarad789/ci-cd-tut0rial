Global class BatchApexsyntax implements Database.Batchable<sObject> {
    Global Database.QueryLocator start(Database.BatchableContext Bc){
        string query='select id from contact';
        return Database.getqueryLocator(query);
        
    }
    Global void execute(Database.BatchableContext Bc,list<Account> acclist){
        
    }
    Global void finish(Database.BatchableContext Bc){
        
    }

}