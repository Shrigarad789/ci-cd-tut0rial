public class customSearchSobjectLWC {
   @AuraEnabled(cacheable=true)

    // Fetches Account records with specific fields from the database

    public static List<Contact> fetchData() {

        return [SELECT Id, Name FROM Contact];
}
}