public with sharing class lwcApexController {
   
@AuraEnabled
public static Account insertAccountMethod(Account accountObj){

    try {
insert accountObj;
return accountObj;
} catch (Exception exp) {
throw new AuraHandledException(exp.getMessage());
}
}

@AuraEnabled
public static Contact insertConMethod(Contact conObj){

    Contact newOpportunity = new Contact(Lastname='OpportunityWithAccountInsert');
try {
insert conObj;
return conObj;
} catch (Exception exp) {
throw new AuraHandledException(exp.getMessage());
}
}
    }