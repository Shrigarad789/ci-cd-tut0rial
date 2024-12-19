public with sharing class WithsharingApexclass {
    public  List<opportunity> records {get; set;} 
    public WithsharingApexclass(){ 
        
        records =[select id ,name ,StageName, Owner.name from Opportunity ];
    }
}