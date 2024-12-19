public class LWCfunctionOnService {
    @AuraEnabled (cacheable=true) 
    Public static List<Service__c> servicelistdisplay(string searchService ){
        
        string searchkey ='%'+searchService+'%';
        List<Service__c> serlist = new  List<Service__c>();
        
        serlist =[select id,Name,Customer_Name__c from Service__c where Name LIKE : searchkey];
        
        return serlist; 
        
    }
    @AuraEnabled (cacheable=true) 
    Public static List<Service__c> showServicelist(){
        List<Service__c> serlist = new  List<Service__c>();
        return [select id,Name,Customer_Name__c,Phone_number__c from Service__c where Name!=null limit 5];
        
    }
    
    
}