public class lwcCSVUploaderController {
 public boolean displayMessage{get;set;}
    public boolean uploadprevent{get;set;}
    public boolean displayError{get;set;}
    public String ErrorMessage{get;set;}
    public boolean hideUploadCSBillingbutton{get;set;}
    
    public List <Account> saasConObjlist{ get;set;}
   
    public Blob csvFileBody {get;set;}
    public string csvAsString {get;set;}
    public String[] csvFileLines {get;set;}
    private set<String> CSBillingsetids {get;set;}
    
    public lwcCSVUploaderController() {
        
        csvFileLines = new String[] {};
            CSBillingsetids =  new set<String>();
        ErrorMessage='An error has occured while importing data.Please make sure input csv file is correct.';
        displayMessage = false;
        displayError = false;
        uploadprevent = false;
        hideUploadCSBillingbutton= true;
        //this.sctrl = stdcontroller;
     
        
    }
    
    public void yourCSVFile() {
        try {  
            if(!Test.isRunningTest())
                csvAsString = csvFileBody.toString();        
            csvFileLines = csvAsString.split('\n');          
            saasConObjlist= New List <Account> ();
          
            for (Integer i = 1; i < csvFileLines.size(); i++) {            
                Account saasConObj = new Account ();
            
                if(csvFileLines[i] != null){
                    string[] csvRecordData = csvFileLines[i].split(',');
                    
                    saasConObj.Id = String.valueOf(csvRecordData[0]).trim();
                    saasConObj.SLAExpirationDate__c = Date.Parse(csvRecordData[2].trim());
                   
                    String ppsId = String.valueOf(csvRecordData[1]).trim();
                   
                    saasConObjlist.add(saasConObj);
                    
                }
            }
            
            List<Database.SaveResult> saasList = new List<Database.SaveResult>();
            saasList = Database.update(saasConObjlist,false);
            
            List<Database.SaveResult> ppsList = new List<Database.SaveResult>();
          
            displayMessage = true;
            displayError = false;
            //CSBillinglist = null;
            csvFileLines = null;
            csvAsString = null;
            //hideUploadCSBillingbutton= true;
            
            // hideUploadCSBillingbutton= false;
            /*For(Cloud_Services_Billing__c Cloud_Services_Billing:[Select id ,Agreement_Status__c from Cloud_Services_Billing__c where id=:CSBillingsetids]){
if(Cloud_Services_Billing.Agreement_Status__c == 'INACTIVE'){
uploadprevent = true;
ErrorMessage ='You can not importing data with Any INACTIVE CS Billing Agreement Status!';
displayError = true;
displayMessage = false;
hideUploadCSBillingbutton=true;
break;
}
}*/
            
        } catch (Exception e) {
            displayError = true;
            displayMessage = false;
            uploadprevent = true;
            System.debug('==45==>'+e);
            System.debug('I am at line ' + String.valueOf(e.getLineNumber())); 
        }
    }
    /*public void UpdateYourCSBillingQtr() {
String Errors = '';
List<Database.SaveResult> srList = new List<Database.SaveResult>();
srList = Database.update(CSBillinglist,false);
displayMessage = true;
displayError = false;
CSBillinglist = null;
csvFileLines = null;
csvAsString = null;
hideUploadCSBillingbutton= true;

for (Database.SaveResult sr : srList) {
if(!sr.isSuccess()){
for(Database.Error err : sr.getErrors()){
Errors = Errors +'<br/>'+err.getMessage();
}
}
}
Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
email.setToAddresses(new String[]{Userinfo.getUserEmail()});
email.setSenderDisplayName('Salesforce System Admin');
email.setSubject('Log for CSBilling Load on');
if(Errors == '')
email.setHtmlBody('Hello, <br/>'+'<br/> CS Billing Qtr are successfully updated without Errors. <br/>'+'<br/> Thanks');
else
email.setHtmlBody('Hello, <br/>'+'<br/> CS Billing Qtr are loaded and have below Errors.'+Errors+'.<br/>'+' <br/>Thanks');
Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });*/
    
    

}