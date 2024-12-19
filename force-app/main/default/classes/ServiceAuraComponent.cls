public class ServiceAuraComponent {
@AuraEnabled
    public static List<Service__c> getServiceList() {
        List<Service__c> ServiceList=[Select Name,Customer_Name__c from Service__c limit 10];
        return ServiceList;
    }
}