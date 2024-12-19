@isTest
public class DeleteAccountNameTest {
    @isTest
    public static void test(){
        Map<Id,account> conIdsvsLeadIds = new Map<Id,account>();
        
        List<Account> acclist =new List<Account>();
        Account ac = new account();
        ac.name='Test';
        ac.Rating='hot';
        acclist.add(ac);
        insert acclist;
        
        conIdsvsLeadIds.put(acclist[0].Id, acclist[0]);
        Opportunity opp = new Opportunity(accountid=acclist[0].id, Name='test opp', StageName='stage', Probability = 95, CloseDate=system.today());
        insert opp;
        

       
        
        DeleteAccountNameHandler.deleteRelOpp(conIdsvsLeadIds);
    }
    @isTest
    public static void test1(){
        
        List<account> acclist=new List<account>();
        List<Opportunity> opplist=new List<Opportunity>();
        
        for(Integer i=1;i<=5;i++){
            Account ac = new account();
        ac.name='Test'+i;
        ac.Rating='hot';
        acclist.add(ac);
        }
        Insert acclist;
        
        for(account a:acclist){
            Opportunity opp = new Opportunity();
            opp.accountid=a.id;
            opp.Name ='test opp';
            opp.StageName='stage'; 
            opp.Probability = 95;
                opp.CloseDate=system.today();
            opplist.add(opp);
            
        }
        delete opplist;
        
    
}
}