//creating a object for Parcel, with constructor
const Parcel = class {
    constructor(trackingNumber, status, destination, weight, express) {
        this.trackingNumber = trackingNumber;
        this.status = status;
        this.destination = destination;
        this.weight = weight;
        this.express = express;
    }
}

//declare constants
const NEW_PARCEL_STATUS = "Processing";
const SHIPPING_FLAT_RATE = 5;
const SHIPPING_EXPRESS_ADD = 10;
const SHIPPING_PER_WEIGHT = 0.05;
const TAX = 0.13;

//creating an array to store the parcel objects
var parcels = [
];

//populate parcel arrays with initial parcels
var parcelStatus = ["Processing","Shipped","In Transit","Delivered"];
var parcelDestination = ["Ontario","Alberta","Manitoba","Quebec"];
var parcelWeight = [12,34,56,78];
var parcelExpress = [true,true,false,false];

console.log("status length=",parcelStatus.length);
for ( let i=0 ; i<parcelStatus.length; i++ ){
    parcels.push( new Parcel (generateUniqueTrackingNumber(),parcelStatus[i],parcelDestination[i],parcelWeight[i],parcelExpress[i]));    
}
console.log("parcels=",parcels);

/*
    createParcel()
    Purpose: Create a new parcel
    Parameters: get from page form
    Returns: none
*/

    function createParcel(){
        //assign create parcel form elements to variables
        var parcelDestinationSelection = document.getElementById("createParcel_Destination");
        var parcelWeightInput = document.getElementById("createParcel_Weight");
        var parcelExpressCheckbox = document.getElementById("createParcel_expressShipping");
        var createParcelButton = document.getElementById("createParcelButton");

        var destination = parcelDestinationSelection.value;
        console.log("destination=",destination);
        //validate weight input as a number, even if is a number input type
        var weight = validNumber(parcelWeightInput.value) ? parcelWeightInput.value : null;
        //if number is not valid, respond to user with field and button changes
        if(!weight){
            parcelWeightInput.value="0";
            parcelWeightInput.className = "errorMessageInput";
            parcelWeightInput.disabled = true;
            createParcelButton.value = "Weight is invalid";
            createParcelButton.className = "errorMessageButton";
            createParcelButton.disabled = true;
            console.log("weight had not a valid input");
            setTimeout(()=>{
                parcelWeightInput.value="0";
                parcelWeightInput.className = "normalInput";
                parcelWeightInput.disabled = false;
                createParcelButton.value = "Create Parcel";
                createParcelButton.className = "createParcelButton";
                createParcelButton.disabled = false;
            },2000);
            return false;
        }
        weight = parseFloat(+weight);
        console.log("weight=",weight);

        //if weight is valid, proceed
        var express = parcelExpressCheckbox.checked;
        console.log("express = ", express);

        //create another unique tracking number
        var newTrackingNumber = generateUniqueTrackingNumber();
        console.log("new tracking number = ", newTrackingNumber);

        //create new instance of Parcel and push to parcels array
        parcels.push( new Parcel( newTrackingNumber, NEW_PARCEL_STATUS, destination, weight, express ));
        console.log(parcels);

        clearCreateParcels();
        displayParcels();

    } // end of function createParcel()

    function processParcel(){
        
        //get the value from textbox
        var trackingNumberElement = document.getElementById("tbTrackingNumber");
        var trackingNumber = trackingNumberElement.value;
        //get value from dropdown
        var trackingStatusSelection = document.getElementById("processParcel_Status");
        var trackingStatus = trackingStatusSelection.value;

        //verify validity of trackingNumber
        if(!textInputValidated(trackingNumber)){
            //error message to user
            throwProcessParcelErrorToUser("Tracking Number Invalid!");
            return false;
        }

        var parcelFound = parcels.find((parcel)=>parcel.trackingNumber.toLowerCase()===trackingNumber.toLowerCase());

        console.log("parcel found=",parcelFound);

        if(parcelFound===undefined){
            throwProcessParcelErrorToUser("Tracking Number Not Found!");
            return false;
        }

        //assign new status to the parcel found
        //this instance is the same object that is at the array parcels
        //so any change here is at the object itself
        parcelFound.status = trackingStatus;

        console.log("parcels after the status change:", parcels);

        //update the parcels list
        displayParcels();

        //calculate the shipping cost for the parcel
        var totalShippingCost = 0;
        totalShippingCost += SHIPPING_FLAT_RATE;
        if(parcelFound.express){
            totalShippingCost += SHIPPING_EXPRESS_ADD;
        }
        totalShippingCost += SHIPPING_PER_WEIGHT * +parcelFound.weight;

        //apply tax
        totalShippingCost *= 1 + +TAX;//the '+' garantees TAX will be considered as numeric

        //alert parcel processing for the user
        var alertMessage = `Shipping for parcel: ${parcelFound.trackingNumber}\n$${totalShippingCost.toFixed(2)}`;
        document.getElementById("processParcelMessage").innerHTML=alertMessage.replace("\n"," is ");
        document.getElementById("processParcelMessage").style.color = "green";
        document.getElementById("processParcelMessage").style.display = "inline";
        
        alert(alertMessage);

        setTimeout(()=>{
            document.getElementById("processParcelMessage").innerHTML="";
        },2000)

        //clear process parcels form
        clearProcessParcels();

    } // end of function processParcel()

    function validNumber(inputNumber){
        inputNumber = inputNumber.replace(/\s+/,"");
        inputNumber = inputNumber.replace(/\,+/,".");
        if(isNaN(parseFloat(+inputNumber))){
            return false;
        }
        if(parseFloat(+inputNumber)<=0){
            return false;
        }
        return true;
    }

/*
    generateTrackingNumber()
    Purpose: Helper function - generates a random tracking number
    Parameters: none
    Returns: string
*/
    function generateTrackingNumber()
    {
        const TN_LENGTH = 10;
        const TN_PREFIX = "IWD";
        var tokens = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0'];
        var trackingNumber = new String(TN_PREFIX);
        for(var x = 0; x < TN_LENGTH; x++) {
            trackingNumber = trackingNumber.concat( tokens[ Math.floor( Math.random() * tokens.length ) ] );
        }
        console.log("Generated: " + trackingNumber);
        return trackingNumber;
    } // end generateTrackingNumber

    function generateUniqueTrackingNumber(){
        //generate random tracking numbers
        //until it is one that does not exist
        //in the parcels array yet
        var newTrackingNumber;
        do{
            newTrackingNumber = generateTrackingNumber();
        } while( parcels.find( ({ trackingNumber })=>trackingNumber===newTrackingNumber) );
        return newTrackingNumber;
    }

    function clearCreateParcels(){
        var parcelDestinationSelection = document.getElementById("createParcel_Destination");
        var parcelWeightInput = document.getElementById("createParcel_Weight");
        var parcelExpressCheckbox = document.getElementById("createParcel_expressShipping");

        parcelDestinationSelection.selectedIndex = 0;
        parcelWeightInput.value = 0;
        parcelExpressCheckbox.checked = false;

    }

    function clearProcessParcels(){
        let trackingNumberElement = document.getElementById("tbTrackingNumber");
        let trackingStatusSelection = document.getElementById("processParcel_Status");

        trackingNumberElement.value = "";
        trackingStatusSelection.selectedIndex = 0;

    }

    function displayParcels(){
        //declare and clear the output are for parcels
        var displayParcelOutput = document.getElementById("displayParcelOutput");
        document.getElementById("formerParcelsHeader").innerHTML = "";
        displayParcelOutput.innerHTML = ""; 
        //build the header for the table
        displayParcelOutput.appendChild(buildParcelsListHeaderMarkup());

        //verify the value of the filter
        var displayParcelsFilter = document.getElementById("displayParcelsFilter");
        var statusFilter = displayParcelsFilter.value;
        console.log("statusFilter = ", statusFilter);

        console.log("parcels before filtering:",parcels);
        
        var parcelsFiltered = statusFilter=="All" ? parcels.slice(0) : parcels.filter((parcel)=>parcel.status===statusFilter);

        console.log("parcelsFiltered:",parcelsFiltered);

        //build parcels rows
        var parcelsContainer = document.getElementById("parcelsContainer");
        parcelsFiltered.forEach((parcel)=>{
            let row = buildParcelsListRowMarkup(parcel);
            parcelsContainer.append(row);
        });
    }

    function buildParcelsListHeaderMarkup(){
        var tableContainer = document.createElement("div");
        tableContainer.id = "parcelsContainer";
        
        var header = document.createElement("div");
        header.className = "parcelsRow parcelsHeader";
        
        var trackingNumberColumn = document.createElement("div");
        trackingNumberColumn.className= "parcelsTrackingNumber parcelsColumn";
        trackingNumberColumn.innerHTML = "TRACKING NUMBER";
        
        var statusColumn = document.createElement("div");
        statusColumn.className = "parcelsStatus parcelsColumn";
        statusColumn.innerHTML = "STATUS";
        
        var destinationColumn = document.createElement("div");
        destinationColumn.className = "parcelDestination parcelsColumn";
        destinationColumn.innerHTML = "DESTINATION";
        
        var weightColumn = document.createElement("div");
        weightColumn.className = "parcelWeight parcelsColumn";
        weightColumn.innerHTML = "WEIGHT(g)";
        
        var expressColumn = document.createElement("div");
        expressColumn.className = "parcelExpress parcelsColumn";
        expressColumn.innerHTML = "EXPRESS";
        
        header.appendChild(trackingNumberColumn);
        header.appendChild(statusColumn);
        header.appendChild(destinationColumn);
        header.appendChild(weightColumn);
        header.appendChild(expressColumn);
        
        tableContainer.appendChild(header);
        
        return tableContainer;
    }

    function buildParcelsListRowMarkup(parcel){
        var row = document.createElement("div");
        row.className = "parcelsRow";

        var trackingNumberColumn = document.createElement("div");
        trackingNumberColumn.className= "parcelsTrackingNumber parcelsColumn";
        trackingNumberColumn.innerHTML = parcel.trackingNumber;

        var statusColumn = document.createElement("div");
        statusColumn.className = "parcelsStatus parcelsColumn";
        switch(parcel.status){
            
            case "Processing":
                statusColumn.className += " statusProcessing";
            break;
            
            case "Shipped":
                statusColumn.className += " statusShipped";
            break;

            case "In Transit":
                statusColumn.className += " statusInTransit";
            break;

            case "Delivered":
                statusColumn.className += " statusDelivered";
            break;
        }
        statusColumn.innerHTML = parcel.status;

        var destinationColumn = document.createElement("div");
        destinationColumn.className = "parcelDestination parcelsColumn";
        destinationColumn.innerHTML = parcel.destination;

        var weightColumn = document.createElement("div");
        weightColumn.className = "parcelWeight parcelsColumn";
        weightColumn.innerHTML = parcel.weight;

        var expressColumn = document.createElement("div");
        expressColumn.className = "parcelExpress parcelsColumn";
        expressColumn.innerHTML = parcel.express;

        row.appendChild(trackingNumberColumn);
        row.appendChild(statusColumn);
        row.appendChild(destinationColumn);
        row.appendChild(weightColumn);
        row.appendChild(expressColumn);

        return row;
    }

    function textInputValidated(textInput){
        //strip spaces
        textInput = textInput.replace(/\s+/g,"");
        //test whether there is contents in the string
        if(textInput == "" || textInput == null || textInput == undefined){
            return false;
        }
        //test if there is non-characters in the string
        if(textInput.match(/\W+/gi)){
            return false;
        }
        return true;
    }

    function throwProcessParcelErrorToUser(message){

        let processParcelButton = document.getElementById("processParcelButton");
        let trackingNumberElement = document.getElementById("tbTrackingNumber");
        let trackingStatusSelection = document.getElementById("processParcel_Status");                       
            processParcelButton.style.backgroundColor = "red";
            processParcelButton.style.color = "white";
            processParcelButton.value = message;
            processParcelButton.disabled = true;
            trackingNumberElement.style.backgroundColor = "red";
            trackingNumberElement.style.color = "white";
            trackingNumberElement.disabled = true;
            trackingStatusSelection.style.backgroundColor = "red";
            trackingStatusSelection.style.color = "white";
            trackingStatusSelection.disabled = true;
            console.log("tracking number had not a valid value");
            setTimeout(()=>{
                processParcelButton.style.backgroundColor = "white";
                processParcelButton.style.color = "black";
                processParcelButton.value = "Process Parcel";
                processParcelButton.disabled = false;
                trackingNumberElement.style.backgroundColor = "white";
                trackingNumberElement.style.color = "black";
                trackingNumberElement.value = "";
                trackingNumberElement.disabled = false;
                trackingStatusSelection.style.backgroundColor = "white";
                trackingStatusSelection.style.color = "black";
                trackingStatusSelection.selectedIndex = 0;
                trackingStatusSelection.disabled = false;
            },2000);

    }//throwProcessParcelErrorToUser
