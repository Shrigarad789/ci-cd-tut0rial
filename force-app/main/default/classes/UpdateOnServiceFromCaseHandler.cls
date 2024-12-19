public class UpdateOnServiceFromCaseHandler {
    Public static void updateOnServiceFromCase(List<case> caselist){
        Map<id,case> caseIdsToaccMap =new Map<id,case>();
        for(case c:caselist){
           
            caseIdsToaccMap.put(c.id,c);
        }
        List<Service__c> serlistUpdate =new List<Service__c>();
        for(Service__c ser:[select id,Case__c,Duns_In_Service__c from Service__c where Case__c in:caseIdsToaccMap.Keyset()]){
            if(caseIdsToaccMap.containskey(ser.Case__c)){
                ser.Duns_In_Service__c=caseIdsToaccMap.get(ser.Case__c).Duns_In_case__c;
                
                serlistUpdate.add(ser);
                
            }
            if(!serlistUpdate.isEmpty()){
                update serlistUpdate;
            }
        }
        
    }
    
}