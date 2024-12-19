public with sharing class contactPaginationLwcCtrl { 
    @AuraEnabled
    public static list<Contact> fetchContacts(){        
        list<Contact> lstContact = new list<Contact>();
        for(Contact con : [SELECT id,Order_Number__c,name,email,phone,title FROM Contact  ORDER BY  LastModifiedDate  DESC LIMIT 5000]){
            lstContact.add(con);
        } 
        return lstContact;        
    }
    @AuraEnabled(Cacheable = true)
    public static list<Contact> retriveAccs(String strAccName) {
        strAccName = '%' + strAccName + '%';
        list<Contact> lstAccs = [SELECT id,Order_Number__c,name,email,phone,title FROM Contact WHERE Order_Number__c LIKE :strAccName];
        
        if(lstAccs.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        return lstAccs; 
    }
}