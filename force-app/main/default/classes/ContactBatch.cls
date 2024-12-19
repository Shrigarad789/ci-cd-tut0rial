global class ContactBatch implements Database.Batchable<SObject>{
    global Database.QueryLocator start(Database.BatchableContext bc){
        string Query='select Id, Name,  Fax, MobilePhone,  Email,  Description ,Account.Name ,Account.Rating,Account.Phone,Account.Fax, account.Industry from contact';
        return Database.getQueryLocator( Query);
    }
    global void execute(Database.BatchableContext bc,list<contact> conlist){
        Integer size=conlist.size();
        for(Integer i=0;i< size;i++){
            contact con=conlist.get(i);
            if(con.Fax==null || con.Fax==''){
                con.Fax=con.account.fax;
                system.debug('con.account.fax'+con.account.fax);
            }
            if(con.MobilePhone==null || con.MobilePhone==''){
                con.MobilePhone=con.account.Phone;
            }
            con.Email='shrikantg.sfdc@gmail.com';
            con.Description=con.Account.Name+' '+Account.Rating +' '+ account.Industry+' '+con.email;
            SYSTEM.debug('con.Description'+con.Description);
        }
        update conlist;
    }
    global void finish(Database.BatchableContext bc){
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setSubject('Status of Batch Class:Contactbatch ' );
        email.setSenderDisplayName('SFDC SHRIKANT GARAD DEMO');
        email.setHtmlBody('Dear User,Batch Processed');
        list<string> emailto= new list<string>();
        emailTo.add('shrikantg.sfdc@gmail.com');
        email.setToAddresses(emailTo);
        
        Messaging.SingleEmailMessage[] emaillist = new  List<Messaging.SingleEmailMessage>();
        emaillist.add(email);
        Messaging.sendEmail(emaillist,false);
    }
}