public class FutureMethodTocountPatient {
@Future
    Public static void countDoctorHeartOtherPatient(list<Id> docids){
        
       List <Doctor__c> Doclist =[select id,Count_Heart_Patient__c,Count_Other_Patient__c,(select id,Disease__c from Patient__r) from Doctor__c where id in :docids];
        for(Doctor__c dc:Doclist){
            Integer Heart=0, Other=0;
            for(Patient__c pc: dc.Patient__r){
                if(pc.Disease__c =='Heart'){
                    Heart++;
                }else if(pc.Disease__c =='Other'){
                    Other++;      
                }
              }
            dc.Count_Heart_Patient__c=Heart;
                dc.Count_Other_Patient__c=Other;
        }
        if(!Doclist.isEmpty()){
            update Doclist;
            
        }

    }
}