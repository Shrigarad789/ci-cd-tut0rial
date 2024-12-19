public class Powerbidashbord {
  @AuraEnabled(cacheable=true) 
    public static PowerBiDashboardConfiguration__c getCustomSettings(){
        PowerBiDashboardConfiguration__c var = PowerBiDashboardConfiguration__c.getInstance(userinfo.getUserId());
        //SYSTEM.debug('var'+var);
        return var;
    }
}