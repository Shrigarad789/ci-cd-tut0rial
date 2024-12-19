public class EmployeeTriggerHandler {     
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployeeList(){
        return [select Id,Empo_Name__c,Email__c,Phone__c, E_Adhar_Number__c,State__c,Country__c from Employee__c LIMIT 10];
    }
}