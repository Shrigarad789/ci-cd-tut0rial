public class CreateServiceOnCaseHandler {
    Public static void caseServicedemo(List<Case> caselist){
        List<case> acclst = new List<case>();
               for(case acc : caselist){        
                acclst.add(acc);                
            } 
       if(acclst.size() > 0){
            caseServicedemo1(json.serialize(acclst));
        }  
    }
    @future 
    Public static void caseServicedemo1(String sobjRecJsonStrNewList){
           List<case> newList1 = (List<case>)JSON.deserialize(sobjRecJsonStrNewList,List<case>.class);
          Map<id,case> caseIdsToaccMap =new Map<id,case>();
        for(case c:newList1){
            caseIdsToaccMap.put(c.id,c);
        }
        List<Service__c> serlistUpdate =new List<Service__c>();
        for(Service__c ser:[select id,Case__c,Duns_In_Service__c 
                            from Service__c where Case__c in:caseIdsToaccMap.Keyset()]){
            if(caseIdsToaccMap.containskey(ser.Case__c)){
                ser.Duns_In_Service__c=caseIdsToaccMap.get(ser.Case__c).Duns_In_case__c;
                
                serlistUpdate.add(ser); 
            }
            if(!serlistUpdate.isEmpty()){
                update serlistUpdate; } } }}