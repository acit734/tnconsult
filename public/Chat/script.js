const socket = io('http://localhost:3001')

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
            let hanya_admin = document.getElementsByClassName('admin')
            if (data.auth !== 'admin') {
                for (let i = 0; i < hanya_admin.length; i++) {
                    hanya_admin[i].remove();
                }
            }

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
    function murid_chat() {
        const kontak = document.createElement('div');
        const gambar_kontak = document.createElement('img');

        kontak.classList.add('kontak');

        document.querySelector('.content-1').appendChild(kontak);
    }
    //perubahan===============================================================

    //
    const send_button = document.getElementById('send-button');
    const input_text_container = document.getElementById('input-text-container');
    const chat_input = document.getElementById('chat-input');
    const chat_display = document.getElementById('chat-display');
    let chat_display_children = chat_display.children;

    
    chat_input.addEventListener('input', () => {
        const getComputedStyle_input_text_container = window.getComputedStyle(input_text_container);
        const getComputedStyle_chat_input = window.getComputedStyle(chat_input);
        const getComputedStyle_chat_display = window.getComputedStyle(chat_display);
        chat_input.style.height = '';
        input_text_container.style.height = '';
        chat_display.style.transform = '';
        chat_display.style.height = '';
        if (chat_input.scrollHeight > chat_input.clientHeight) {
            if (chat_input.scrollHeight >= 95) {
                input_text_container.style.height = `112px`;
                chat_input.style.height = `97px`;
                chat_display.style.height = `423px`;
                chat_display.style.transform = `translateY(-52px)`;
                return;
            };
            let tinggi = chat_input.scrollHeight - chat_input.clientHeight;
            input_text_container.style.height = `${parseInt(getComputedStyle_input_text_container.height.split('px')[0]) + tinggi}px`;
            chat_input.style.height = `${parseInt(getComputedStyle_chat_input.height.split('px')[0]) + tinggi}px`;
            chat_display.style.height = `${parseInt(getComputedStyle_chat_display.height.split('px')[0]) - tinggi}px`;
            chat_display.style.transform = `translateY(-${tinggi}px)`;
        }
    });

    fetch('/p/chat-load', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({user: user_data.username})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.status == 'murid') {
            data = data.data;
            console.log(data)
        } else {
            data = data.data;
        }

        for (let i = 0; i < chat_display_children.length; i++) {
            
        }
    });

    socket.on('chat-message', data => {
        console.log(data)
    })
});