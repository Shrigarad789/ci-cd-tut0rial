public class InvocableActionDemo {
    
    @InvocableMethod(label='Get opp with least amount')
    public static List<opportunity> getOppDetail(List<string> args){
        string accId=args[0];
        List<opportunity> lstopportunity =[select id,name,amount from opportunity where accountid=:accId] ;
        return lstopportunity;
    }
}