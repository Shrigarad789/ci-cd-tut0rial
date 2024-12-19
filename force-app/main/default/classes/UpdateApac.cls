public class UpdateApac {
    @Future
    Public static void countDoctorHeartOtherPatient(list<Id> docids){
         Areazone__c customSetting =Areazone__c.getInstance();

    if (customSetting != null && customSetting.Subregion__c != null) {
        system.debug('customSetting'+customSetting);
       List<Account> accountsToUpdate = [SELECT Id, APAC_subregion__c FROM Account WHERE APAC_subregion__c = :customSetting.Subregion__c];
 system.debug('accountsToUpdate'+accountsToUpdate);
        // Iterate through the accounts being inserted or updated
        for (Account acc : accountsToUpdate) {
           
                acc.APAC_subregion__c = 'China';
            }
        // Update the accounts
            if (!accountsToUpdate.isEmpty()) {
                update accountsToUpdate;
            }
   
}
    }
}