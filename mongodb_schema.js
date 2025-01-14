const mongoose = require('mongoose');

const muridSchema = new mongoose.Schema({
  angkatan: { type: Number, required: true },
  kelas_kelas: [
    {
      kelas: { type: String, required: true },
      murid_murid: [
        {
          nama: { type: String, required: true },
          percakapan: [
            {
              bersama: { type: String, required: true },
              isi_percakapan: [
                {
                  pengirim: { type: String, required: true },
                  waktu: { type: String, required: true },
                  konten: { type: String, required: true },
                  terbaca: { type: Boolean, required: true }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

// Model untuk schema Angkatan
const mongodb_schema = mongoose.model('all-chat-data', muridSchema, 'all-chat-data');

module.exports = mongodb_schema;
