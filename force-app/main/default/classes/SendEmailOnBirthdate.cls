global class SendEmailOnBirthdate implements Database.Batchable<Contact>, Schedulable{
    global Iterable<Contact> start(Database.BatchableContext bc){
        list<Contact> sq=[select Name,Email,Date_of_Birth__c from Contact where Date_of_Birth__c=2023-12-15 
];

    return sq;
    }
    global  void execute(Database.BatchableContext bc, List<Contact> lst) {
        list<Messaging.SingleEmailMessage> mail = new list<Messaging.SingleEmailMessage>();

        for(Contact e: lst)

        {

         Messaging.SingleEmailMessage maileach = new Messaging.SingleEmailMessage();

         list<string> toadd=new list<string>();

         toadd.add(e.Email );

          maileach.settoaddresses(toadd);

          maileach.setsubject('birthday wishes');

          maileach.setplaintextbody('happy birthday '+e.Name);

          mail.add(maileach);

        }

    Messaging.SendEmailResult[]  result  =Messaging.sendEmail( mail);

    } 
    
    global  void finish(Database.BatchableContext sc)  {
        
        
    }
    global void execute(SchedulableContext sc) {
        //invoke the batch class
        SendEmailOnBirthdate batch = new SendEmailOnBirthdate();
        Database.executeBatch(batch);
    }
    }