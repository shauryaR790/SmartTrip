// WAIT UNTIL PAGE LOADS
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     FLIGHT FILTERS
  ========================= */

  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");

  const direct = document.getElementById("direct");
  const onestop = document.getElementById("onestop");

  const airlineCheckboxes = document.querySelectorAll(".airline");
  const flights = document.querySelectorAll(".flight-card");

  if (priceRange && priceValue && flights.length > 0) {

    priceRange.addEventListener("input", () => {
      priceValue.innerText = priceRange.value;
      filterFlights();
    });

    if (direct) direct.addEventListener("change", filterFlights);
    if (onestop) onestop.addEventListener("change", filterFlights);

    airlineCheckboxes.forEach(cb => {
      cb.addEventListener("change", filterFlights);
    });

    function filterFlights() {
      const maxPrice = parseInt(priceRange.value);

      const selectedAirlines = Array.from(airlineCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      flights.forEach(flight => {
        const price = parseInt(flight.dataset.price || 0);
        const stops = flight.dataset.stops;
        const airline = flight.dataset.airline;

        let show = true;

        if (price > maxPrice) show = false;

        if (direct && direct.checked && stops !== "direct") show = false;
        if (onestop && onestop.checked && stops !== "1stop") show = false;

        if (selectedAirlines.length > 0 && !selectedAirlines.includes(airline)) {
          show = false;
        }

        flight.style.display = show ? "flex" : "none";
      });
    }
  }

  /* =========================
     HOTEL FILTERS
  ========================= */

  const hotelPriceRange = document.getElementById("hotelPriceRange");
  const hotelPriceValue = document.getElementById("hotelPriceValue");

  const ratingCheckboxes = document.querySelectorAll(".rating");
  const amenityCheckboxes = document.querySelectorAll(".amenity");
  const hotelCards = document.querySelectorAll(".hotel-card");

  if (hotelPriceRange && hotelPriceValue && hotelCards.length > 0) {

    hotelPriceRange.addEventListener("input", () => {
      hotelPriceValue.innerText = hotelPriceRange.value;
      filterHotels();
    });

    ratingCheckboxes.forEach(cb => cb.addEventListener("change", filterHotels));
    amenityCheckboxes.forEach(cb => cb.addEventListener("change", filterHotels));

    function filterHotels() {
      const maxPrice = parseInt(hotelPriceRange.value);

      const selectedRatings = Array.from(ratingCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.value));

      const selectedAmenities = Array.from(amenityCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      hotelCards.forEach(card => {

        const price = parseInt(card.dataset.price || 0);
        const rating = parseInt(card.dataset.rating || 0);
        const amenities = (card.dataset.amenities || "").split(",");

        let show = true;

        if (price > maxPrice) show = false;

        if (selectedRatings.length > 0 &&
            !selectedRatings.some(r => rating >= r)) {
          show = false;
        }

        if (selectedAmenities.length > 0 &&
            !selectedAmenities.every(a => amenities.includes(a))) {
          show = false;
        }

        card.style.display = show ? "flex" : "none";
      });
    }
  }

});


/* =========================
   SELECT FUNCTIONS
========================= */

function selectFlight(flight){
  localStorage.setItem("flight", flight);
  window.location.href = "summary.html";
}

function selectHotel(hotel){
  localStorage.setItem("hotel", hotel);
  window.location.href = "summary.html";
}


/* =========================
   SUMMARY PAGE LOGIC
========================= */

function loadSummary(){

  const trip = JSON.parse(localStorage.getItem("trip"));
  const flight = localStorage.getItem("flight");
  const hotel = localStorage.getItem("hotel");

  // TRIP
  if(trip && document.getElementById("tripBox")){
    document.getElementById("tripBox").innerHTML = `
      <h3>Trip Details</h3>
      <p><b>From:</b> ${trip.from}</p>
      <p><b>To:</b> ${trip.to}</p>
      <p><b>Date:</b> ${trip.depart}</p>
      <p><b>Travelers:</b> ${trip.travelers}</p>
    `;
  }

  // FLIGHT
  if(flight && document.getElementById("flightBox")){
    document.getElementById("flightBox").innerHTML = `
      <h3>Selected Flight</h3>
      <p>${flight}</p>
    `;
  }

  // HOTEL
  if(hotel && document.getElementById("hotelBox")){
    document.getElementById("hotelBox").innerHTML = `
      <h3>Selected Hotel</h3>
      <p>${hotel}</p>
    `;
  }

  /* =========================
     TOTAL PRICE CALCULATION
  ========================= */

  let total = 0;

  if(flight){
    const flightPrice = parseInt(flight.match(/\d+/g).join(""));
    total += flightPrice;
  }

  if(hotel){
    const hotelPrice = parseInt(hotel.match(/\d+/g).join(""));
    total += hotelPrice;
  }

  if(document.getElementById("totalBox")){
    document.getElementById("totalBox").innerHTML = `
      <h3>Total Cost</h3>
      <p><b>₹${total}</b></p>
    `;
  }
}

function toggleMenu(){
  document.getElementById("navLinks").classList.toggle("show");
}


const links = document.querySelectorAll(".nav-links a");
const current = window.location.pathname.split("/").pop();

links.forEach(link => {
  if(link.getAttribute("href") === current){
    link.classList.add("active");
  }
});


function goTo(page){
  window.location.href = page;
}

function searchFlights(){

  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const depart = document.getElementById("depart").value;
  const returnDate = document.getElementById("return").value;
  const travellers = document.getElementById("travellers").value;

  // SAVE DATA
  const trip = {
    from,
    to,
    depart,
    returnDate,
    travellers
  };

  localStorage.setItem("trip", JSON.stringify(trip));

  // REDIRECT
  window.location.href = "booking.html";
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

function goTo(page) {
  window.location.href = page;
}

function searchFlights() {

  const from = document.getElementById("from")?.value;
  const to = document.getElementById("to")?.value;
  const depart = document.getElementById("depart")?.value;
  const returnDate = document.getElementById("return")?.value;
  const travelers = document.getElementById("travelers")?.value;

  if (!from || !to) {
    alert("Enter From and To locations");
    return;
  }

  const trip = {
    from,
    to,
    depart,
    returnDate,
    travelers
  };

  localStorage.setItem("trip", JSON.stringify(trip));

  window.location.href = "booking.html";
}
