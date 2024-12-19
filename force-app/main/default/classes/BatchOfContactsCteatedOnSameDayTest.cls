@IsTest
public class BatchOfContactsCteatedOnSameDayTest {
    @IsTest
    public static void  WSContactProcesTest2(){
        Account accountObj = new Account();
        accountObj.Name = 'Test Account';
        
        Insert accountObj;
        
        List<Contact> testContacts = new List<Contact>();
        Contact contactObj = new Contact();
        contactObj.LastName='TestContact';
        contactObj.AccountId = accountObj.Id;
        contactObj.Email='TestContact@example.com';
        contactObj.Phone='9876543210';
        insert   contactObj; 
        
        
        Test.startTest();
         BatchOfContactsCteatedOnSameDay oCouponBatch = new BatchOfContactsCteatedOnSameDay();
        database.executeBatch(oCouponBatch);
        String jobId = System.schedule('Test BatchToUpdateEMEAContacts', '0 59 16 * * ?', new BatchOfContactsCteatedOnSameDay());
        

        Test.stopTest();
    }
}