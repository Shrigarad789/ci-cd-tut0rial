public class Leadtriggerhandler {
    public static void checkleaddata(List<lead> lelist){
        try {
            set<string> Vemail = new set<string>();
    for(lead l:lelist){
        Vemail.add(l.Email);
            }
    List<Lead> Leadlist = [select id,Email,Phone from lead where Email in: Vemail ];
        if(Leadlist.size() > 0){
        lelist[0].Email.addError('Duplicate value');
    }
            
        } 
        catch(DmlException ex) {
            throw ex;
        }
    }
}