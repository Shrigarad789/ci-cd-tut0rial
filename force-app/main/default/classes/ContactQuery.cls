public class ContactQuery {
 @AuraEnabled(cacheable=true)
    public static sobjectWrapper fetchSobject(Id RecordId) {
        sobjectWrapper osobjectWrapper = new sobjectWrapper();
        osobjectWrapper.lstContact = [SELECT Id,Name From Contact 
                                      WHERE AccountId =: RecordId];
        osobjectWrapper.lstCase = [SELECT Id,CaseNumber From Case 
                                   WHERE AccountId =: RecordId];

 return osobjectWrapper;
                                }


public class sobjectWrapper {
    @AuraEnabled public List<Contact> lstContact{get;set;}
    @AuraEnabled public List<Case> lstCase{get;set;}
}

}