public class UpdatePhoneOnServiceHandler {
    Public static void UpdatePhoneOnservive(List<case> NewCaseList,Map<Id,case> oldmap){
        Map<Id,Case> mapOfCaseParent =new Map<Id,Case>();
        for(case c :NewCaseList){
            if(oldmap!=null && c.Phone_number__c !=oldmap.get(c.id).Phone_number__c){
                mapOfCaseParent.put(c.id,c);
            }
        }
        List<Service__c> ServiceListUpdate =new List<Service__c>();
        for(Service__c Ser :[select id,Case__c,Phone__c from Service__c where Case__c in:mapOfCaseParent.keySet()]){
            if(mapOfCaseParent.containsKey(Ser.Case__c)){
               Ser.Phone__c =mapOfCaseParent.get(Ser.Case__c).Phone_number__c;
                ServiceListUpdate.add(Ser);
                
            }
            
        }
       Update ServiceListUpdate;
    }
    
    
}