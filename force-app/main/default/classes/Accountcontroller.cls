public class Accountcontroller {
    @AuraEnabled
  public static Account createAccount(Account acc){
    try{
      insert acc;
 }
   catch(Exception e){
     System.System.debug('unable to insert the record due to'+e.getMessage());
    }
    return acc;
 }
  @AuraEnabled
  public static void createOppty(Opportunity opp,String accId,String opptyStageName){
    System.debug('***AccountId***'+accId);
   try{
      opp.AccountId=accId;
      opp.closeDate=System.today();
      opp.StageName=opptyStageName;
      insert opp;
   }
    catch(Exception e){
     System.System.debug('unable to insert the record due to'+e.getMessage());
    }
  }
}