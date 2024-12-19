public class Patientclass2 {
    @AuraEnabled (cacheable=true)
    Public static List<Patient__c> fetchpatient( ){ 
        List<Patient__c> Patlists = new List<Patient__c>(); 
        Patlists =[SELECT Id, Name FROM Patient__c where Name !=null limit 50]; 
   return Patlists ;
    }
}