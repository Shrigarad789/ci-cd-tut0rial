public class TestVisibleExample {
    // Private member variable
    @TestVisible
    private static Integer recordNumber = 1;

    // Private method
    @TestVisible 
    private static void updateRecord(String name) {
        // Do something
    } 

}