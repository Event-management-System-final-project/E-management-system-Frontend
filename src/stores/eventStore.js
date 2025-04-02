// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { useAuthStore } from './authStore'
// import axios from 'axios'

// export const useEventstore = defineStore('event', () => {
//   const events = ref([])
//   const event = ref(null)
//   const authStore = useAuthStore()
  
//   //function to fetch all events
//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/api/events')
//       events.value = response.data
//     } catch (error) {
//       console.error('Error fetching events: ', error)
//     }
//   }

//   //function to fetch a specific event
//   const fetchEvent = async (event_id) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/api/events/${event_id}`)
//       event.value = response.data
//     } catch (error) {
//       console.error('Error fetching event:', error)
//     }
//   }

//   //function to add events for the organizer
//   const addEvent = async (formData) => {
//     try {
//       const response = await axios.post('http://localhost:8000/api/events/create', formData, {
//         headers: {
//           Authorization: `Bearer ${authStore.token}`, //sending token in headers
//           'Content-Type': 'multipart/form-data', // Tells server we are sending JSON
//         },
//       })
//       console.log('Successfully created',response.data)
//     } catch (error) {
//       console.error('Error adding event:', error)
//     }
//   }

//   return { events, event, fetchEvents, fetchEvent, addEvent }
// })
