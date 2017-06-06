import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
// import {
//  GoogleMaps,
//  GoogleMap,
//  GoogleMapsEvent,
//  LatLng,
//  CameraPosition,
//  MarkerOptions,
//  Marker
// } from '@ionic-native/google-maps';

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
      mapTypeControlStyle: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  getMarker() {
    console.log('Marker: ', this.marker);
  }

  addMarker() {
    this.getMarker();
    this.marker.push(new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      clickable: true
    }));


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
