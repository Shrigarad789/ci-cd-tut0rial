public class OrderDatatable {
   

 @AuraEnabled(cacheable=true)
    public static List<Order__c> getEmployeeList(){
        return [select Id, Name, Order_Number__c, Price__c 
                FROM Order__c  ];
    }
}