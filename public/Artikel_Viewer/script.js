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
        window.location.href = '/login/';
    });
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

    //Penampil=================================================================
    fetch('/artikel/ambil-data/', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: window.sessionStorage.artikel_pembuat_artikel
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let container_logo = document.getElementById('container-logo');
        let container_nama_instansi = document.getElementById('container-nama-instansi');
        let elemen_artikel = document.querySelector('article');

        fetch('/artikel/viewer/ambil-gambar/', {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({logo : data.logo})
        })
        .then(response => response.blob())
        .then(blob => {
            container_logo.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
        });

        container_nama_instansi.textContent = data.nama_instansi + ' • ' + data.tanggal_upload;

        function tambahkan_teks(kunci, nilai) {
            let paragraph = document.createElement(kunci === 'paragraph' ? 'pre' : kunci);
            paragraph.textContent = nilai;
            elemen_artikel.append(paragraph)
        }

        data.data.forEach(async elemen => {
            let jenis_elemen = Object.keys(elemen)[0];
            let isi_elemen = elemen[jenis_elemen];

            if (jenis_elemen === 'judul') {
                document.getElementById('judul').textContent = isi_elemen;
            } else if (jenis_elemen === 'sampul') {
                fetch('/artikel/viewer/ambil-gambar/', {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({sampul : isi_elemen, lokasi: JSON.parse(window.sessionStorage.artikel_pembuat_artikel)})
                })
                .then(response => response.blob())
                .then(blob => {
                    let sampul = document.getElementById('sampul');
                    sampul.style.display= 'block';
                    sampul.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
                })
                .catch((err) => {
                    console.error(err);
                })
            } else if (jenis_elemen === 'gambar') {
                let gambar = document.createElement('img');
                elemen_artikel.append(gambar);
                fetch('/artikel/viewer/ambil-gambar/', {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({gambar : isi_elemen, lokasi: JSON.parse(window.sessionStorage.artikel_pembuat_artikel)})
                })
                .then(response => response.blob())
                .then(blob => {
                    gambar.setAttribute('src', URL.createObjectURL(blob));
                    gambar.classList.add('gambar');
                    gambar.style.width = elemen.width;
                    gambar.style.height = elemen.height;
                })
                .catch((err) => {
                    console.error(err);
                });
            } else {
                tambahkan_teks(jenis_elemen, isi_elemen);
            }
        })
    })
});