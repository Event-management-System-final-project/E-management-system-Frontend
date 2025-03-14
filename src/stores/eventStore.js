import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useEventstore = defineStore('event', () => {
  const events = ref([])
  const event = ref(null)

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events')
      events.value = response.data
    } catch (error) {
      console.error('Error fetching events: ', error)
    }
  }

  const fetchEvent = async (event_id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/events/${event_id}`)
      event.value = response.data
    } catch (error) {
      console.error('Error fetching event:', error)
    }
  }
  return { events, event, fetchEvents, fetchEvent }
})
