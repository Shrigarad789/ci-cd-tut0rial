public class FirstIntegrationToExternalSystem {
    public static void makeCallout(){
        //SEND REQUEST
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://global-warming.org/api/temperature-api');
        req.setMethod('GET');
        HTTPResponse res=http.send(req);
        if(res.getStatusCode() == 200){
            System.debug('made a callout to external system'+res.getbody());
        }
        
    }
    
}
/*we created a request object and from the request object
i have set the end point in which URL we need to send the request
and we get the data,after sending request we get response,base on the status code define what we need to do further.*/