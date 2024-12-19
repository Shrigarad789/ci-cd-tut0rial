public class UpdatePhoneOnOppoHandler {
    public static void updateOppo(List<Account> newlist ,Map<id,account> oldMap){
        Map<id,account> accountIdsToaccMap =new Map<id,account>();
        for(Account acc:newlist){
            if(oldMap!= null && acc.Phone != oldMap.get(acc.id).phone){
                accountIdsToaccMap .put(acc.id, acc);
            }
        }
        List<Opportunity> opplistUpdate =new List<Opportunity>();
        for(Opportunity opp:[select id,Description,AccountId from Opportunity where AccountId in:accountIdsToaccMap.keySet()]){
            if(accountIdsToaccMap.containskey(opp.AccountId)){
                opp.Description = accountIdsToaccMap.get(opp.AccountId).phone;
                opplistUpdate.add(opp);
            }
        }
        if(!opplistUpdate.isEmpty()){
            update opplistUpdate;
            
        }
    }
}