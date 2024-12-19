global class BatchRunToDeleteDuplicate implements Database.Batchable<sObject>  {
        global Set<String> emailstring;

    global Database.QueryLocator start(Database.BatchableContext BC){

      return Database.getQueryLocator([Select Name from Account where Name != null]);

      }

    global void execute(Database.BatchableContext BC , List<Account> scope){

        Set<String> emailstring = new Set<String>();

      //  Map<String , Book3__c> EmailBookmap = new Map<String , Book3__c>();

        for(Account s : scope){

        // EmailBookmap.put(s.Email__c , s);

            emailstring.add(s.Name);

        }  

       // system.debug(EmailBookmap);

        system.debug(emailstring);

        List<Account> bklst = [Select Name from Account where Name In :emailstring ];

        List<Account> duplicatelist = new List<Account>();

        for(Account bk : Scope){

        for(Account b :bklst){

           // if(emailstring.contains(b.Email__c)){

            if(bk.Name == b.Name){

              duplicatelist.add(b);  

            }

            else{

             emailstring.add(bk.Name);   

            }

        }

        }

       // system.debug(EmailBookmap);

        system.debug(duplicatelist);

      delete duplicatelist;

    }

    global void finish(Database.BatchableContext BC){

    }
}