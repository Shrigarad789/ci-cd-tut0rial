public class OpportunityController {
@AuraEnabled( cacheable = true )
    public static List< Opportunity> fetchOpportunityList() {
     
        return [
            SELECT Id, Name,StageName
            FROM Opportunity
            LIMIT 10
        ];
         
    }
}