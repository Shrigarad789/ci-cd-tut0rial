public class BatchOfContactsCteatedOnSameDay implements Database.Batchable<sObject>, Schedulable  {
public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([SELECT Id, Name, CreatedDate FROM Contact WHERE CreatedDate =TODAY]);
        
    }
    public void execute(Database.BatchableContext bc, List<Contact> records){
        List<Contact> UpdateList=new List<Contact>();
        for(Contact con : records) {   
            UpdateList.add(con);
        }    
        Database.update(UpdateList, false);
        system.debug('UpdateList'+UpdateList);

    }
    public void finish(Database.BatchableContext bc){
    } 
     public void execute(SchedulableContext sc) {
        //invoke the batch class
        BatchOfContactsCteatedOnSameDay batch = new BatchOfContactsCteatedOnSameDay();
        Database.executeBatch(batch);
    }

}