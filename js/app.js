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


var ViewModel = function(){
    
    var self = this;
	this.placeList = ko.observableArray([]);
	//var markers = [];
	locations.forEach(function(location){
		self.placeList.push(new Place(map,infoWindow,location));
		
});

	
    this.triggerMarker = function(place){

    	google.maps.event.trigger(place.marker, 'click');
    };  

	 

} 

//ko.applyBindings(new ViewModel());


      


  