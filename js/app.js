//these are the nearby places that will show up on the map
var locations = [
              
              {
              	title : "Katy Mills mall",
              	position : {lat: 29.775746, lng: -95.80937},
              	FSquareID: '4b64826df964a5205eb92ae3'

              },
              {
              	title: "Monkey Joe's",
              	position: {lat: 29.7777343, lng: -95.75078659999997},
              	FSquareID: '4d6951d01a88b1f7cbb6295d'
              },
              {
              	title: "Mary Jo Park",
              	position: {lat:29.8037453, lng: -95.82035400000001},
              	FSquareID: '4bbe5a3d98f49521f816d163'
              },
              {
              	title: "Ritter's Frozen Custard",
              	position: {lat: 29.8215723, lng: -95.720639},
              	FSquareID: '4bafdb1ef964a5206e263ce3'
              },
              {
              	title: "Pizza Hut",
              	position: {lat: 29.77141469999999, lng: -95.7506004},
              	FSquareID: '4c60034f3a3703bbca1de406'
              },
              {
              	title: "Katy Library",
              	position: {lat: 29.802324, lng: -95.81735759999998},
              	FSquareID: '4c2cf824e760c9b635124449'
              },
              {
              	title: "Star Bucks Cafe",
              	position: {lat:29.7843468, lng: -95.70540570000003},
              	FSquareID: '4c51d7209d642d7f79f143de'
              }

            ]
//Create a marker for a location defined by the locations list above
Marker = function(map,infoWindow,data){

	var marker = new google.maps.Marker({
            map: map,
            position: data.position,
            title: data.title,
            animation: google.maps.Animation.DROP,
            //id: i
          });
	bounds.extend(marker.position);
	map.fitBounds(bounds);
	marker.addListener('click', function() {
            toggleBounce(this);
            populateInfoWindow(this,infoWindow,data);
          });

	return marker;

}

///////////////////////////////////////////////////////////////////////////////////
//create place as knockout observable each place has a marker associated with it

var Place = function(map,infoWindow,data){

	this.title = ko.observable(data.title);
	this.marker = Marker(map,infoWindow,data);
	this.show = ko.observable(true);
	

}
////////////////////////////////////////////////////////////////////////////////////////
//this function makes the marker bounce whenever it clicked
toggleBounce =function(marker) {
       
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 1400);
        
      };
/////////////////////////////////////////////////////////////////////////////////////////// 
//populate the infowindow associated with a marker
populateInfoWindow = function(marker, infoWindow, d) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infoWindow.marker != marker) {
          infoWindow.marker = marker;
          infoWindow.setContent('Loading data...');
          infoWindow.open(map,marker);
          client_secret = 'X34FUUUYVRT1DEZ1MFI0DPSQGRJKYSLXPITN5IEAZJJHNJR1';
          //client_secret = 'X34FUUUYVRT1DEZ1MFI0DPSQGRJKYSLXDFKJ5IEAZJJHNJR1';
          client_id = 'RUQQDI3NHVUPOW04EVJKZLYSVAQ45AOIK4NNIDRZMDU3KJ0Q';
          v = '20130815';
          venuID = d.FSquareID;
          //the fsquare url to request data from foursquare api about a place given its venue ID
          fsquareUrl = 'https://api.foursquare.com/v2/venues/'+venuID+'?client_id='+client_id+'&client_secret='
                      +client_secret+'&v='+v+'';
        //the function getJSON makes an ajax request to foursquare api
        $.getJSON( fsquareUrl, function( data ) {

       var address = data.response.venue.location.formattedAddress;
       if (address == undefined){
        address = 'no address available';
       }
       //append the data requested(address) to the info windo along with the title of the place   
       infoWindow.setContent('<div>' + marker.title +'</div><p>'+address+'<p>');
          infoWindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infoWindow.addListener('closeclick',function(){
            infoWindow.marker = null;
          });
        //if the request fail show an error message on the infowindow
       }).fail(function(e){
        infoWindow.setContent('<div>'+marker.title +'</div><p>foursquare data could not be reached<p>');
        infoWindow.open(map, marker);
        //$('#fsquareError').append('Foursquare data could not be loaded');
        });

          
        }
      }


/////////////////////////////////////////////////////////////////////////////////////


var ViewModel = function(){
    
    var self = this;
    this.showError = ko.observable(false);
    this.query = ko.observable('');
    this.showFSerrorMsg = ko.observable(false);
    //create an empty observable array to carry all the locations
	this.placeList = ko.observableArray([]);
	//populate the placeList array with all the locations
	locations.forEach(function(location){
		self.placeList.push(new Place(map,infoWindow,location));
		
});

    //trigger the marker when the coressponding name on the list is clicked	
    this.triggerMarker = function(place){

    	google.maps.event.trigger(place.marker, 'click');
    }; 
    //this computed observable to update the placeList according to the search term
    self.updatePlaceList = ko.computed(function(){
    	var val = self.query().toLowerCase();
    	//console.log(val);
    	for(var i=0;i<self.placeList().length;i++){
    		//if the search term included in a place title, show that place and its marker
    		if (self.placeList()[i].title().toLowerCase().indexOf(val) >= 0){
    			self.placeList()[i].show(true);
    			self.placeList()[i].marker.setMap(map);
    			console.log(self.placeList()[i].title());
    		}
            //if not hide it from the list and from the map
    		else {
    			self.placeList()[i].marker.setMap(null);
    			self.placeList()[i].show(false);
    			
    		}

    	}
    	

    });
    	
    	
}; 

//////////////////////////////////////////////////////////////////////////////////////////
//show the error message if the google map was un able to load
function googleError(){
	//$('#mapError').append('google Map could not be loaded');
	ViewModel.showError(true);
}
///////////////////////////////////////////////////////////////////////////////////////////           

var map;
var bounds;
var infoWindow;
      function initMap() {

      	bounds = new google.maps.LatLngBounds();
      	infoWindow = new google.maps.InfoWindow();
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 29.7718837, lng: -95.77056520000001},
          zoom: 13
        });

        ko.applyBindings(new ViewModel);
        
        
         }

      


  