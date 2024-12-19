@Istest
public class DeleteAccountNameHandlerTest {
    @isTest
    public static void test(){
        Account ac =new account();
        ac.name='Test';
        ac.Rating='hot';
        insert ac;
         Opportunity opp = new Opportunity(accountid=ac.id,Name='test opp', StageName='stage', Probability = 95, CloseDate=system.today());
    insert opp;
       
    }
        
        
        
        
       

}