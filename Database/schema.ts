"use strict";

import mongoose from 'mongoose';

export default mongoose.model('expenser', new mongoose.Schema({
    id: String,
    username: String,
    expenses: Array,
    monthly_report: Array
}));