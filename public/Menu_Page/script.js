document.addEventListener('DOMContentLoaded', function() {
    //Nama Lengkap Pengguna====================================================
    const user_data = JSON.parse(window.sessionStorage.getItem('user'));
    let auth;
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
            let namaewa = document.getElementById('display-nama-di-greet');
            nama_user.innerHTML = data.NamaLengkap;
            namaewa.innerHTML = data.NamaLengkap;

            let rect = nama_user.getBoundingClientRect();
            let textWidth = rect.width;

            let nama_dan_dropdown = document.getElementById('nama-dan-dropdown');
            let tombol_dropdown = document.getElementById('tombol-dropdown');
            auth = data.auth;

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
        location.reload();
    });
    //=========================================================================

    //Tombol di Sidebar========================================================
    document.getElementById('pilihan2-sidebar').addEventListener('click', () => {
        window.location.href = '/chat';
    })
    let pilihan4_sidebar = document.getElementById('pilihan4-sidebar');
    pilihan4_sidebar.addEventListener('click', () => {
        window.location.href = '/artikel';
    })
    //=========================================================================

    //Content 1================================================================
    const now = new Date();
    const hour = now.getHours().toString();
    var greet = document.getElementById('halo-waktu');
    var teks_konten_1 = document.getElementById('teks-group');
    var gambar_c1 = document.getElementById('gambar-bg');

    if (hour < 12) {
        greet.innerHTML += 'Pagi,';
    } else if (hour < 15) {
        greet.innerHTML += 'Siang,';
    } else if (hour < 18) {
        greet.innerHTML += 'Sore,';
    } else {
        greet.innerHTML += 'Malam,'
    }

    setTimeout(() => {
        gambar_c1.style.opacity = '1';
    }, 1)
    setTimeout(() => {
        teks_konten_1.style.opacity = '1';
        teks_konten_1.style.top = '0%';
        gambar_c1.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }, 500);
    //=========================================================================

    //Content 2================================================================
    let pilihan3_content2 = document.getElementById('pilihan3-content2');
    pilihan3_content2.addEventListener('click', () => {
        window.location.href = '/artikel';
    })
    //=========================================================================
});