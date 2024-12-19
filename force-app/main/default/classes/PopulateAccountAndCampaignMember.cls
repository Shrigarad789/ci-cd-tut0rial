public class PopulateAccountAndCampaignMember {
    Public static void populateAccount(List<contact> conlists){
        list<contact> conlist =new  list<contact>();
        for(Contact con:conlists ){
            if(con.AccountId==null){
                conlist.add(con);
                system.debug('conlist before '+conlist);
            } 
        }
        if(!conlist.isEmpty()){
            system.debug('conlist.isEmpty()'+!conlist.isEmpty());
            list<Account> acclist =new  list<Account>();  
            for(Contact con:conlists ){
                account acc =new account();
                acc.Name=con.LastName;
                acc.Phone=con.Phone;
                acclist.add(acc); }
            insert acclist;
            system.debug('acclist'+acclist);
            for(integer i=0 ; i<conlist.size();i++){
                conlist[i].accountid = acclist[i].id;
            } 
        }
    }
    Public static void populateCampaignMember( map<id,Contact> contactMap){              
        if(contactMap != null && contactMap.size() > 0){
            list<CampaignMember> CMUpdateList = [select id, Disqualification_Reason__c, ContactId from CampaignMember where ContactId In : contactMap.keySet()];
            if(CMUpdateList != null && CMUpdateList.size() > 0){
                for(CampaignMember CM : CMUpdateList){
                    CM.Disqualification_Reason__c = contactMap.get(CM.ContactId).Disqualification_Reason__c;
                }
                update CMUpdateList;
            }
        }
    }
        
    }