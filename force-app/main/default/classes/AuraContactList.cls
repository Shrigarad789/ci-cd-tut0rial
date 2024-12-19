public class AuraContactList {
     @AuraEnabled
    public static List<Contact> getContactList() {
        List<contact> contactlist =[Select Id, FirstName,LastName, Email, Phone,Account.Name From Contact limit 10];
        return contactlist;
    }

}