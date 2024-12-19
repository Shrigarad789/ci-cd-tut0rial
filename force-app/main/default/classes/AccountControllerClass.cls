public class AccountControllerClass { 
     @AuraEnabled (cacheable=true) 
    Public static List<Account> fetchAccounts( ){
        
        list<Account > AccountListRecord = new list<Account >();
        
        AccountListRecord =[SELECT Id, Name, Industry, Is_Active__c
                FROM Account where Name !=null limit 10];
        
        return AccountListRecord ; 
        
    }
    
}