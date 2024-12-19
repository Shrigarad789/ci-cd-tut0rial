public class ScinarrioOnAccountHandler {
    public static void myMethod(Map<Id,Account> newAccMap,
                                      Map<Id,Account> oldAccMap){
        Map<Id,Integer> accOppCountMap = new Map<Id,Integer>();
        set<Id> finalSet = new set<Id>();
        finalSet.addAll(newAccMap.keySet());
        if(oldAccMap!= null){
            finalSet.addAll(oldAccMap.KeySet());
        }
         List<AggregateResult> aggr = [select AccountId accId, 
          count(Id) oppCount from Opportunity where AccountId In:
           finalSet group By AccountId];
        for(AggregateResult ag :aggr){
            accOppCountMap.put((Id)ag.get('accId'), 
            (Integer)ag.get('oppCount'));
        }
        Map<Id,Account> newOldAccMap = new Map<Id,Account>();
        newOldAccMap.putAll(newAccMap);
        if(oldAccMap!= null){
            newOldAccMap.putAll(oldAccMap);
        }
        
        for(Account acc : newOldAccMap.values()){
            if(!accOppCountMap.containsKey(acc.Id)){
                //myMethod2();
                accOppCountMap.put(acc.Id, 0);
            }
        }
        myMethod2(accOppCountMap);
    }
    public static void myMethod2( Map<Id,Integer> accOppCountMap){

        List<Opportunity> oppListToInsert  = new List<Opportunity>();
        integer numberOfOpportunitiesToBeCreated ;
        integer numberOfOpportunitiesToBeDeleted ;
        for(Id accountId : accOppCountMap.keySet()) {
           if(accOppCountMap.get(accountId) < 2){
              numberOfOpportunitiesToBeCreated = 
                          2 - accOppCountMap.get(accountId);
              //create opportunities
                for(Integer i=0; i< numberOfOpportunitiesToBeCreated; 
                                                                i++ ){
                    Opportunity opp = new Opportunity();
                    opp.AccountId = accountId;
                    opp.Name = generateRandomString(6);
                    opp.StageName = 'Prospecting';
                    opp.CloseDate = system.today();
                    oppListToInsert.add(opp);
                }
                insert oppListToInsert;
           } else {
              
           numberOfOpportunitiesToBeDeleted = 
                accOppCountMap.get(accountId) - 2;
                //delete opportunities 
          List<Opportunity> oppToDelete = [select Id from Opportunity
         where AccountId =: accountId order By CreatedDate DESC  Limit 
                                   : numberOfOpportunitiesToBeDeleted];
                if(!oppToDelete.isEmpty()){
                    system.debug('I Ma here to delete');
                    delete oppToDelete;
                } 
           }
        }
    }

    public static String generateRandomString(Integer len) {
        final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        String randStr = '';
        while (randStr.length() < len) {
           Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), 
           chars.length());
           randStr += chars.substring(idx, idx+1);
        }
        return randStr; 
    }
}