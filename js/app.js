var locations = [
              
              {
              	title : "Katy Mills mall",
              	position : {lat: 29.775746, lng: -95.80937}

              },
              {
              	title: "Monkey Joe's",
              	position: {lat: 29.7777343, lng: -95.75078659999997}
              },
              {
              	title: "Mary Jo Park",
              	position: {lat:29.8037453, lng: -95.82035400000001}
              },
              {
              	title: "Ritter's Frozen Custard",
              	position: {lat: 29.8215723, lng: -95.720639}
              },
              {
              	title: "Pizza Hut",
              	position: {lat: 29.77141469999999, lng: -95.7506004}
              },
              {
              	title: "Katy Library",
              	position: {lat: 29.802324, lng: -95.81735759999998}
              },
              {
              	title: "Star Bucks Cafe",
              	position: {lat:29.7843468, lng: -95.70540570000003}
              }

            ]

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
            populateInfoWindow(this,infoWindow);
          });

	return marker;

}

///////////////////////////////////////////////////////////////////////////////////


var Place = function(map,infoWindow,data){

	this.title = ko.observable(data.title);
	this.marker = Marker(map,infoWindow,data);
	this.show = ko.observable(true);

}
////////////////////////////////////////////////////////////////////////////////////////
toggleBounce =function(marker) {
       
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 1400);
        
      };
/////////////////////////////////////////////////////////////////////////////////////////// 
populateInfoWindow = function(marker, infoWindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infoWindow.marker != marker) {
          infoWindow.marker = marker;
          infoWindow.setContent('<div>' + marker.title + '</div>');
          infoWindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infoWindow.addListener('closeclick',function(){
            infoWindow.setMarker = null;
          });
        }
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
        //viewModel.createMarker();
        
         }

/////////////////////////////////////////////////////////////////////////////////////


var ViewModel = function(){
    
    var self = this;
    this.query = ko.observable('');
	this.placeList = ko.observableArray([]);
	locations.forEach(function(location){
		self.placeList.push(new Place(map,infoWindow,location));
		
});

	
    this.triggerMarker = function(place){

    	google.maps.event.trigger(place.marker, 'click');
    }; 

    self.updatePlaceList = ko.computed(function(){
    	var val = self.query();
    	console.log(val);
    	for(var i=0;i<self.placeList().length;i++){
    		if (self.placeList()[i].title().toLowerCase().indexOf(val) >= 0){
    			self.placeList()[i].show(true);
    			self.placeList()[i].marker.setMap(map);
    			console.log(self.placeList()[i].title());
    		}

    		else {
    			self.placeList()[i].marker.setMap(null);
    			self.placeList()[i].show(false);
    			
    		}

    	}
    	

    });
    	
    	
   

	 

}; 

//ko.applyBindings(new ViewModel());


      


  