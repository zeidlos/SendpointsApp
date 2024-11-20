import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  watch: any;
  coordinates: {};
  map: any;
  marker: Array<any> = [ ];
  input: any;

  @ViewChild('map') mapElement: ElementRef;


  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    // private googleMaps: GoogleMaps
  ) {

  }

  ionViewWillEnter() {
    this.getPosition();
  }

  ngAfterViewInit() {

  }

  loadMap(coords) {
    let latLng = new google.maps.LatLng(coords.latitude, coords.longitude);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


    var input = document.getElementById('pac-input');

    var types = document.getElementById('type-selector');
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    let autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.updatePosition(place.geometry.location);
        this.map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setIcon({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      });
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(this.map, this.marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      var radioButton = document.getElementById(id);
      radioButton.addEventListener('click', function() {
        autocomplete.setTypes(types);
      });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

  }


  updatePosition(coords) {
    let latLng = new google.maps.LatLng(coords.latitude, coords.longitude);
    this.map.setCenter(latLng);
  }
  getPosition () {
    this.geolocation.getCurrentPosition().then(
      (res) => {
        console.log(res.coords);
        this.coordinates = res.coords;
        this.loadMap(res.coords);
      }
    ).catch(
      (err) => {
        console.log('Error getting location ', err);
        alert('Error getting location');
      }
    )
    let watch = this.geolocation.watchPosition();
    watch.subscribe(
      (data) => {
        console.log(data.coords);
        this.updatePosition(data.coords);
      }
    )

  }




}
