import api from './api';

const bookingService = {
  /**
   * 1. Abuuri ballan cusub (Hadda lacag la'aan ah)
   */
  create: async (bookingData) => {
    // Waxaan hubinaa inaan 'totalPrice' loo dirin backend-ka
    const { totalPrice, ...cleanData } = bookingData; 
    const response = await api.post('/bookings', cleanData);
    return response.data?.data || response.data || response;
  },

  /**
   * 2. Soo aqri ballamaha macmiilka (Dashboard)
   */
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data?.data || response.data || [];
  },

  /**
   * 3. Ka hortagga TypeError (Magaca la midka ah BookingsPage)
   */
  getUserBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data?.data || response.data || [];
  },

  /**
   * 4. Soo rido ballan gaar ah ID-giisa
   */
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data?.data || response.data || response;
  },

  /**
   * 5. Beddel xaaladda ballanta (Approved -> Completed -> etc.)
   */
  updateStatus: async (id, status) => {
    // Hubi in endpoint-ka backend-ka uu yahay /bookings/status/:id ama /bookings/:id/status
    const response = await api.put(`/bookings/status/${id}`, { status });
    return response.data?.data || response.data || response;
  }
};

export { bookingService };
export default bookingService;