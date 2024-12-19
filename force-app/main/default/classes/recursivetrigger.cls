public class recursivetrigger {
    public static void createaccount(List<account> newlist){
        
        List<account> acclist =new List<account>();
             for(Account acc:newlist){
            
            account a =new account();
            a.Name='Shrikant';
            a.ParentId=acc.id;
            acclist.add(a);
        }
    insert acclist;
}
}