public class CraeteServiceRecord {
    @AuraEnabled
    public static list<Service__c> createRecord(String serviceNmae ,string customerNmae){
        
        list<Service__c> serlist =new list<Service__c>();
        if(serviceNmae !=NULL){
        Service__c obj =new Service__c();
        obj.Name=serviceNmae;
        obj.Customer_Name__c=customerNmae;
        serlist.add(obj);
            system.debug('serlist'+serlist);
    }
        if(!serlist.isEmpty()){
        Insert serlist;
            return serlist;
    }

    return NULL;
    }
}