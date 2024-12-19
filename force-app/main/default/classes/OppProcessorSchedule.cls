public class OppProcessorSchedule implements Database.Batchable<sobject>, Database.stateful,Schedulable{
    public integer recordCount=0;
    
    public Database.QueryLocator start(Database.BatchableContext bc){
        return Database.getQueryLocator([select id from opportunity]);
    }
    public void execute(Database.BatchableContext bc,List<opportunity> opplist){
        for(opportunity op: opplist){
            op.Leadsource='web';
        }
        Update opplist;
        recordCount = recordCount+opplist.size();
    }
    public void Finish(Database.BatchableContext bc){
        system.debug('Total record Processed'+recordCount);
        
    }
    public void execute(SchedulableContext sc) {
        //invoke the batch class
        OppProcessorSchedule batch = new OppProcessorSchedule();
        Database.executeBatch(batch);
    }
}