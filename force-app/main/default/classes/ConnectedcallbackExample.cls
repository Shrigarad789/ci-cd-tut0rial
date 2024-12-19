public class ConnectedcallbackExample {
    @AuraEnabled
    public static List<Account>  getAccountList(){
        list<account> acclist=[SELECT Id, Name,Phone FROM Account];
        return acclist ;
    }
    
}