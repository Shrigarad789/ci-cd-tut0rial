public class CloneCaseEmailWithAttachment {
    @InvocableMethod(label='Clone case & email Message')
   
    public static List<ContentDocumentLink> getOppDetail(List<string> args){
        string accId=args[0];
        List<ContentDocumentLink> accounts = [SELECT ContentDocumentId,ContentDocument.Title, 
ContentDocument.ContentModifiedDate, ContentDocument.ContentSize FROM 
ContentDocumentLink WHERE LinkedEntityId=:accId];
        
        //List<opportunity> lstopportunity =[select id,name,amount from opportunity where accountid=:accId] ;
        return accounts;
    }
}