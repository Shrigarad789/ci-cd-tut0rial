@Istest
public class ScheduleAPexDemoTest {
    @Istest
    public static void test1(){
        Service__c sr = new Service__c();
        sr.Phone_number__c='578558988';
        insert sr;
        sr.Phone_number__c='';
        update sr;
        
        system.assertEquals('',  sr.Phone_number__c);
         Test.startTest();
       Id jobId = Database.executeBatch(new ScheduleAPexDemo(),200);
        
        Test.stopTest();
    }
     @Istest
    public static void test2(){
        Service__c sr = new Service__c();
        sr.Phone_number__c='';
        insert sr;
        sr.Phone_number__c='578558988';
        update sr;
          Test.startTest();
       Id jobId = Database.executeBatch(new ScheduleAPexDemo(),200);
        
        Test.stopTest();
    }  
}