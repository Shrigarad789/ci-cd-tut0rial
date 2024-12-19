public class DuplicatePhoneValidationHandler {
    public static void validationOnRecordInsertion(List<Account> acclist ){
        Set<String> setName = new Set<String>();
        For(Account acc : acclist){
            setName.add(acc.Phone);
        }
        if(setName.size() > 0 ){
            List<Account> lstAccount = [select phone ,id from account where Phone in :setName ];
            Map<string,account> mapofstringacc=new Map<string,account>();
            For(Account acc: lstAccount)
            {
                mapofstringacc.put(acc.phone,acc);
                  }
            For(Account acc :  acclist)
            {
                if(mapofstringacc.containsKey(acc.phone))
                {
                    acc.phone.addError('Phone already Exist in handler method ');
                }
            }
        }
    }
    public static void validationOnRecordUpdation(List<Account> newlist,map<id,Account> oldmap ){
         For(Account acc : newlist){
            if(oldmap!=null & acc.phone !=oldmap.get(acc.id).phone){
                acc.phone.addError('update Phone already Exist in handler method ');
            }
        }
    } 
}