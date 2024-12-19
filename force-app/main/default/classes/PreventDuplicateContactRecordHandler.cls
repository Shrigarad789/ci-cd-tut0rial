public class PreventDuplicateContactRecordHandler {
    Public static void testrecord(List<contact> conlist){
        
            try{
                set<string> constring =new set<string>();
                For(contact c:conlist){
                    constring.add(c.Lastname);
                }
                    List<contact> colist =[select id,Lastname from contact where Lastname in: constring ];
                    
                if(colist.size()>0) {
                    conlist[0].Lastname.adderror('Already have contact');
                }  
                
            }
            catch(exception e){
                
            }
        
        
    }

}