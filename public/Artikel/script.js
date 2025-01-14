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
    document.getElementById('pilihan2-sidebar').addEventListener('click', () => {
        window.location.href = '/chat';
    });
    //=========================================================================

    //Search Bar================================================================
    let search_bar_input_content1 = document.getElementById('search-bar-input-content1');
    let search_icon_content1 = document.getElementById('search-icon-content1');
    let search_bar_content1 = document.getElementById('search-bar-content1');
    search_bar_input_content1.addEventListener('focus', () => {
        search_icon_content1.style.backgroundImage = "url('Data/Gambar/Icon/magnifying-glass-blue.svg')";
        search_icon_content1.style.opacity = '1';
        search_bar_content1.style.width = '400px';
        search_bar_content1.style.backgroundColor = 'rgba(204, 204, 204, 0.7)';
    });
    search_bar_input_content1.addEventListener('blur', () => {
        search_icon_content1.style.backgroundImage = "url('Data/Gambar/Icon/magnifying-glass-b.svg')";
        search_icon_content1.style.opacity = '0.5';
        search_bar_content1.style.width = '300px';
        search_bar_content1.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    });

    document.getElementById('tambah-artikel-content1').addEventListener('click', () => {
        window.location.href = '/artikel/tambah_artikel/';
    });
    //=========================================================================

    //Pilihan Filter===========================================================
    var tombol_filter_sedang_proses_animasi = false;
    let sk = document.getElementById('sk');
    let udn = document.getElementById('udn');
    let uln = document.getElementById('uln');
    function filter_click(parameter) {
        if (window.location.search.includes(`filter=${parameter}`)) {
            if (window.location.search.includes('search=')) {
                let search_split = window.location.search.split('?')[1].split('&');
                window.location.search = '?' + search_split[0];  
            } else {
                window.location.search = '';
            }
            return;
        }
        let apakah_filter_ada = window.location.search.includes('filter');
        if (apakah_filter_ada) {
            if (window.location.search.includes('search=')) {
                let search_split = window.location.search.split('?')[1].split('&');
                window.location.search = '?'+ search_split[0] + `&filter=${parameter}`
            } else {
                window.location.search = `?filter=${parameter}`
            }
        } else {
            window.location.search += `${window.location.search.includes('search=') ? '&' : '?'}filter=${parameter}`
        }
    }

    sk.addEventListener('click', () => {
        filter_click('sk')
    })
    udn.addEventListener('click', () => {
        filter_click('udn')
    })
    uln.addEventListener('click', () => {
        filter_click('uln')
    })

    document.getElementById('filter-content1').addEventListener('click', () => {
        if (tombol_filter_sedang_proses_animasi) return;
        tombol_filter_sedang_proses_animasi = true;

        let pilihan_filter_content1 = document.getElementById('pilihan-filter-content1');
        let filter_content1 = document.getElementById('filter-content1');
        let pilihan2_filter_di_pilihan_filter_content1 = document.getElementsByClassName('pilihan2-filter-di-pilihan-filter-content1');
        console.log(pilihan2_filter_di_pilihan_filter_content1)

        if (pilihan_filter_content1.style.width == '0px') {
            filter_content1.style.backgroundImage = "url('Data/Gambar/icon/filter-blue.svg')";
            pilihan_filter_content1.style.width = '300px'
            pilihan_filter_content1.style.boxShadow = '0px 0px 5px black';
            pilihan_filter_content1.style.border = '2px solid black';
            setTimeout(() => {
                Array.from(pilihan2_filter_di_pilihan_filter_content1).forEach(element => {
                    element.style.transition = 'background-color 0.3s ease, opacity 0.3s ease';
                    element.style.border = '2px solid rgba(128, 128, 128, 0.288)';
                    element.style.opacity = '1';
                });
                pilihan_filter_content1.style.height = '300px'
            }, 300);
        } else {
            filter_content1.style.backgroundImage = "url('Data/Gambar/icon/filter-b.svg')"
            pilihan_filter_content1.style.height = '0px'
            Array.from(pilihan2_filter_di_pilihan_filter_content1).forEach(element => {
                element.style.transition = 'background-color 0.3s ease, opacity 0.2s ease';
                element.style.border = 'none';
                element.style.opacity = '0';
            });
            setTimeout(() => {
                pilihan_filter_content1.style.width = '0px'
                setTimeout(() => {
                    pilihan_filter_content1.style.boxShadow = 'none';
                    pilihan_filter_content1.style.border = 'none';
                }, 300)
            }, 300);
        }
        setTimeout(() => {
            tombol_filter_sedang_proses_animasi = false;
        }, 600);
    });
    //=========================================================================

    //Memuat artikel terpublikasi==============================================
    const nama_nama_bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    if (window.sessionStorage.getItem('telahDibuka') === true) {
        window.sessionStorage.setItem('telahDibuka', false)
        window.location.reload();
    } else {
        window.sessionStorage.setItem('telahDibuka', true)
    }

    fetch('/artikel/p/muat-data/', {
        method: "GET",
        headers: {
            'Cache-Control' : 'no-cache'
        }
    })
    .then(response => response.json())
    .then(data => {
        const isi_list_artikel = document.getElementById('isi-list-artikel');
        isi_list_artikel.textContent = '';
        data.forEach(elemen => {
            let container_preview_artikel = document.createElement('div');
            let container_preview_judul_dan_logo_artikel = document.createElement('div');
            let container_preview_sampul_artikel = document.createElement('div');
            let container_preview_judul_artikel = document.createElement('div');
            let container_preview_logo_dan_nama_instansi_artikel = document.createElement('div');
            let container_preview_logo_artikel = document.createElement('div');
            let container_preview_nama_instansi_artikel = document.createElement('h5');
            let container_preview_teks_judul_artikel = document.createElement('h2');
            let format_waktu = elemen.tanggal.split('-');
            let bulan = nama_nama_bulan[parseInt(format_waktu[1])];

            container_preview_artikel.setAttribute('class', 'container-preview-artikel');
            container_preview_judul_dan_logo_artikel.setAttribute('class', 'container-preview-judul-dan-logo-artikel');
            container_preview_sampul_artikel.setAttribute('class', 'container-preview-sampul-artikel');
            container_preview_judul_artikel.setAttribute('class', 'container-preview-judul-artikel');
            container_preview_logo_dan_nama_instansi_artikel.setAttribute('class', 'container-preview-logo-dan-nama-instansi-artikel');
            
            isi_list_artikel.append(container_preview_artikel);
            container_preview_artikel.append(container_preview_judul_dan_logo_artikel);
            container_preview_artikel.append(container_preview_sampul_artikel);
            container_preview_judul_dan_logo_artikel.append(container_preview_judul_artikel);
            container_preview_judul_dan_logo_artikel.append(container_preview_logo_dan_nama_instansi_artikel);

            ['sampul', 'logo'].forEach(bagian => {
                if (elemen[bagian] === null) return
                fetch('/artikel/muat-data/ambil-gambar/', {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify( {image : elemen[bagian]})
                })
                .then(response => response.blob())
                .then(blob => {
                    if (bagian === 'sampul') {
                        container_preview_sampul_artikel.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
                    } else if (bagian === 'logo') {
                        container_preview_logo_artikel.setAttribute('class', 'container-preview-logo-artikel');
                        container_preview_logo_dan_nama_instansi_artikel.append(container_preview_logo_artikel);

                        container_preview_logo_artikel.style.backgroundImage = `url(${URL.createObjectURL(blob)})`
                    }

                    cari_artikel();
                    filter_artikel();
                })
                .catch((err) => {
                    console.error(err);
                });

            });
            container_preview_nama_instansi_artikel.setAttribute('class', 'container-preview-nama-instansi-artikel');
            container_preview_logo_dan_nama_instansi_artikel.append(container_preview_nama_instansi_artikel);
            container_preview_nama_instansi_artikel.textContent = elemen.nama_instansi[1] + ' • ' + `${format_waktu[2]} ${bulan} ${format_waktu[0]}`;

            container_preview_teks_judul_artikel.textContent = elemen.judul;
            container_preview_judul_artikel.append(container_preview_teks_judul_artikel);

            container_preview_artikel.setAttribute('title', elemen.judul);
            container_preview_artikel.addEventListener('click', () => {
                window.sessionStorage.setItem('artikel_pembuat_artikel', elemen.link)
                window.location.href = `/artikel/${elemen.judul}/`
            });

            container_preview_artikel.setAttribute('keywords', `${elemen.judul} ${elemen.nama_instansi[0].split("-").join(' ')} ${elemen.nama_instansi[1]}`.toLowerCase())
            container_preview_artikel.setAttribute('a_type', elemen.jenis_instansi)
        });

        
    })
    .catch((err) => {
        console.error(err);
    });

    //Search
    function lakukan_pencarian(yang_dicari) {
        let baseUrl = window.location.href.split("?")[0];
    
    // Ambil parameter `filter` jika ada
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get("filter");
    
    // Buat URL baru berdasarkan ada/tidaknya `filter`
    let newUrl = filter 
        ? `${baseUrl}?search=${yang_dicari}&filter=${filter}` 
        : `${baseUrl}?search=${yang_dicari}`;
    
    // Redirect ke URL baru
    window.location.href = newUrl;
    }
    function cari_artikel() {
        let kueri_pencarian = search_bar_input_content1.value.trim().toLowerCase().split(" ");
        if (kueri_pencarian[0] === '') return;
        let isi_list_artikel = document.getElementById('isi-list-artikel');
        let kumpulan_artikel = isi_list_artikel.children;
        for (let i = 0; i < kumpulan_artikel.length; i++) {
            let kata_kunci = kumpulan_artikel[i].getAttribute('keywords').split(' ');
            let terkualifikasi = kueri_pencarian.some(item => 
                kata_kunci.some(kata => kata.includes(item))
            );
            if (!terkualifikasi) {
                kumpulan_artikel[i].remove();
            }
        }
        if (kumpulan_artikel.length === 0) {
            isi_list_artikel.textContent = 'Hasil pencarian tidak ditemukan.';
        }
    }
    function filter_artikel() {
        let isi_list_artikel = document.getElementById('isi-list-artikel');
        let url_search = window.location.search.split('?')[1];
        let kumpulan_artikel = isi_list_artikel.children;
        if (url_search.includes('search=')) {
            url_search = url_search.split('&').find(item => item.includes('filter=')).split('=')[1];
        } else {
            url_search = url_search.split('=')[1];
        }
        
        for (let i = 0 ; i < kumpulan_artikel.length; i++) {
            if (kumpulan_artikel[i].getAttribute('a_type') !== url_search) {
                kumpulan_artikel[i].remove();
            }
        }
    }
    search_icon_content1.addEventListener('click', () => {
        let query = search_bar_input_content1.value.trim();
        if (query) {
            const encodedQuery = encodeURIComponent(query);
            lakukan_pencarian(encodedQuery);
        } else {
            window.location.href = window.location.href.split("?")[0];
            let filter = window.location.href.split('&')[1];
            if (filter) window.location.href = window.location.href.split("?")[0] + "?" + filter
        }
    });
    search_bar_input_content1.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            let query = search_bar_input_content1.value.trim();

            if (query) {
                const encodedQuery = encodeURIComponent(query);
                lakukan_pencarian(encodedQuery);
            } else {
                window.location.href = window.location.href.split("?")[0];
                let filter = window.location.href.split('&')[1];
                if (filter) window.location.href = window.location.href.split("?")[0] + "?" + filter
            }
        }
    })
    
    if (window.location.href.split("?").length === 2) {
        if (window.location.href.split("?")[1].split('&')[0].split("=")[0] === 'filter') return;
        try {
            search_bar_input_content1.value =new URLSearchParams(window.location.search).get('search')
                                            .replace(/%20/g, " ")
                                            .replace(/%23/g, "#")
                                            .replace(/%3F/g, "?")
                                            .replace(/%3E/g, ">")
                                            .replace(/%3C/g, "<")
                                            .replace(/%2F/g, "/")
                                            .replace(/%2C/g, ",")
                                            .replace(/%60/g, "`")
                                            .replace(/%40/g, "@")
                                            .replace(/%24/g, "$")
                                            .replace(/%25/g, "%")
                                            .replace(/%5E/g, "^")
                                            .replace(/%2F/g, "/")
                                            .replace(/%26/g, "&")
                                            .replace(/%2B/g, "+")
                                            .replace(/%3D/g, "=")
                                            .replace(/%7B/g, "{")
                                            .replace(/%7D/g, "}")
                                            .replace(/%5B/g, "[")
                                            .replace(/%5D/g, "]")
                                            .replace(/%3B/g, ";")
                                            .replace(/%3A/g, ":")
                                            .replace(/%27/g, "'")
                                            .replace(/%22/g, '"')
            } catch (err) {
                console.log('Search kosong')
            }
    }
    

    let isi_list_artikel = document.getElementById('isi-list-artikel');
    let kueri_pencarian = search_bar_input_content1.value.trim().toLowerCase().split(" ");
    let kumpulan_artikel = isi_list_artikel.children;
    for (let i = 0; i < kumpulan_artikel.length; i++) {
        let kata_kunci = kumpulan_artikel[i].getAttribute('keywords').split(' ');
        let terkualifikasi = kueri_pencarian.some(item => kata_kunci.includes(item));
        if (!terkualifikasi) {
            kumpulan_artikel[i].remove();
        } else {
            kumpulan_artikel[i].setAttribute("terkualifikasi", true);
        }
    }

});