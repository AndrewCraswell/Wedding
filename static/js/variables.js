//ONE-PAGE NAVIGATION HIGHLIGHT
var onepage_nav = true; //If true, each menu item will highlight when scrolling to each respective section.

//MOBILE MENU TITLE
var mobile_menu_title = "Menu"; //The title of the mobile menu.

//HERO FULLSCREEN VARIABLE
var hero_full_screen = true; //If true, the hero section will fit to screen size. If false, hero height will be the height of its content.

//HERO BACKGROUND SLIDESHOW IMAGES
var slidehow_images = ["https://via.placeholder.com/1920x1080.png"];

//CONTACT FORM VARIABLES
var contact_form_success_msg = "Form successfully submitted! :)";
var contact_form_error_msg = "Error sending message :(";
var contact_form_recaptcha_error_msg = "Error verifying reCaptcha!";

//GOOGLE MAP VARIABLES
var map_canvas_id = "map_canvas_full"; //The HTML "id" of the map canvas
var map_color = "#8eaeba"; //Google map color
var map_initial_zoom = 12; //The initial zoom when Google map loads
var map_initial_latitude = 18.534435782561737; //Google map initial Latitude. If "null", the latitude of the first marked will be used
var map_initial_longitude = 73.82970736745179; //Google map initial Longitude. If "null", the longitude of the first marked will be used
var use_default_map_style = false; //If true, default map style will be used

//List of map markers
var map_markers = [
  {
    title: "Marigold Banquets",
    latitude: 18.506916440523185,
    longitude: 73.76322371153252,
    icon: "bell-solid",
    infoWindow: `<a href="https://goo.gl/maps/aBjBSUcrUri7AmHY6" target="_blank">Marigold Banquets</a><br />Mehendi, Reception`
  },
  {
    title: "Oxford Golf Resort",
    latitude: 18.526120368520903,
    longitude: 73.74432175293002,
    icon: "bell-solid",
    infoWindow: `<a href="https://goo.gl/maps/Hx3wpUPoW4cEuf7S8" target="_blank">Orchid Hotel at Oxford Golf Resort</a><br />Haldi, Wedding`
  },
  {
    title: "Pune International Airport",
    latitude: 18.579342982532584,
    longitude: 73.90890606738635,
    icon: "plane-solid",
    infoWindow: `Pune International Airport (PNQ)`
  },
  {
    title: "Sayaji Hotel",
    latitude: 18.59965497671358,
    longitude: 73.75493319679045,
    icon: "bed-solid",
    infoWindow: `<a href="https://sayajihotels.com/our-hotels/sayaji-pune/" target="_blank">Sayaji Hotel</a><br />The recommended hotel for guests. Negotiated rates available with free breakfast. Easy to book rideshare to venues or Pune city.`
  }
];
