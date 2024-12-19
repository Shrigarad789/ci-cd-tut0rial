@istest
public class PatientclassTest {
    @istest
    public static void istest(){
        
        Doctor__c dc =new Doctor__c();
        dc.Name='Abhinav';
        Insert dc;
        
        Patient__c a_Rec = new Patient__c();
        
        a_Rec.Name = 'shivansh';
        a_Rec.Email__c = 'shivansh@gmail.com';
        a_Rec.Age__c=3;
        a_Rec.Phone__c='6666666666';
        a_Rec.Gender__c='Male';
        a_Rec.Doctor__c=dc.id;
        insert a_Rec;
        Patientclass.allAccount();
        Patientclass.m_Insert_A_Contact_Record('shivansh','shivansh@gmail.com',3,'6666666666','Male',dc.id);
    }
       
}