document.addEventListener('DOMContentLoaded', function() {
    //Nama Lengkap Pengguna====================================================
    const user_data = JSON.parse(window.sessionStorage.getItem('user'));
    if (user_data) {
        fetch('/person', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ sessionData: user_data.username })
        })
        .then(response => response.json())
        .then(data => {
            let nama_user = document.getElementById('teks-nama-user');
            nama_user.innerHTML = data.NamaLengkap;

            let rect = nama_user.getBoundingClientRect();
            let textWidth = rect.width;

            let nama_dan_dropdown = document.getElementById('nama-dan-dropdown');
            let tombol_dropdown = document.getElementById('tombol-dropdown');

            let satuan = 0;
            if (textWidth >= 300) {
                satuan = 0.3;
            } else if (textWidth >= 61) {
                satuan = 0.5;
            } else {
                satuan = 0.8;
            }
            nama_dan_dropdown.style.width = `${textWidth + textWidth*satuan }px`;
            tombol_dropdown.style.width = `${textWidth + textWidth*satuan }px`;
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
    } else {
        window.location.href = '/login';
    }
    //=========================================================================

    //Toggle Sidebar===========================================================
    document.getElementById('nav-button').addEventListener('click', function() {
        let header = document.getElementsByTagName('header');
        let sidebar = document.querySelector('.sidebar');
        let gradien_sidebar = document.querySelector('header');
        let logo_bkonline_header = document.getElementById('gambar-logo-bkonline');
        let logo_bkonline_sidebar = document.getElementById('logo-bkonline-sidebar');
        let nav_button = document.getElementById('nav-button');
        let navbar = document.querySelector('.navbar');
        let navbar_1 = document.getElementById('navbar-1');
        let navbar_2 = document.getElementById('navbar-2');
        let navbar_3 = document.getElementById('navbar-3');
        let contents = document.querySelector('.contents');
        let teks_sidebar = document.querySelectorAll('.teks-nav');
        if (sidebar.style.width == '4%') {
            nav_button.style.left = '20%';
            header[0].style.width = '80%';
            sidebar.style.width = '20%';
            gradien_sidebar.classList.add('active');
            logo_bkonline_header.style.top = '-50px';
            contents.classList.add('active');
            navbar.style.marginLeft = '8px';
            navbar_1.style.transform = 'rotate(45deg)';
            navbar_1.style.top = '1.01895px';
            navbar_1.style.left = '3.01895px';
            navbar_2.style.opacity = '0';
            navbar_3.style.transform = 'rotate(-45deg)';
            navbar_3.style.bottom = '1.01895px';
            navbar_3.style.left = '3.01895px';
            setTimeout(() => {
                logo_bkonline_sidebar.style.top = '10px';
                setTimeout(() => {
                    teks_sidebar[0].style.left = '17%';
                    teks_sidebar[0].style.opacity = '1';
                    setTimeout(() => {
                        teks_sidebar[1].style.left = '17%';
                        teks_sidebar[1].style.opacity = '1';
                        setTimeout(() => {
                            teks_sidebar[2].style.left = '17%';
                            teks_sidebar[2].style.opacity = '1';
                            setTimeout(() => {
                                teks_sidebar[3].style.left = '17%';
                                teks_sidebar[3].style.opacity = '1';
                            }, 100)
                        }, 100)
                    }, 100)
                }, 300);
            }, 200);
        } else {
            nav_button.style.left = '0%';
            header[0].style.width = '96%';
            sidebar.style.width = '4%';
            contents.classList.remove('active');
            gradien_sidebar.classList.remove('active');
            logo_bkonline_header.style.top = '0px';
            logo_bkonline_sidebar.style.top = '-50%';
            navbar.style.marginLeft = '8px';
            navbar_1.style.transform = 'rotate(0deg)';
            navbar_1.style.top = '0px';
            navbar_1.style.left = '0px';
            navbar_2.style.opacity = '1';
            navbar_3.style.transform = 'rotate(0deg)';
            navbar_3.style.bottom = '0px';
            navbar_3.style.left = '0px';
            for (let i = 0; i < 4; i++) {
                teks_sidebar[i].style.left = '-100%';
                teks_sidebar[i].style.opacity = '0';
            }
            setTimeout(() => {
                for (let i = 0; i < 4; i++) {
                    teks_sidebar[i].style.left = '-100%';
                    teks_sidebar[i].style.opacity = '0';
                }
            }, 400);
        }
    })
    //=========================================================================

    //Tombol di Sidebar========================================================
    let pilihan1_sidebar = document.getElementById('pilihan1-sidebar');
    pilihan1_sidebar.addEventListener('click', () => {
        window.location.href = '/menu_page';
    });
    document.getElementById('pilihan1-sidebar').addEventListener('click', () => {
        window.location.href = '/artikel'
    })
    //=========================================================================

    //Tombol Logout============================================================
    document.getElementById('tombol-dropdown').addEventListener('click', () => {
        let logout = document.getElementById('tombol-logout');
        var chevron = document.getElementById('logo-chevron');
        if (logout.style.top == '-100%') {
            logout.style.top = '0%';
            chevron.style.transform = 'translate(0, 80%)';
            chevron.style.opacity = '0';
            setTimeout(() => {
                chevron.style.transform = 'translate(0, -90%)';
            }, 300);
        } else {
            logout.style.top = '-100%';
            chevron.style.transform = 'translate(0, 0)';
            setTimeout(() => {
                chevron.style.transform = 'translate(0, 0)';
            }, 301);
            chevron.style.opacity= '1';
        }
    });

    document.getElementById('tombol-logout').addEventListener('click', () => {
        sessionStorage.clear();
        location.reload();
    });
    //=========================================================================

    //Otorisasi================================================================
    fetch('/authorization', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ sessionData : user_data.username })
    })
    .then(response => response.json())
    .then(data => {
        if (data.otorisasi != 'admin') {
            window.location.href = '/artikel/';
        }
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
    //=========================================================================

    //Caution jika ingin reload================================================

    function memastikan() {
        event.preventDefault();
    }

    window.addEventListener('beforeunload', memastikan);
    //=========================================================================

    //Nested Dropdown==========================================================
    const jenis_instansi = document.getElementById('jenis-instansi');
    const nama_instansi = document.getElementById('nama-instansi');
    const tombol_memilih_nama_instansi = document.getElementById('tombol-memilih-nama-instansi');
    var pilihan2_nama_instansi;
    const event_target_load_save_file = new EventTarget();
    const trigger_load_save_file = new Event('triggerLoadSaveFile');
    fetch("Data/Data/nama-instansi.json")
    .then(response => response.json())
    .then(data => {
        pilihan2_nama_instansi = data.data;
        event_target_load_save_file.dispatchEvent(trigger_load_save_file);
    })
    .catch((error) => console.error('Terjadi error saat fetch data nama-instansi.json: ', error));

    jenis_instansi.addEventListener('change', () => {
        const jenis_instansi_yang_terpilih = jenis_instansi.value;
        const logo = document.getElementById('logo-instansi');
        nama_instansi.innerHTML = '<option value="">Pilih Nama Instansi</option>';
        nama_instansi.style.display = 'none';
        tombol_memilih_nama_instansi.style.border = 'none';
        tombol_memilih_nama_instansi.textContent = '';
        logo.style.width = '0px';

        if (jenis_instansi_yang_terpilih && pilihan2_nama_instansi[jenis_instansi_yang_terpilih]) {
            pilihan2_nama_instansi[jenis_instansi_yang_terpilih].forEach(item => {
                const elemen_option = document.createElement('option');
                elemen_option.value = Object.keys(item)[0];
                elemen_option.textContent = item[Object.keys(item)[0]];
                nama_instansi.appendChild(elemen_option);
            });
            nama_instansi.style.display = 'block';
        }
    });

    nama_instansi.addEventListener('change', () => {
        const logo = document.getElementById('logo-instansi');
        const id = window.location.href.split('/')[window.location.href.split('/').length - 2];
        if (nama_instansi.value != "") {
            if (logo.style.width === '0px') {
                logo.style.backgroundImage = `url("Data/Gambar/logo-instansi/${jenis_instansi.value}/${nama_instansi.value}.png")`;
                logo.style.width = '50px';
                tombol_memilih_nama_instansi.style.border = '2px solid black'
            } else {
                logo.style.width = '0px';
                setTimeout(() => {
                    logo.style.width = '50px';
                    logo.style.backgroundImage = `url("Data/Gambar/logo-instansi/${jenis_instansi.value}/${nama_instansi.value}.png")`;
                }, 300);
            }
            fetch(`/editor-artikel/${id}/kirim-gambar-logo/`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ user : user_data.username, type : jenis_instansi.value, tag : nama_instansi.value})
            })
            .then(response => response.json())
            .then(data => {
                console.log(JSON.stringify(data));
            })
            .catch((err) => {
                console.error(err);
            });
        } else {
            logo.style.width = '0px';
            tombol_memilih_nama_instansi.style.border = 'none'
        }
        tombol_memilih_nama_instansi.textContent = nama_instansi.value.replace(/-/g, " ");
    });

    nama_instansi.addEventListener('blur', () => {
        nama_instansi.style.display = 'none';
    });
    tombol_memilih_nama_instansi.addEventListener('click', () => {
        nama_instansi.style.display = 'block';
    });
    //=========================================================================

    //Resize Kolom teks========================================================
    const teks_input = document.querySelectorAll('textarea');

    teks_input.forEach(input => {
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = input.scrollHeight + 'px';
        });
    });
    //=========================================================================

    //Panjang gambar sampul====================================================
    const sampul = document.getElementById('sampul');
    sampul.style.height = sampul.offsetWidth * 9/16 + 'px';

    //Input gambar sampul======================================================
    const sampul_input = document.getElementById('sampul-input');

    sampul.addEventListener('click', () => sampul_input.click());
    var nama_dan_ekstensi_sampul;

    function gantiSampul(file, loadFile = false) {
        const reader = new FileReader();
            reader.onload = (e) => {
                sampul.style.backgroundImage = `url(${e.target.result})`;
                sampul.innerHTML = '';
                sampul.style.opacity = '1';
                sampul.style.backgroundSize = 'contain';
                if (loadFile !== true) {
                    uploadSampulKeServer(file);
                }
            };
            reader.readAsDataURL(file);
    }

    function uploadSampulKeServer(file) {
        const namaGambar = file.name.split('.')
        const ekstensiGambar = namaGambar[namaGambar.length - 1];
        
        sampul.setAttribute('data-info', ekstensiGambar);

        const formData = new FormData();
        formData.append('file', file);

        const id = window.location.href.split('/')[window.location.href.split('/').length - 2];
        const user = user_data.username;
        const jenisGambar = 'sampul';

        fetch(`/editor-artikel/${id}/upload-gambar/${user}/${jenisGambar}/`, {
            method : "POST", 
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            nama_dan_ekstensi_sampul = data.sampul;
        })
        .catch((error) => {
            console.error("Terjadi kesalahan dalam fetch /editor-artikel/upload-gambar/ : ", error);
        })
    }

    sampul_input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            gantiSampul(file);
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        sampul.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    sampul.addEventListener('drop', (e) => {
        let file;
        if (e.dataTransfer) {
          file = e.dataTransfer.files[0];
        } else {
          file = e.detail.files;
        }
        gantiSampul(file, e.detail.loadFile);
      });

    ['dragenter', 'dragover'].forEach(eventname => {
        sampul.addEventListener(eventname, () => {
            sampul.classList.add('hover');
        });
    });

    sampul.addEventListener('dragleave', () => {
        sampul.classList.remove('hover');
    });
    //=========================================================================

    //Menu&tambah artikel======================================================
    const tombol_tambah_konten = document.getElementById('tambah-konten');
    const pilihan_tambah_konten = document.getElementById('pilihan-tambah-konten');
    const isi_artikel = document.querySelector('.isi-artikel');

    tombol_tambah_konten.addEventListener('click', () => {
        pilihan_tambah_konten.style.display = pilihan_tambah_konten.style.display === 'block' ? 'none' : 'block';
    });

    pilihan_tambah_konten.addEventListener('blur', () => {pilihan_tambah_konten.style.display = 'none'});
    pilihan_tambah_konten.addEventListener('change', () => {
        pilihan_tambah_konten.style.display = 'none';
        
        function cekId() {
            let i = 0;
            while (true) {
                i++;
                temp = `element-${i}`
                let id_exists = document.getElementById(temp);
                if (!id_exists) {
                    break;
                }
            }
            return i;
        }

        let i = `element-${cekId()}`;

        const action_container = document.createElement('div');
        action_container.setAttribute('class', 'action-container');
        
        const deleter = document.createElement('div');
        deleter.classList.add('deleter', 'action');

        const move_up = document.createElement('div');
        move_up.classList.add('move-up', 'action');
        const cek_keadaan_isi_artikel_sebelum_elemen_masuk = Array.from(isi_artikel.children).map(elemen => elemen.id);
        if (cek_keadaan_isi_artikel_sebelum_elemen_masuk[cek_keadaan_isi_artikel_sebelum_elemen_masuk.length - 1] === 'sampul') {
            move_up.setAttribute('style', 'display: none')
        }

        const move_down = document.createElement('div');
        move_down.classList.add('move-down', 'action');
        move_down.setAttribute('style', 'display: none')

        const divisi = document.createElement('div');
        divisi.classList.add('container-content');
        divisi.setAttribute('id', i);

        var elemen_ditambahkan;
        var adisi;
        var teks;
        if (pilihan_tambah_konten.value === "gambar") {
            elemen_ditambahkan = document.createElement('div');
            elemen_ditambahkan.classList.add('gambar');

            adisi = document.createElement('input');
            adisi.setAttribute('type', 'file');
            adisi.setAttribute('accept', 'image/*');

            teks = document.createElement('p')
            teks.textContent = 'Tambahkan Gambar';
        } else {
            divisi.setAttribute('style', 'width: 100%;');
            elemen_ditambahkan = document.createElement('textarea');
            if (pilihan_tambah_konten.value === 'h1') {
                elemen_ditambahkan.setAttribute('class', 'h1');
                divisi.classList.add('container-h1');
            } else if (pilihan_tambah_konten.value === 'h2') {
                elemen_ditambahkan.setAttribute('class', 'h2');
                divisi.classList.add('container-h2');
            } else if (pilihan_tambah_konten.value === 'h3') {
                elemen_ditambahkan.setAttribute('class', 'h3');
                divisi.classList.add('container-h3');
            } else if (pilihan_tambah_konten.value === 'h4') {
                elemen_ditambahkan.setAttribute('class', 'h4');
                divisi.classList.add('container-h4');
            } else if (pilihan_tambah_konten.value === 'h5') {
                elemen_ditambahkan.setAttribute('class', 'h5');
                divisi.classList.add('container-h5');
            } else if (pilihan_tambah_konten.value === 'h6') {
                elemen_ditambahkan.setAttribute('class', 'h6');
                divisi.classList.add('container-h6');
            } else if (pilihan_tambah_konten.value === 'p') {
                elemen_ditambahkan.setAttribute('class', 'p');
                divisi.classList.add('container-paragraph');

            }
        }

        isi_artikel.appendChild(divisi);
        divisi.appendChild(elemen_ditambahkan);
        divisi.appendChild(action_container);
        action_container.appendChild(deleter);
        action_container.appendChild(move_up);
        action_container.appendChild(move_down);

        const action_display_event = new Event('actsUp');
        
        move_up.addEventListener('click', () => {
            const parentList = Array.from(isi_artikel.children).map(elemen => elemen.id);
            const this_id = move_up.parentElement.parentElement.id;
            let i = 0;
            for (i; i < parentList.length -1; i++) {
                if (parentList[i] === this_id) {
                    break;
                }
            }

            const swapper = document.getElementById(parentList[i]);
            const swapped = document.getElementById(parentList[i - 1]);
            isi_artikel.insertBefore(swapper, swapped);
            parentList.slice(2, parentList.length).forEach(id => {
                let element = document.getElementById(id);
                element.querySelector('.move-up').dispatchEvent(action_display_event);
                element.querySelector('.move-down').dispatchEvent(action_display_event);
            });
        });

        move_down.addEventListener('click', () => {
            const parentList = Array.from(isi_artikel.children).map(elemen => elemen.id);
            const this_id = move_up.parentElement.parentElement.id;
            let i = 0;
            for (i; i < parentList.length -1; i++) {
                if (parentList[i] === this_id) {
                    break;
                }
            }

            const swapped = document.getElementById(parentList[i + 1]);
            const swapper = document.getElementById(parentList[i])
            isi_artikel.insertBefore(swapped, swapper);
            parentList.slice(2, parentList.length).forEach(id => {
                let element = document.getElementById(id);
                element.querySelector('.move-up').dispatchEvent(action_display_event);
                element.querySelector('.move-down').dispatchEvent(action_display_event);
            });
        });

        move_up.addEventListener('actsUp', () => {
            const parentList = Array.from(isi_artikel.children).map(elemen => elemen.id);
            const this_id = move_up.parentElement.parentElement.id;
            let i = 0;
            for (i; i < parentList.length - 1; i++) {
                if (parentList[i] === this_id) {
                    break;
                }
            }

            if (i > 2) {
                move_up.style.display = 'block';
            } else {
                move_up.style.display = 'none';
            }
        });

        move_down.addEventListener('actsUp', () => {
            const parentList = Array.from(isi_artikel.children).map(elemen => elemen.id);
            const this_id = move_up.parentElement.parentElement.id;
            let i = 0;
            for (i; i < parentList.length -1; i++) {
                if (parentList[i] === this_id) {
                    break;
                }
            }

            if (i === parentList.length - 1) {
                move_down.style.display = 'none';
            } else {
                move_down.style.display = 'block';
            }
        });

        deleter.addEventListener('click', () => {
            deleter.parentElement.parentElement.remove();
            const parentList = Array.from(isi_artikel.children).map(elemen => elemen.id);
            parentList.slice(2, parentList.length).forEach(id => {
                let element = document.getElementById(id);
                element.querySelector('.move-up').dispatchEvent(action_display_event);
                element.querySelector('.move-down').dispatchEvent(action_display_event);
            });
        });

        if (pilihan_tambah_konten.value === 'gambar') {
            divisi.classList.add('container-gambar');
            elemen_ditambahkan.appendChild(teks)
            elemen_ditambahkan.appendChild(adisi);
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                elemen_ditambahkan.addEventListener(eventName, preventDefaults);
            });

            function gantiGambar(file, load_file = false, width = '', height = '') {
                for (let i = 0; i < elemen_ditambahkan.children.length; i++) {
                    if (elemen_ditambahkan.children[i].tagName === 'P') {
                        elemen_ditambahkan.children[i].remove();
                    }
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image()

                    img.onload = () => {
                        if (load_file) {
                            elemen_ditambahkan.parentElement.style.width = width;
                            elemen_ditambahkan.parentElement.style.height = height;
                        } else {
                            elemen_ditambahkan.parentElement.style.width = `${img.width}px`;
                            elemen_ditambahkan.parentElement.style.height = `${img.height}px`;}
                    }
                    img.src = e.target.result
                    
                    elemen_ditambahkan.style.opacity = '1';
                    elemen_ditambahkan.style.backgroundImage = `none`;
                    const IMGArrayInElement = Array.from(elemen_ditambahkan.children).map(elemen => elemen.tagName);
                    if (IMGArrayInElement[1] === 'IMG') {
                        elemen_ditambahkan.children[1].remove();
                    }
                    const gambar = document.createElement('img');
                    gambar.setAttribute('src', e.target.result);
                    gambar.setAttribute('style', 'width: 100%; height: 100%;')
                    elemen_ditambahkan.appendChild(gambar);
                    if (!load_file) {
                        uploadGambar(file);
                    }
                }
                reader.readAsDataURL(file);
            }

            function uploadGambar(file) {
                const window_url_array = window.location.href.split('/');
                const id = window_url_array[window_url_array.length - 2];

                const formData = new FormData();
                formData.append('file', file);

                const isi_dari_artikel = isi_artikel.children;
                let j = 0;
                for (let i = 0; i < isi_dari_artikel.length; i++) {
                    if (isi_dari_artikel[i].classList.contains('container-gambar')) {
                        j++;
                    }
                    if (isi_dari_artikel[i].id === divisi.id) {
                        break;
                    }
                }
                
                //if (elemen_ditambahkan.parentElement.classList.length === 3) {
                //    let nama_class = elemen_ditambahkan.parentElement.classList[2];
                //    elemen_ditambahkan.parentElement.classList.remove(nama_class);
                //}
                //elemen_ditambahkan.parentElement.classList.add(`gambar${j}`)

                fetch(`/editor-artikel/${id}/upload-gambar/${user_data.username}/gambar${j}/`, {
                    method: "POST", 
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    divisi.setAttribute('data-info', data.gambar);
                })
                .catch((err) => {
                    console.error("Terjadi kesalahan dalam fetch data : ", err);
                })
            }

            const searchInputChild = () => {
                for (let i = 0; i < elemen_ditambahkan.children.length; i++) {
                    if (elemen_ditambahkan.children[i].tagName === 'INPUT') {
                        return elemen_ditambahkan.children[i]
                    }
                }
            }

            let gambar_input = searchInputChild();

            elemen_ditambahkan.addEventListener('click', () => {
                gambar_input.click();
            });

            gambar_input.addEventListener('change', (event) => {
                if (event.target.files[0]) {
                    const file = event.target.files[0];
                    if (file) {
                        gantiGambar(file);
                    }
                } else {
                    const file = event.detail.file;
                    const width = event.detail.width;
                    const height = event.detail.height;
                    gantiGambar(file, true, width, height)
                }
            });

            ['dragenter', 'dragover'].forEach(eventname => {
                elemen_ditambahkan.addEventListener(eventname, () => {
                    elemen_ditambahkan.classList.add('hover');
                });
            });
        
            elemen_ditambahkan.addEventListener('dragleave', () => {
                elemen_ditambahkan.classList.remove('hover');
            });

            elemen_ditambahkan.addEventListener('drop', (event) => {
                if (event.dataTransfer.files.length > 0) {
                    const file = event.dataTransfer.files[0];

                    if (file.type.startsWith('image/')) {
                        gantiGambar(file);
                    } else {
                        alert('Hanya menerima tipe gambar!')
                    }
                }
            })
        } else {
            elemen_ditambahkan.addEventListener('input', () => {
                    elemen_ditambahkan.style.height = 'auto';
                    elemen_ditambahkan.style.height = elemen_ditambahkan.scrollHeight + 'px';
                });
        }

        if(pilihan_tambah_konten.value === 'p') {
            elemen_ditambahkan.textContent = '      '
            elemen_ditambahkan.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    elemen_ditambahkan.value += '\n      ';
                }
            })
        }

        const parentList_setelah_tambah_elemen = Array.from(isi_artikel.children).map( elemen => elemen.id );
        parentList_setelah_tambah_elemen.slice(2, parentList_setelah_tambah_elemen.length).forEach(id => {
            const element = document.getElementById(id);
            element.querySelector('.move-up').dispatchEvent(action_display_event);
            element.querySelector('.move-down').dispatchEvent(action_display_event);
        });

        pilihan_tambah_konten.value = '';
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
    //=========================================================================

    //Membuat direktori========================================================
    var data_from_server;
    event_target_load_save_file.addEventListener('triggerLoadSaveFile', () => {
        const the_user = user_data.username;
        const param_id = window.location.href.split('/')[window.location.href.split('/').length - 2];
        var event_change = new Event('change');
        fetch(`/editor-artikel/${param_id}/`, {
            method : "POST", 
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({ data : the_user })
        })
        .then(response => response.json())
        .then(data => {
            if (data.data[0].judul !== '') {
                let i = -1;
                let elemen;
                jenis_instansi.value = data.config.type;
                jenis_instansi.dispatchEvent(event_change);
                nama_instansi.value = data.config.tag[0];
                nama_instansi.dispatchEvent(event_change);
                nama_instansi.dispatchEvent(new Event('blur'));

                function muat_teks(jenis_teks, indeks, isi) {
                    pilihan_tambah_konten.value = jenis_teks;
                    const change_event = new Event('change');
                    pilihan_tambah_konten.dispatchEvent(change_event);
                    const teks_elemen = isi_artikel.children[indeks].children[0];
                    teks_elemen.value = isi;
                    teks_elemen.dispatchEvent(new Event('input'))
                    loadData();
                }

                function loadData() {
                    try {
                        i++;
                        elemen = data.data[i];
                        let jenis_elemen = Object.keys(elemen)[0];
                        let isi_elemen = elemen[jenis_elemen];
                        let nama_param = window.location.href.split('/')[window.location.href.split('/').length - 2];
                    
                        if (jenis_elemen === 'judul') {
                            document.getElementById('judul').value = isi_elemen;
                            loadData();
                        } else if (jenis_elemen === 'sampul') {
                            if (isi_elemen !== '') {
                                fetch(`/editor-artikel/${nama_param}/ambil-gambar/`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type" : "application/json"
                                    },
                                    body: JSON.stringify({ gambar: isi_elemen, pengguna : user_data.username})
                                })
                                .then(response => response.blob())
                                .then(blob => {
                                    const file = new File([blob], `sampul.${blob.type.split('/')[1]}`, {type: blob.type});
                                    const drop_event = new CustomEvent('drop', {
                                        detail: {
                                            files: file,
                                            loadFile: true,
                                        }
                                    });
                                    console.log(file);
                                    nama_dan_ekstensi_sampul = "sampul." + blob.type.split('/')[1];
                                    sampul.dispatchEvent(drop_event);
                                    loadData()
                                })
                                .catch((err) => {
                                    console.error(err)
                                });
                            } else {
                                loadData()
                            }
                        } else if (jenis_elemen === 'gambar') {
                            fetch(`/editor-artikel/${nama_param}/ambil-gambar/`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type" : "application/json"
                                    },
                                    body: JSON.stringify({ gambar: isi_elemen, pengguna : user_data.username})
                                })
                                .then(response => response.blob())
                                .then(blob => {
                                    if (blob.type !== 'application/octet-stream') {
                                        pilihan_tambah_konten.value = 'gambar';
                                        const file = new File([blob], isi_elemen, {type: blob.type});
                                        const change_event = new Event('change');
                                        pilihan_tambah_konten.dispatchEvent(change_event);
    
                                        const child = isi_artikel.children[i];
                                        const change_event_input = new CustomEvent('change', {
                                            detail : {
                                                file : file,
                                                width : elemen.width,
                                                height : elemen.height
                                            }
                                        });
                                        console.log(file)
                                        child.children[0].children[1].dispatchEvent(change_event_input);
                                        child.setAttribute('data-info', file.name)
                                    } else {
                                        pilihan_tambah_konten.value = 'gambar';
                                        const change_event = new Event('change');
                                        pilihan_tambah_konten.dispatchEvent(change_event);
                                    }
                                    loadData();
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        } else if (jenis_elemen === 'h1') {
                            muat_teks('h1', i, isi_elemen);
                        } else if (jenis_elemen === 'h2') {
                            muat_teks('h2', i, isi_elemen);
                        } else if (jenis_elemen === 'h3') {
                            muat_teks('h3', i, isi_elemen);
                        } else if (jenis_elemen === 'h4') {
                            muat_teks('h4', i, isi_elemen);
                        } else if (jenis_elemen === 'h5') {
                            muat_teks('h5', i, isi_elemen);
                        } else if (jenis_elemen === 'h6') {
                            muat_teks('h6', i, isi_elemen);
                        } else if (jenis_elemen === 'paragraph') {
                            muat_teks('p', i, isi_elemen);
                        }
                    } catch (err) {
                        console.log("All data loaded!");
                    }
                }
                loadData();
            }

            if (data.config.publicDate !== '') {
                document.getElementById('tombol-publikasi').classList.add('public');
                document.getElementById('container-teks-publikasi').children[0].textContent = 'Depublikasikan artikel ini?';
            }

            data_from_server = data;
        })
        .catch((error) => {
            console.error("Terjadi error saat fetching /editor-artikel/... :", error);
        });
    });
    //=========================================================================
    
    //Tombol simpan============================================================
    const tombol_simpan = document.getElementById('tombol-save');
    tombol_simpan.addEventListener('click', () => {
        const elemen_judul = document.getElementById('judul');
        if (nama_instansi.value && elemen_judul.value) {
            const isi_artikel = document.querySelector('.isi-artikel');
            const array_children_artikel = Array.from(isi_artikel.children).map(elemen => elemen.id);
            let data_to_server = {
                "data" : [],
                "config" : {}
            }

            let data_buat_config = data_from_server.config;
            const today = new Date();
            let day = today.getDate().toString();
            let month = (today.getMonth() + 1).toString();
            const year = today.getFullYear();
            if (day.length < 2) {
                day = '0' + day;
            }
            if (month.length < 2) {
                month = '0' + month;
            }

            data_buat_config["saveDate"] = `${year}-${month}-${day}`;
            data_buat_config["type"] = `${jenis_instansi.value}`;
            data_buat_config["tag"] = [`${nama_instansi.value}`, `${nama_instansi.querySelector(`option[value=${nama_instansi.value}]`).textContent}`];

            array_children_artikel.forEach(elemen_id => {
                const elemen_di_artikel = document.getElementById(elemen_id);
                if (elemen_id === 'judul') {
                    const judul = elemen_di_artikel.value;
                    data_to_server.data.push({ "judul" : judul });
                } else if (elemen_id === 'sampul') {
                    if (nama_dan_ekstensi_sampul != undefined) {
                        data_to_server.data.push({ "sampul" : nama_dan_ekstensi_sampul })
                    } else {
                        data_to_server.data.push({ "sampul" : ""})
                        }
                } else {
                    if (elemen_di_artikel.classList.contains('container-gambar')) {
                        let data = {
                            "gambar" : elemen_di_artikel.getAttribute('data-info'),
                            "width" : window.getComputedStyle(elemen_di_artikel).width,
                            "height" : window.getComputedStyle(elemen_di_artikel).height
                        }
                        data_to_server.data.push(data)
                    } else if (elemen_di_artikel.classList.contains('container-h1')) {
                        data_to_server.data.push({ "h1" : elemen_di_artikel.children[0].value})
                    } else if (elemen_di_artikel.classList.contains('container-h2')) {
                        data_to_server.data.push({ "h2" : elemen_di_artikel.children[0].value})
                    } else if (elemen_di_artikel.classList.contains('container-h3')) {
                        data_to_server.data.push({ "h3" : elemen_di_artikel.children[0].value})
                    } else if (elemen_di_artikel.classList.contains('container-h4')) {
                        data_to_server.data.push({ "h4" : elemen_di_artikel.children[0].value})
                    } else if (elemen_di_artikel.classList.contains('container-h5')) {
                        data_to_server.data.push({ "h5" : elemen_di_artikel.children[0].value})
                    } else if (elemen_di_artikel.classList.contains('container-h6')) {
                        data_to_server.data.push({ "h6" : elemen_di_artikel.children[0].value})
                    } else if (elemen_di_artikel.classList.contains('container-paragraph')) {
                        data_to_server.data.push({ "paragraph" : elemen_di_artikel.children[0].value})
                    }
                }
            });
            data_to_server.config = data_buat_config;
            
            window.removeEventListener('beforeunload', memastikan);
            fetch(`/editor-artikel/simpan-artikel/${window.location.href.split('/')[window.location.href.split('/').length - 2]}/${user_data.username}/`, {
                method: "POST", 
                headers: {
                    "Content-Type" : "application/json"
                }, 
                body: JSON.stringify(data_to_server)
            })
            .then(response => response.json())
            .then(data => {
                if (data.link) {
                    window.location.href = `/editor-artikel/${data.link}/`;
                } else {
                    alert(data.info);
                }
            })
            .catch((err) => {
                console.error("Terjadi kesalahan dalam menyimpan json : ", err);
            });
        } else {
            alert("Tolong isi nama instansi dan/atau judul terlebih dahulu")
        }
    });
    //=========================================================================

    //Judul tidak menerima newline=============================================
    document.getElementById('judul').addEventListener('input', (event) => {
        const isi = event.target.value;
        event.target.value = isi.replace('\n', ' ')
    });
    //=========================================================================

    //Tombol publikasi=========================================================
    let tombol_publikasi = document.getElementById('tombol-publikasi');
    let bagan_konfirmasi_publikasi = document.getElementById('bagan-konfirmasi-publikasi');

    tombol_publikasi.addEventListener('mouseenter', () => {
        tombol_publikasi.classList.add('hover');
    });
    tombol_publikasi.addEventListener('mouseleave', () => {
        tombol_publikasi.classList.remove('hover')
    });
    tombol_publikasi.addEventListener('click', () => {
        bagan_konfirmasi_publikasi.setAttribute('style', '');
    });
    document.getElementById('publikasi-no').addEventListener('click', () => {
        bagan_konfirmasi_publikasi.setAttribute('style', 'transform: translate(0, 200px)')
    });
    document.getElementById('publikasi-yes').addEventListener('click', () => {
        let click_event = new Event('click');
        tombol_simpan.dispatchEvent(click_event);
        window.removeEventListener('beforeunload', memastikan);

        fetch('/editor-artikel/p/publikasikan-depublikasikan/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: user_data.username,
                ingin_diapakan: window.location.href.split('/')[4],
                tipe: tombol_publikasi.classList.contains('public') ? 'public' : 'private'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'terkirim') {
                window.location.href = '/artikel/tambah_artikel/';
            } else {
                alert(`${data.message}, ERR: ${data.error}`)
            }
        })
        .catch((err) => {
            console.error(err);
        });
    })
    //=========================================================================
});