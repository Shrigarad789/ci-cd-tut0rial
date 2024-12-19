import { LightningElement ,wire} from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import getOpportunities from "@salesforce/apex/DatatableNavigationDemoController.getOpportunities";
const OPPORTUNITY_COLS = [
    {
        label: "Name",
        fieldName: "Name"
        // type: "button",
        // typeAttributes: { label: { fieldName: "Name" }, name: "gotoOpportunity", variant: "base" }
    },
    {
        label: "Stage",
        fieldName: "StageName"
    },
    {
        label: "Amount",
        fieldName: "Amount",
        type: "currency"
    },
    { label: "Close Date", type: "date", fieldName: "CloseDate" },
    { label: "Description", fieldName: "Description" },
    {
        
        type: "button",
        typeAttributes: {
            label: "View",
            name: "gotoOpportunity",
            variant: "brand"
        }
    }
];

export default class NavigateToRecordDetailPage extends NavigationMixin(LightningElement){
    opportunityCols = OPPORTUNITY_COLS;

    @wire(getOpportunities, {})
    opportunities;

    handleRowAction(event) {
        if (event.detail.action.name === "gotoOpportunity") {
            this[NavigationMixin.GenerateUrl]({
                type: "standard__recordPage",
                attributes: {
                    recordId: event.detail.row.Id,
                    actionName: "view"
                }
            }).then((url) => {
                window.open(url, "_blank");
            });
        }
        // if (event.detail.action.name === "editOpportunity") {
        //     this[NavigationMixin.Navigate]({
        //         type: "standard__recordPage",
        //         attributes: {
        //             recordId: event.detail.row.Id,
        //             actionName: "edit"
        //         }
        //     });
       // }
    }
}