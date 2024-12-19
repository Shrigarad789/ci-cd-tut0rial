public with sharing class WelcomeController {
    Public WelcomeController(){
        List<Account>acclist=[select id from account];
        system.debug('acclist----++'+acclist);
        system.debug('!acclist--'+acclist.size());
    } 
}