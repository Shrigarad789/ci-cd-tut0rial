public class PreventDeleteOppHandler {
    Public static void deleteRelOpp1(List<Opportunity> opplist){
        set<id> setids =new set<id>();
    
        for(Opportunity op : opplist){
            if(op.AccountId!=null){
               setids.add(op.AccountId);   
            }
        }
        list<account> acclist=[select id,(select id from Opportunities) from account where id in :setids];
        
        for(account acc:acclist){
            acc.adderror('can not delete contact bcoz asso to account');
}
}
}