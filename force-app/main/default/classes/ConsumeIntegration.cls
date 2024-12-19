public class ConsumeIntegration {
public static void makeCallout(){
        //SEND REQUEST
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:SF_Named_Cred/services/apexrest/DataAvailable');
        req.setMethod('GET');
        HTTPResponse res=http.send(req);
        if(res.getStatusCode() == 200){
            System.debug('made a callout to external system'+res.getbody());
        }
        
    }
    
}