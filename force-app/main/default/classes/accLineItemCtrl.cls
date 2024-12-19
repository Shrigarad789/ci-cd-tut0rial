public class accLineItemCtrl {
    @AuraEnabled
    public static Map<String, Object> submitOptRecord(String jsonDataStr) {
        Map<String, Object> result = new Map<String, Object>();
        try {
            Map<String, Object> formDataMap = (Map<String, Object>)JSON.deserializeUntyped(jsonDataStr);
            System.debug('formDataMap ' + formDataMap);
            Map<String, Object> accDataMap = (Map<String, Object>)formDataMap.get('optDataFyObj');
    
            Account accObj = new Account();
            accObj.Name = getStringValueFromMap(accDataMap, 'Name');
            accObj.Phone = getStringValueFromMap(accDataMap, 'Phone');
            accObj.Description = getStringValueFromMap(accDataMap, 'Description');
           
            
    
            system.debug('optObj### ' + accObj);
            List<Database.SaveResult> insertResult = Database.insert(new List<Account>{accObj});
            System.debug('insertResult ' + insertResult);
    
            String insertMsg;
            String accLineId;
            for(Database.SaveResult insertResultItem : insertResult) {
                System.debug('Database.SaveResult: ' + insertResultItem);
                List<String> dbErrorArr = new List<String>();
    
                for(Database.Error err : insertResultItem.getErrors()) {
                    dbErrorArr.add(err.getMessage() + ' fields:' + String.join(err.getFields(), ','));
                }
                if(insertResultItem.isSuccess()) {
                    insertMsg = null;
                    accLineId = insertResultItem.getId();                    
                } else {
                    insertMsg = String.join(dbErrorArr, ';');
                }
                
            }
            system.debug('accLineId###___A' + accLineId);
    
    
    
            if(insertMsg != null) {
                result.put('status', 400);
                result.put('message', insertMsg);
                return result;
            }
    
           
            List<Contact> conRecArr = new List<Contact>();
            system.debug('accLineId## ' + accLineId);
            if(accLineId != null) {
    
                Map<String, Object> lineData = (Map<String, Object>)formDataMap.get('contactLine');
                system.debug('lineData_1## ' + lineData);
                if(lineData.containsKey('line1')) {
                    Contact conRec = getSALObj((Map<String, Object>)lineData.get('line1'), accLineId);    
                    conRecArr.add(conRec);
    
                }
    
                if(lineData.containsKey('line1')) {
                    Contact conRec = getSALObj((Map<String, Object>)lineData.get('line2'), accLineId);    
                    system.debug('lineData_2## ' + lineData);     
                    conRecArr.add(conRec);
    
                }
    
                System.debug('conRecArr## ' + conRecArr);
                insertResult = new List<Database.SaveResult>();
                insertResult = Database.insert(conRecArr);
                System.debug('insertResult ' + insertResult);
    
    
                insertMsg = null;
                List<String> accIdArr = new List<String>();
                for(Database.SaveResult insertResultItem : insertResult) {
                    System.debug('Database.SaveResult: ' + insertResultItem);
                    List<String> dbErrorArr = new List<String>();
                    for(Database.Error err : insertResultItem.getErrors()) {
                        dbErrorArr.add(err.getMessage() + ' fields:' + String.join(err.getFields(), ','));
                    }
                    if(insertResultItem.isSuccess()) {
                        accIdArr.add(insertResultItem.getId());
                    } else {
                        insertMsg = String.join(dbErrorArr, ';');
                    }
    
                }
                system.debug('accIdArr__RR' + accIdArr);
    
                if(insertMsg != null) {
                    result.put('status', 400);
                    result.put('message', insertMsg);
                    return result;
                } else {
                    result.put('status', 200);
                    result.put('accLineId', accLineId);
                    result.put('Contact Account Line Id Arr', accIdArr);
                    return result;
                }
            }
        }catch(Exception ex) {
            System.debug('Exception ' + ex.getMessage() + ',line' + ex.getLineNumber());
            result.put('status', 500);
            result.put('message', 'Exception ' + ex.getMessage() + ',line' + ex.getLineNumber());
        }
        return result;
    
    }
    
    
    @Auraenabled 
    public static Contact getConObj(Map<String, Object> dataMap, String accLineId) {
        String FirstName, LastName, Email, Phone, masterid = accLineId;
        FirstName = getStringValueFromMap(dataMap, 'FirstName');
    
        Contact coObj=new Contact();
    
       return coObj;
    
    }
    
    
    public static String getStringValueFromMap(Map<String, Object> dataMap, String fieldName) {
        String value;
        try {
            if(dataMap.containsKey(fieldName)) {
                value = String.valueOf(dataMap.get(fieldName));
            }
            
            value = String.isEmpty(value) ? value :  String.valueOf(value);
        } catch(Exception ex) {
            System.debug('Exception getValueFromMap : '+ ex.getMessage() + ' line ' + ex.getLineNumber());
        }
        
        return value;
    }
    
    
    
    public static Date getDateValueFromMap(Map<String, Object> dataMap, String fieldName) {
        Date value;
        try {
            String str;
            if(dataMap.containsKey(fieldName)) {
                str = String.valueOf(dataMap.get(fieldName));
            }
            
            value = String.isEmpty(str) ? value :  Date.valueOf(str);
        } catch(Exception ex) {
            System.debug('Exception getIntValueFromMap : '+ ex.getMessage() + ' line ' + ex.getLineNumber());
        }
        
        return value;
    }
    
    
    @Auraenabled 
    public static Contact getSALObj(Map<String, Object> dataMap, String accLineId) {
        String fName, lName, phoneStr, emailStr, masterid = accLineId;
        fName = getStringValueFromMap(dataMap, 'FirstName');
        lName = getStringValueFromMap(dataMap, 'LastName');
        phoneStr = getStringValueFromMap(dataMap, 'Phone');
        emailStr = getStringValueFromMap(dataMap, 'Email');
    
          Contact con1 = new Contact();
          con1.FirstName=fName;
          con1.LastName=lName;
          con1.Phone=phoneStr;
          con1.Email=emailStr;
          con1.AccountId=accLineId;
          return con1;
        
    }
}