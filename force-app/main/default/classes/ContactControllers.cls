public class ContactControllers {
 
    @AuraEnabled
    public static Contact createContact(Contact contact){
        upsert contact;
        return contact;
    }
}