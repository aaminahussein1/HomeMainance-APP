const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v >= new Date(Date.now() - 86400000),
        message: 'Booking date cannot be in the past',
      },
    },

    startTime: {
      type: String,
      required: true,
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid time format (HH:mm)',
      ],
    },

    endTime: {
      type: String,
      required: true,
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid time format (HH:mm)',
      ],
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },

    issueDescription: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    images: [String],

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'USA' },
    },

    notes: {
      type: String,
      maxlength: 500,
    },

    cancellationReason: {
      type: String,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ serviceProvider: 1, bookingDate: 1, startTime: 1 });
bookingSchema.index({ status: 1, bookingDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
