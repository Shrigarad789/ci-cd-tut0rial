public class ContainsDemoHandler {
    public static void test1(List<Service__c> newWorkOrder){
         Set<Id> relatedWOID = new Set<Id>();
        for(Service__c i:newWorkOrder){
                            relatedWOID.add(i.id);
            system.debug(' relatedWOID'+ relatedWOID);
            }
         Map<Id, Service__c> resultMap=new Map<Id, Service__c>([SELECT id,Customer_Name__c  FROM Service__c 
                                WHERE id IN:relatedWOID]);  
         system.debug('resultMap'+ resultMap);
        for(Service__c i:newWorkOrder) {
                if(resultMap.keyset().contains(i.Id)) {
                    system.debug('resultMap.keyset().contains(i.Id)'+resultMap.keyset().contains(i.Id));
                   Service__c wo = resultMap.get(i.Id);
                    system.debug('resultMap.get(i.Id)'+resultMap.get(i.Id));
                    i.Update_field_cust__c = wo.Customer_Name__c;
                            }                
        }
    }
}