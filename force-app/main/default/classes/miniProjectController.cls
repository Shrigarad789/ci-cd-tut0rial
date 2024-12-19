public class miniProjectController {
     @AuraEnabled(cacheable=true)
    public static list<contact> getEventAttendee(string eventId){
        
        list<contact> availablelist  = new  list<contact>();
       
            availablelist  =[SELECT Id, Name FROM Contact WHERE Id NOT IN (SELECT Contact_Attendee__c 
                 FROM Event_Partcipant__c 
                 WHERE Event__c = :eventId)];
            return availablelist;
        
    }
}