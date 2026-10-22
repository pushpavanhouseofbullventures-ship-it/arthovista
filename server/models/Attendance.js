const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  checkIn: {
    time: {
      type: Date
    },
    gps: {
      lat: Number,
      lng: Number,
      address: String
    },
    deviceInfo: String,
    browser: String,
    ip: String,
    faceVerified: {
      type: Boolean,
      default: false
<<<<<<< HEAD
    },
    livenessVerified: {
      type: Boolean,
      default: false
=======
>>>>>>> origin/main
    }
  },
  checkOut: {
    time: {
      type: Date
    },
    gps: {
      lat: Number,
      lng: Number,
      address: String
    },
    deviceInfo: String,
    browser: String,
<<<<<<< HEAD
    ip: String,
    faceVerified: {
      type: Boolean,
      default: false
    },
    livenessVerified: {
      type: Boolean,
      default: false
    }
=======
    ip: String
>>>>>>> origin/main
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Half Day', 'Absent', 'Leave', 'Holiday', 'Weekend'],
    default: 'Absent'
  },
  workHours: {
    type: Number,
    default: 0
  },
  overtime: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
<<<<<<< HEAD
AttendanceSchema.index({ employee: 1, createdAt: -1 });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ status: 1 });
=======
>>>>>>> origin/main

module.exports = mongoose.model('Attendance', AttendanceSchema, 'Employee_Attendance');
