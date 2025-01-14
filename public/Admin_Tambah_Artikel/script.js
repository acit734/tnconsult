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
    document.getElementById('pilihan4-sidebar').addEventListener('click', () => {
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

    //Read files===============================================================
    var arsip_draf_dan_publik;
    fetch('/artikel/files', {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        }, 
        body: JSON.stringify({ sessionData: user_data.username })
    })
    .then(response => response.json())
    .then(data => {
        arsip_draf_dan_publik = data;
        console.log(arsip_draf_dan_publik);

        const bulan2 = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        ['private', 'public'].forEach(elemen => {
            if (arsip_draf_dan_publik[elemen].length !== 0) {
                document.getElementById(elemen).textContent = ''
    
                const private = arsip_draf_dan_publik[elemen];
                let i = 0;
                function loadSaveFile() {
                    fetch(`/artikel/display/`, {
                        method: "POST",
                        headers: {
                            "Content-Type" : "application/json"
                        },
                        body: JSON.stringify({
                            judul : private[i],
                            user: user_data.username, 
                            tipe : elemen
                        })})
                        .then(response => response.json())
                        .then(data => {
                            const container = document.getElementById(elemen);
                            const container_artikel1 = document.createElement('div');
                            container_artikel1.setAttribute('class', 'container-artikel');
                            const container_artikel2 = document.createElement('div')
                            container_artikel2.classList.add('container-artikel', 'inside');
                            container_artikel2.addEventListener('click', () => {
                                window.location.href = `/editor-artikel/${data.link}/`
                            })
                            container.appendChild(container_artikel1);
                            container_artikel1.appendChild(container_artikel2);
                            container_artikel1.setAttribute('data-info', data.link + `-${elemen}`);
    
                            const tombol_hapus = document.createElement('div');
                            tombol_hapus.setAttribute('class', 'tombol-hapus');
                            container_artikel1.appendChild(tombol_hapus);
                            tombol_hapus.style.display = 'none';
                            tombol_hapus.setAttribute('title', data.judul === '' ? 'Hapus artikel tak berjudul' : `Hapus artikel ${data.judul}`)
    
                            tombol_hapus.addEventListener('trashTriggered', () => {
                                let display_tombol = tombol_hapus.style.display
                                if (display_tombol === 'none') {
                                    tombol_hapus.style.display = 'block';
                                } else {    
                                    tombol_hapus.style.display = 'none';
                                }
                            })
    
                            tombol_hapus.addEventListener('click', (event) => {
                                event.preventDefault();
    
                                
                                let teks_menghapus_artikel = document.getElementById('teks-menghapus-artikel');
                                let judul_artikel = tombol_hapus.parentElement.children[0].children[0].children[0].textContent;
                                let data_artikel = tombol_hapus.parentElement.getAttribute('data-info');
                                let gambar_sampul = tombol_hapus.parentElement.querySelector('.container-sampul').getAttribute('style');
    
                                document.querySelector('.hapus-yes-or-no').style.transform = '';
                                teks_menghapus_artikel.textContent = `Yakin ingin menghapus artikel "${judul_artikel}"?`;
                                teks_menghapus_artikel.setAttribute('data-info', data_artikel);
                                document.getElementById('menampilkan-sampul-yang-akan-dihapus').setAttribute('style', gambar_sampul)
                            });
    
                            const container_judul_dan_logo = document.createElement('div');
                            container_judul_dan_logo.setAttribute('class', 'container-judul-dan-logo')
                            container_artikel2.appendChild(container_judul_dan_logo);
    
                            const container_sampul = document.createElement('div');
                            container_sampul.setAttribute('class', 'container-sampul');
                            container_artikel2.appendChild(container_sampul);
    
                            if (data.sampul !== null) {
                                fetch(data.sampul, {
                                    method: "GET"
                                })
                                .then(response => response.blob())
                                .then(blob => {
                                    container_sampul.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                            }
    
                            const container_judul = document.createElement('div');
                            const container_logo = document.createElement('div');
                            container_judul.setAttribute('class', 'container-judul');
                            container_logo.setAttribute('class', 'container-logo');
                            container_judul_dan_logo.appendChild(container_judul);
                            container_judul_dan_logo.appendChild(container_logo);
    
                            if (data.logo !== null) {
                                fetch(data.logo, {
                                    method: "GET"
                                })
                                .then(response => response.blob())
                                .then(blob => {
                                    let logo = document.createElement('div');
                                    logo.setAttribute('class', 'logo-instansi');
                                    logo.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
                                    container_logo.appendChild(logo);
    
                                    let nama_instansi = document.createElement('h4');
                                    nama_instansi.textContent = data.nama_instansi;
                                    container_logo.appendChild(nama_instansi);

                                    if (elemen === 'public') {
                                        let parse_tanggal = data.publicDate.split('-');
                                        parse_tanggal[1] = bulan2[parseInt(parse_tanggal[1]) - 1];
                                        tanggal_dipublikasikan = parse_tanggal.reverse().join(' ');
        
                                        const elemen_tanggal = document.createElement('h6');
                                        elemen_tanggal.textContent = ` - ${tanggal_dipublikasikan}`;
                                        container_logo.appendChild(elemen_tanggal);
                                    }
                                }) 
                            }
    
                            const judul = document.createElement('h1');
                            judul.textContent = data.judul !== '' ? data.judul : "Belum ada judul";
                            container_judul.appendChild(judul);
    
                            i++;
                            if (i < arsip_draf_dan_publik[elemen].length) {
                                    loadSaveFile();
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                    }
                loadSaveFile();
            }
        });
    })
    .catch((err) => {
        console.error(err);
    })
    //=========================================================================

    //Tombol tambah============================================================
    document.getElementById('tambah-artikel-content1').addEventListener('click', () => {
        fetch('/new-article/', {
            method : "POST", 
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                user : user_data.username,
                title : 'untitled'
            })
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = `/editor-artikel/${data.link}/`;
            })
            .catch((error) => {console.error("Terjadi kesalahan saat fetch /new-article/ : ", error)});
    });
    //=========================================================================

    //Tombol hapus=============================================================
    const tombol_hapus_artikel = document.getElementById('hapus-artikel-content1');
    document.getElementById('hapus-artikel-content1').addEventListener('click', () => {
        const trash_button = document.querySelectorAll('.tombol-hapus');
        const event_trash = new Event("trashTriggered");
        console.log(event_trash)
        console.log(trash_button)
        for (let i = 0; i < trash_button.length; i++) {
            trash_button[i].dispatchEvent(event_trash);
        }

        let icon = tombol_hapus_artikel.style.backgroundImage.split('/')[3].split('.')[0].split('-');

        if (icon.length === 3) {
            tombol_hapus_artikel.style.backgroundImage = "url('Data/Gambar/icon/trash-can-regular-red.svg')"
        } else {
            tombol_hapus_artikel.style.backgroundImage = "url('Data/Gambar/icon/trash-can-regular.svg')"
        }
    });

    document.getElementById('menghapus-no').addEventListener('click', () => {
        document.querySelector('.hapus-yes-or-no').setAttribute('style', 'transform: translate(0, 370px)');
    });

    document.getElementById('menghapus-yes').addEventListener('click', () => {
        document.querySelector('.hapus-yes-or-no').setAttribute('style', 'transform: translate(0, 370px)');
        fetch('/artikel/a/hapus-artikel/', {
            method: "POST", 
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                user : user_data.username,
                data : document.getElementById('teks-menghapus-artikel').getAttribute('data-info')
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "OK") {
                window.location.reload();
            } else {
                alert(data.status);
            }
        })
        .catch((err) => {
            console.error(err)
        })
    })
});