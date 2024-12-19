public class UpdatePhoneOncontactHandler {
    public static void insertContact( List<Account> Acclist){ 
        list<contact> conlist =new list<contact>();
        for(account acc :Acclist){
            contact con =new contact();
            con.AccountId=acc.id;
            con.LastName =acc.Name;
            conlist.add(con);
        }
        insert conlist;
        system.debug(conlist);
    }
    Public static void updatePhoneFromAccountToContact( map<id,Account> accountMap){ 
        List<contact> contactlist =[select id ,accountid,phone from contact where accountid in:accountMap.keyset()];
        if(contactlist != null && contactlist.size() > 0){
            for(contact con :contactlist){
                con.Phone=accountMap.get(con.AccountId).phone;  
            }
            update contactlist;
            system.debug('contactlist'+contactlist);
        }
    }
}