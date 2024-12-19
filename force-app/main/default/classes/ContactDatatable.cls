public class ContactDatatable {
     @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        return [SELECT Id, FirstName, LastName, Title, Phone, Email FROM Contact LIMIT 10];
    }
@AuraEnabled (cacheable=true) 
    Public static List<Contact> servicelistdisplay(string searchService ){
        
        string searchkey ='%'+searchService+'%';
        List<Contact> serlist = new  List<Contact>();
        
        serlist =[select id,Name,FirstName,LastName,Title,Phone,Email from Contact where Name LIKE : searchkey];
        
        return serlist; 
        
    }

}