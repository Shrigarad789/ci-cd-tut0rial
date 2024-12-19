public class QueryContact {
  public static Id getContactID(String lastName, String title) {
    try {
      Contact myContact = Database.query(
        'SELECT ID FROM Contact WHERE lastName = :lastName AND title = :title LIMIT 1'
      );
      return myContact.Id;
    } catch (Exception ex) {
      return null;
    }
  }
  public static Id getContactIDWithBinds(Map<String, Object> bindVars) {
       String query = 'SELECT ID FROM CONTACT WHERE LastName = :lastName AND Title = :title LIMIT 1';
      List<contact>Contacts = Database.queryWithBinds(query, bindVars, AccessLevel.USER_MODE);
      if(contacts != null && !contacts.isEmpty()){
          return contacts[0].Id;
      } else {
    //do not modify any code above this line
    //implement the logic that will use bindVars to retrieve the contact's ID
    return null;
    }
}
}