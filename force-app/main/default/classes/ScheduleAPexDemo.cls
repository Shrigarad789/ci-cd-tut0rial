global class ScheduleAPexDemo implements Database.Batchable<sObject> , Schedulable{
    public Database.QueryLocator start(Database.BatchableContext bc) {
        
        return Database.getQueryLocator([SELECT Id,name,Phone_number__c  FROM Service__c]);
        
    }
    public void execute(Database.BatchableContext bc, List<Service__c> records){
        List<Service__c> UpdateSerList=new List<Service__c>();
        for(Service__c ser : records) {  
            if(ser.Phone_number__c ==null){
                ser.Phone_number__c='7620034960';             
            }
            UpdateSerList.add(ser);
        }    
        update  UpdateSerList;
    }   
    public void finish(Database.BatchableContext bc){
        List<string> maillist =new  List<string>();
        maillist.add('shrikantg.sfdc@gmail.com');
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(maillist);
        mail.setSubject('Mail sending batch class');
        mail.setPlainTextBody('Your record has been updated');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
        
    } 
      global void execute(SchedulableContext sc) {
        //invoke the batch class
        ScheduleAPexDemo batch = new ScheduleAPexDemo();
        Database.executeBatch(batch);
    }
    
}