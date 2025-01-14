const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const fs_extra = require('fs-extra');
const multer = require('multer');
const chokidar = require('chokidar');
const mongoose = require('mongoose');
const db_mongodb = require('./mongodb_schema');
const io = require('socket.io')(3001, {
    cors: {
        origin: "*"
    }
});

mongoose.connect('mongodb://localhost:27017/chat')
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const app = express();  
const db = new sqlite3.Database('database.db');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }));

app.use(express.static(path.join(__dirname, 'public')));

const invalid_value = {
    slash: "2F",
    backslash: "5C",
    star: "2A",
    questionMark: "3F",
    doubleQuotes: "22",
    lessThan: "3C",
    colon: "3A",
    moreThan: "3E",
    or: "7C",
    hash: "23",
};

function SwapChar(string, toValid) {
    let result = string;
    if (toValid) {
      // Replace invalid characters with their valid representations
        result = result
            .replace(/\//g, invalid_value.slash)
            .replace(/\\/g, invalid_value.backslash)
            .replace(/\*/g, invalid_value.star)
            .replace(/\?/g, invalid_value.questionMark)
            .replace(/"/g, invalid_value.doubleQuotes)
            .replace(/</g, invalid_value.lessThan)
            .replace(/:/g, invalid_value.colon)
            .replace(/>/g, invalid_value.moreThan)
            .replace(/\|/g, invalid_value.or)
            .replace(/#/g, invalid_value.hash);
    } else {
     // Replace valid representations with their original invalid characters
        let temp = result;
        let ganti_char_beblum_finish = true;
        while (ganti_char_beblum_finish) {
            result = result
            .replace(invalid_value.slash, "/")
            .replace(invalid_value.backslash, "\\")
            .replace(invalid_value.star, "*")
            .replace(invalid_value.questionMark, "?")
            .replace(invalid_value.doubleQuotes, '"')
            .replace(invalid_value.lessThan, "<")
            .replace(invalid_value.colon, ":")
            .replace(invalid_value.moreThan, ">")
            .replace(invalid_value.or, "|");
            ganti_char_beblum_finish = temp !== result;
            temp = result;
        }
    }

    for (let i = 0; i < result.length; i++) {

    }

    return result;
}

// 

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Login', 'index.html'));
});

app.post('/auth', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM user_pass WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
        } else if (row) {
            res.json({ success: true, username: row.username, user: row });
        } else {
            res.json({ success: false, message: 'Nama atau Password salah.' });
        }
    });
});

app.get('/menu_page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Menu_Page', 'index.html'));
});

app.post('/person', (req, res) => {
    const { sessionData } = req.body;

    db.get('SELECT * FROM Nama_User WHERE nama = ?', [sessionData], (err, row) => {
        if (err) {
            res.status(500).json({message: 'Terjadi Kesalahan'});
        } else if (row) {
            res.json({ NamaLengkap : row.namaLengkap, auth: row.authorization});
        } else {
            res.status(404).json({message: 'File Tidak ditemukan'})
        }
    })
});

app.get('/artikel/', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    res.sendFile(path.join(__dirname, 'public', 'Artikel', 'index.html'));
});

app.post('/authorization', (req, res) => {
    const { sessionData } = req.body;

    db.get('SELECT * FROM Nama_User WHERE nama = ?', [sessionData], (err, row) => {
        if (err) {
            res.status(500).json({ error : `Terjadi error: ${err}`});
        } else if (row) {
            res.json({ otorisasi : row.authorization });
        } else {
            res.status(404).json({ error : "File tidak ditemukan" });
        }
    })
})

app.get('/artikel/tambah_artikel/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Admin_Tambah_Artikel', 'index.html'));
});
app.use('/artikel/tambah_artikel/', express.static(path.join(__dirname, 'public', 'Admin_Tambah_Artikel')));

app.post('/new-article/', (req, res) => {
    const path_ke_artikel_baru = path.join(__dirname, 'docs', 'artikel', req.body.user, 'private');

    const isi_path = fs.readdirSync(path_ke_artikel_baru);
    let ketemu = isi_path.find(folder => folder === req.body.title);
    let name_folder = 'untitled';
    let i = 1;
    while (ketemu) {
        name_folder = `${req.body.title}-${i}`;
        ketemu = isi_path.find(folder => folder === name_folder);
        i++;
    }
    
    async function createFolder(folderName) {
        const dummy_folder = path.join(__dirname, 'private', 'dummy');
        const destination_folder = path.join(path_ke_artikel_baru, folderName);
        await fs_extra.copy(dummy_folder, destination_folder);

        const new_folder_json = JSON.parse(fs.readFileSync(path.join(path_ke_artikel_baru, name_folder, 'isi.json'), 'utf-8'));
        const today = new Date();

        let year = today.getFullYear();
        let month = (today.getMonth() + 1).toString();
        let day = today.getDate().toString();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day
        }
        new_folder_json.config.created = `${year}-${month}-${day}`;
        fs.writeFileSync(path.join(path_ke_artikel_baru, name_folder, 'isi.json'), JSON.stringify(new_folder_json), 'utf-8');
    }

    createFolder(name_folder);

    res.json({ link : name_folder })
});

app.get('/editor-artikel/:id/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Admin_Editor_Artikel'));
});
app.use('/editor-artikel/:id/', express.static(path.join(__dirname, 'public', 'Admin_Editor_Artikel')));
app.post('/editor-artikel/:id/', (req, res) => {
    const user_path = path.join(__dirname, 'docs', 'artikel', req.body.data);
    const pathsToCheck = ['private', 'public'];

    function retrieveIsiJson(path_ke_json) {
        return JSON.parse(fs.readFileSync(path_ke_json));
    }

    for (const subdir of pathsToCheck) {
        const user_path_subdir = path.join(user_path, subdir);

        if (fs.existsSync(user_path_subdir)) {
            const folders = fs.readdirSync(user_path_subdir);

            for (const folder of folders) {
                if (folder === req.params.id) {
                    const filePath = path.join(user_path_subdir, folder, 'isi.json');
                    if (fs.existsSync(filePath)) {
                        return res.json(retrieveIsiJson(filePath));
                    }
                }
            }
        }
    }

    res.status(404).json({ error: 'Folder not found' });
});
app.post('/editor-artikel/:id/upload-gambar/:user/:jenisGambar/', (req, res) => {
    const path_menyimpan_gambar = path.join(__dirname, 'docs', 'artikel', req.params.user);
    const paths = ['private', 'public'];
    function simpanGambar(path_to_store, fileName) {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path_to_store);
            },
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                cb(null, fileName + ext);
            }
        });

        return multer({ storage: storage }).single('file');
    }

    let right_path;
    for (const location of paths) {
        const direktori = path.join(path_menyimpan_gambar, location);
        const isi_direktori = fs.readdirSync(direktori);

        if (isi_direktori.find(folder => folder === req.params.id)) {
            right_path = path.join(direktori, isi_direktori.find(folder => folder === req.params.id));
            break;
        }
    }

    if (req.params.jenisGambar === 'sampul') {
        const sampul_exist = fs.readdirSync(right_path).find(file => path.parse(file).name === 'sampul');
        if (sampul_exist) {
            fs.unlinkSync(path.join(right_path, sampul_exist));
        }
        const upload = simpanGambar(right_path, 'sampul');

        upload(req, res, (err) => {
            if (err) {
                res.status(400).json({ error : err.message })
            } 
            if (req.file) {
                const name_sampul = fs.readdirSync(right_path).find(file => path.parse(file).name === 'sampul');
                res.json({ sampul : name_sampul })
            } else {
                res.status(400).json({ error : "Upload fail." })
            }
        })
    } else {
        const path_simpan_image = path.join(right_path, 'Image');

        const gambar_exist = fs.readdirSync(path_simpan_image).find(image => path.parse(image).name === req.params.jenisGambar);
        if (gambar_exist) {
            fs.unlinkSync(path.join(path_simpan_image, gambar_exist));
        }

        const upload = simpanGambar(path_simpan_image, req.params.jenisGambar);

        upload(req, res, (err) => {
            if (err) {
                res.status(400).json({ error : err.message });
            } else if (req.file) {
                const nama_gambar = fs.readdirSync(path_simpan_image).find(image => path.parse(image).name === req.params.jenisGambar);
                res.json({ gambar : nama_gambar });
            } else {
                res.status(400).json({ error: "Upload fail" });
            }
        })
    }
})

app.post('/editor-artikel/simpan-artikel/:id/:user/', (req, res) => {
    const json_from_front_end = req.body;
    const dirs = ['private', 'public'];
    let user_path;
    let path_ke_folder_artikel;
    for (const subdir of dirs) {
        try {
            path_ke_folder_artikel = path.join(__dirname, 'docs', 'artikel', req.params.user, subdir, req.params.id);
            user_path = path.join(__dirname, 'docs', 'artikel', req.params.user, subdir);
            if (fs.existsSync(path_ke_folder_artikel)) {
                break;
            }
        } catch {}
    }

    let json_path = path.join(path_ke_folder_artikel, 'isi.json');
    fs.writeFileSync(json_path, JSON.stringify(json_from_front_end), 'utf-8');
    
    const judul_buat_ganti_nama_folder = SwapChar(json_from_front_end.data[0].judul, true)
    const path_buat_ganti_nama_folder = path.join(user_path, judul_buat_ganti_nama_folder);
    try {

        const temp = json_from_front_end.data.filter(element => {
            if (Object.keys(element)[0] === 'gambar') {
                return element;
            }
        }).map(element => element.gambar);
        const isi_folder_image = fs.readdirSync(path.join(path_ke_folder_artikel, 'Image'));
        var tidak_terpakai = [];
        for (const file of isi_folder_image) {
            if (!temp.includes(file)) {
                tidak_terpakai.push(file)
            }
        }

        if (tidak_terpakai.length !== 0) {
            for (const item_buat_delete of tidak_terpakai) {
                try {
                    fs.unlinkSync(path.join(path_ke_folder_artikel, 'Image', item_buat_delete));
                } catch (err) {
                    console.error(err);
                }
            }
        }

        let sampul = fs.readdirSync(path_ke_folder_artikel).find(file => path.parse(file).name === 'sampul');
        if (json_from_front_end.data[1].sampul === "" && sampul) {
            fs.unlinkSync(path.join(path_ke_folder_artikel, sampul));
        }

        toggle_watcher_artikel_muat_data(false, () => {
            fs.renameSync(path_ke_folder_artikel, path_buat_ganti_nama_folder);
            toggle_watcher_artikel_muat_data(true)
        });

        res.send({ link : judul_buat_ganti_nama_folder});
    } catch (error) {
        console.error(error)
        res.send({ info : "Artikel sudah ada dengan judul yang sama. Ganti judul artikel." })
    }
});

app.post('/editor-artikel/:id/ambil-gambar/', (req, res) => {
    const permintaan = req.body.gambar;
    const pengguna = req.body.pengguna;
    const lokasi = req.params.id;
    const dirs = ['public', 'private'];
    let lokasi_gambar;
    let stream_gambar;
    let direktori;

    for (const subdir of dirs) {
        direktori = fs.readdirSync(path.join(__dirname, 'docs', 'artikel', pengguna, subdir));
        if (direktori.find(folder => folder === lokasi)) {
            direktori = path.join(__dirname, 'docs', 'artikel', pengguna, subdir, lokasi);
            break;
        }
    }

    try {
        if (path.parse(permintaan).name === 'sampul') {
            lokasi_gambar = path.join(direktori, permintaan);
        } else {
            lokasi_gambar = path.join(direktori, 'Image', permintaan)
        }
        
        stream_gambar = fs.createReadStream(lokasi_gambar);
        res.setHeader("Content-Type", `image/${path.parse(permintaan).ext.split('.')[1]}`);
        stream_gambar.pipe(res);

    } catch (error) {

        if (error.code === 'ERR_INVALID_ARG_TYPE') {
            const buffer_kosong = Buffer.from('');
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Length', buffer_kosong);
            res.send(buffer_kosong);
        }

    }
});

app.post('/editor-artikel/:id/kirim-gambar-logo/', async (req, res) => {
    const lokasi_logo = path.join(__dirname, 'public', 'Admin_Editor_Artikel', 'Data', 'Gambar', 'logo-instansi', req.body.type, req.body.tag + '.png');
    const subdirs = ['private', 'public'];
    const user = req.body.user;
    const id = req.params.id;
    var lokasi;

    for (const dir of subdirs) {
        lokasi = path.join(__dirname, 'docs', 'artikel', user, dir, id)

        if (fs.existsSync(lokasi)) {
            break;
        } else {
            continue;
        }
    }

    lokasi = path.join(lokasi, 'logo.png');

    await fs_extra.copy (lokasi_logo, lokasi, (err) => {
        if (err) {
            console.error(err);
        } else {
            res.json({message: "Logo imported"})
        }
    })
});

app.post('/artikel/files/', (req, res) => {
    const lokasi = path.join(__dirname, 'docs', 'artikel', req.body.sessionData);
    const subdirs = ['private', 'public'];
    var private;
    var public;
    var temp;
    var data;

    try {
        subdirs.forEach(dir => {
            temp = fs.readdirSync(path.join(lokasi, dir));
            if (dir === 'private') {
                private = temp;
            } else if (dir === 'public') {
                public = temp;
            }
        });

        data = {
            "private" : private,
            "public" : public
        };
        res.send(data);
    } catch (err) {
        let path_user = path.join(__dirname, 'docs', 'artikel', req.body.sessionData)
        res.send('Pengguna baru...');
        fs.mkdirSync(path.join(path_user, 'private'), {recursive: true})
        fs.mkdirSync(path.join(path_user, 'public'), {recursive: true})
    }
});

app.post('/artikel/display/', (req, res) => {
    const tipe = req.body.tipe;
    const judul = req.body.judul;
    const user = req.body.user;
    const jalur = path.join(__dirname, 'docs', 'artikel', user, tipe, judul);
    const data = JSON.parse(fs.readFileSync(path.join(jalur, 'isi.json'), 'utf-8'));
    const judul_dari_json = data.data[0].judul;
    const sampul = fs.readdirSync(jalur).find(file => path.parse(file).name === 'sampul');
    const logo = fs.readdirSync(jalur).find(file => path.parse(file).name === 'logo');
    const buat_dikirim = {
        judul : judul_dari_json,
        link : judul,
        nama_instansi : data.config.tag[1],
        sampul : sampul !== undefined ? `/artikel/display/ambil-gambar/${user}/${tipe}/${judul}/${sampul}/` : null,
        logo : logo !== undefined ? `/artikel/display/ambil-gambar/${user}/${tipe}/${judul}/${logo}/` : null,
        publicDate : data.config.publicDate
    };

    res.send(buat_dikirim);
});

app.get('/artikel/display/ambil-gambar/:user/:tipe/:judul/:gambar/', (req, res) => {
    res.setHeader("Content-Type", `image/${path.parse(req.params.gambar).ext.split('.')[1]}`);
    fs.createReadStream(path.join(__dirname, 'docs', 'artikel', req.params.user, req.params.tipe, req.params.judul, req.params.gambar)).pipe(res);
});

app.post('/artikel/a/hapus-artikel/', (req, res) => {
    const user = req.body.user;
    const nama_artikel = req.body.data.split('-')[0];
    const tipe_artikel = req.body.data.split('-')[1];

    try {
        fs.rmSync(path.join(__dirname, 'docs', 'artikel', user, tipe_artikel, nama_artikel), {recursive: true})
        res.json({status: "OK"});
    } catch (err) {
        res.json({status: `ERR: ${err}`});
        console.log(err);
    }
});

app.post('/editor-artikel/p/publikasikan-depublikasikan/', (req, res) => {
    let judul_artikel = req.body.ingin_diapakan.replace(/%20/g, ' ')
    const path_artikel_dipublikasikan_depublikasikan = path.join(__dirname, 'docs', 'artikel', req.body.user, req.body.tipe, judul_artikel);
    const tujuan = path.join(__dirname, 'docs', 'artikel', req.body.user, req.body.tipe === 'public' ? 'private' : 'public', judul_artikel);
    const today = new Date();
    let year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();
    let temp_json;

    async function pindahkan_direktori(asal, tujuan) {
        try {
            toggle_watcher_artikel_muat_data(false, async () => {
                await fs_extra.move(asal, tujuan, {overwrite: false, recursive: true});
                toggle_watcher_artikel_muat_data(true)
            })
            res.json({message : "terkirim"});
        } catch (err) {
            res.json({message : `Artikel yang ingin di ${req.body.tipe === 'public' ? 'depublikasikan' : 'publikasikan'} sudah ada. Coba ganti judulnya atau hapus artikel yang sudah ada`, error: JSON.stringify(err)});
            console.error(err);
        }
    }

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day
    }

    
    temp_json = JSON.parse(fs.readFileSync(path.join(path_artikel_dipublikasikan_depublikasikan, 'isi.json'), 'utf-8'));
    if (req.body.tipe === 'private') {
        temp_json['config']['publicDate'] = `${year}-${month}-${day}`;
    } else if (req.body.tipe === 'public') {
        temp_json['config']['publicDate'] = '';
    }
    fs.writeFileSync(path.join(path_artikel_dipublikasikan_depublikasikan, 'isi.json'), JSON.stringify(temp_json), 'utf-8');

    pindahkan_direktori(path_artikel_dipublikasikan_depublikasikan, tujuan);
});

let watcher_artikel_muat_data = chokidar.watch(path.join(__dirname, 'docs', 'artikel'), { persistent: true, ignoreInitial: true });
var memo_artikel_muat_data = null;

function handle_watcher_artikel_muat_data(event, path) {
    memo_artikel_muat_data = null
}

watcher_artikel_muat_data.on('all', handle_watcher_artikel_muat_data);

function toggle_watcher_artikel_muat_data(toggle, callback) {
    if (toggle) {
        watcher_artikel_muat_data = chokidar.watch(path.join(__dirname, 'docs', 'artikel'));
        if (callback) callback();
    } else {
        memo_artikel_muat_data = null;
        watcher_artikel_muat_data.close().then(callback).catch((err) => {
            console.error(err);
        })
    }
}

app.get(`/artikel/p/muat-data/`, (req, res) => {
    if (memo_artikel_muat_data !== null) return res.json(JSON.parse(memo_artikel_muat_data))

    let path_ke_docs = path.join(__dirname, 'docs', 'artikel');
    let isi_direktori_artikel_terpublikasi;
    let tampungan_artikel = [];
    let admin_artikel = fs.readdirSync(path_ke_docs);

    admin_artikel.forEach(admin => {
        isi_direktori_artikel_terpublikasi = fs.readdirSync(path.join(path_ke_docs, admin, 'public'));
        isi_direktori_artikel_terpublikasi.forEach(artikel => {
            tampungan_artikel.push({
                pembuat : admin,
                judul_artikel : artikel
            });
        });
    
    });

    tampungan_artikel = tampungan_artikel.map(data => {
        let jalur_ke_data_artikel = path.join(path_ke_docs, data.pembuat, 'public', data.judul_artikel);
        let data_artikel = JSON.parse(fs.readFileSync(path.join(jalur_ke_data_artikel, 'isi.json'), 'utf-8'));
        let nama_instansi = data_artikel.config.tag;
        let tanggal = data_artikel.config.publicDate;
        let sampul = data_artikel.data[1].sampul !== "" ? path.join(jalur_ke_data_artikel, data_artikel.data[1].sampul) : null;
        let logo = path.join(jalur_ke_data_artikel, fs.readdirSync(path.join(jalur_ke_data_artikel)).find(file => path.parse(file).name === 'logo'));
        let judul = data_artikel.data[0].judul;
        let jenis_instansi = data_artikel.config.type
        let data_yang_telah_diambil = {
            judul : judul,
            sampul : sampul,
            logo: logo,
            jenis_instansi : jenis_instansi,
            nama_instansi: nama_instansi,
            tanggal: tanggal,
            link: JSON.stringify([data.pembuat, data.judul_artikel])
        }

        return data_yang_telah_diambil;
    });


    memo_artikel_muat_data = JSON.stringify(tampungan_artikel);
    res.json(tampungan_artikel);
});

app.post('/artikel/muat-data/ambil-gambar/', (req, res) => {
    res.setHeader("Content-Type", `image/.${path.parse(req.body.image).ext}`);
    fs.createReadStream(req.body.image).pipe(res);
});

app.get('/artikel/:lihat/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Artikel_Viewer', 'index.html'))
});
app.use('/artikel/:lihat', express.static(path.join(__dirname, 'public', 'Artikel_Viewer')));

app.post('/artikel/ambil-data/', (req, res) => {
    let nama_nama_bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    let jalur_ke_artikel = path.join(__dirname, 'docs', 'artikel', req.body[0], 'public', req.body[1]);
    let file_file_artikel = fs.readdirSync(jalur_ke_artikel);
    let data_artikel = JSON.parse(fs.readFileSync(path.join(jalur_ke_artikel, 'isi.json'), 'utf-8'));
    let logo = path.join(jalur_ke_artikel, file_file_artikel.find(file => path.parse(file).name === 'logo'));
    let nama_instansi = data_artikel.config.tag[1];
    let tanggal_upload = data_artikel.config.publicDate.split('-');
    let hari = new Date(tanggal_upload.join('-')).toLocaleDateString('id-ID', {weekday: 'long'});
    let tanggal = `${tanggal_upload[2]} ${nama_nama_bulan[parseInt(tanggal_upload[1]) - 1]} ${tanggal_upload[0]}`
    let pack = {
        data: data_artikel.data,
        logo: logo,
        nama_instansi: nama_instansi,
        tanggal_upload:  `${hari}, ${tanggal}`
    };

    res.json(pack)
});

app.post('/artikel/viewer/ambil-gambar/', (req, res) => {
    let kunci = Object.keys(req.body)[0];
    res.setHeader("Content-Type", `image/.${path.parse(req.body[kunci]).ext}`)
    if (kunci === 'logo') {;
        fs.createReadStream(req.body.logo).pipe(res)
    } else if (kunci === 'sampul' && req.body[kunci] !== '') {
        fs.createReadStream(path.join(__dirname, 'docs', 'artikel', req.body.lokasi[0], 'public', req.body.lokasi[1], req.body[kunci])).pipe(res);
    } else if (kunci === 'gambar' && req.body[kunci] !== '') {
        fs.createReadStream(path.join(__dirname, 'docs', 'artikel', req.body.lokasi[0], 'public', req.body.lokasi[1], 'Image', req.body[kunci])).pipe(res);
    }
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Chat', 'index.html'))
});
app.use(express.static(path.join(__dirname, 'public', 'Chat')));

io.on('connection', socket => {
    console.log(socket.id);
    socket.emit('chat-message', 'Hello World!');
});  

app.post('/p/chat-load', (req, res) => {
    db.get('SELECT * FROM Nama_User WHERE nama = ?', [req.body.user], async (err, row) => {
        if (err) {
            res.status(500).json({success :false, error: err});
        } else if (row) {
            const status = row.sebagai;
            if (status === 'murid') {
                const doc = await db_mongodb.findOne(
                    {
                        angkatan: row.angkatan,
                        'kelas_kelas.kelas': row.kelas,
                        'kelas_kelas.murid_murid.nama': row.namaLengkap
                    },
                    {
                        kelas_kelas: {
                            $elemMatch: {
                                kelas: row.kelas,
                                murid_murid: {
                                    $elemMatch: {
                                        nama: row.namaLengkap
                                    }
                                }
                            }
                        }
                    }
                );
                let selected_doc;
                try {
                    selected_doc = doc.kelas_kelas[0].murid_murid.find(murid => murid.nama === row.namaLengkap);
                    res.send({success: true, data: selected_doc, status: status});
                } catch (err) {
                    res.status(500).json({success: false, error: err});
                }
            }
        } else {
            console.error("File hilang");
        }
    })
});

app.listen(3000,  () => {
    console.log('Menjalankan server di http://localhost:3000')
});