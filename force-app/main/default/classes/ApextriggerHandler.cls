public class ApextriggerHandler {
    @Auraenabled
    Public static list<Account> getaccounts(){
        List<account> acclist = new List<account>();
        acclist = [select id,Name from account Limit 10];
        return acclist;
    }
    
}