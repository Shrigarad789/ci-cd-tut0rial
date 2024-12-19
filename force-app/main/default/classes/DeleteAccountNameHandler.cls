public class DeleteAccountNameHandler {
    Public static void deleteRelOpp(Map<Id,account> mapIdaccount){
        List<opportunity> opplist = new List<opportunity>();
        for(opportunity opp:[select id from opportunity where accountid in : mapIdaccount.keyset()]){
            opplist.add(opp);
        }
        delete opplist;
    }
}