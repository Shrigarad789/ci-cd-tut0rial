public class Patientclass {
    /*@AuraEnabled(cacheable=false)
    public static list<Doctor__c> allAccount(){
            list<Doctor__c> accountList =[SELECT Id,Name from Doctor__c]; 
            system.debug('accountList:::'+accountList);
           return accountList;
    }*/
    @AuraEnabled(cacheable=false)
   // Public static Id m_Insert_A_Contact_Record(string Name, String Email,Integer age ,string Phone ,string Gender,string Doctorid){
        Public static Id m_Insert_A_Contact_Record(string Name, String Email,Integer age ,string Phone ,string Gender,string State){
        try{
            List<Patient__c> patlist=new List<Patient__c>();
            Patient__c a_Rec = new Patient__c();
            
            a_Rec.Name = Name;
            a_Rec.Email__c = Email;
            a_Rec.Age__c=age;
            a_Rec.Phone__c=Phone;
            a_Rec.Gender__c=Gender;
            a_Rec.State__c=State;
            
           // a_Rec.Doctor__c=Doctorid;
            patlist.add(a_Rec);
            
            Insert patlist;
            return a_Rec.Id;
        }
        catch(Exception ex){
            System.debug('An Exception: '+ex);
            return null;
        }
    }
}