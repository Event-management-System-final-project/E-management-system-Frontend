<template>
  <GMapMap
    :center="{ lat: eventLat, lng: eventLng }"
    :zoom="15"
    style="width: 100%; height: 400px"
  >
    <GMapMarker :position="{ lat: eventLat, lng: eventLng }" />
  </GMapMap>
</template>

<script setup>
const eventLat = 9.03 // Example: Addis Ababa latitude
const eventLng = 38.74 // Example: Addis Ababa longitude
</script>
