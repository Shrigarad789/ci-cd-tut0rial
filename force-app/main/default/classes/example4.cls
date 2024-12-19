public class example4 {
    
     public static List<opportunity> getopplist(){
        
        return[select id ,name ,StageName, Owner.name from Opportunity ];
    }


}