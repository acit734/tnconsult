window.addEventListener('DOMContentLoaded', function() {
  // Gambar berubah-ubah=======================================================
  var gambar_login = document.querySelector('#gambar-latar');
    fetch('Data/Data/data_gambar.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const gambar = data.gambar;
        let indeks = 0;

        function gantiGambar() {
          indeks = (indeks + 1) % gambar.length;
          gambar_login.style.backgroundImage = `url("${gambar[indeks]}")`;
        }

        gambar_login.style.backgroundImage = `url("${gambar[indeks]}")`;

        setInterval(gantiGambar, 5000);
        })
      .catch(error => {
        console.error('There was a problem fetching the data:', error);
      });
  //===========================================================================

  //Ngambil dan verif password=================================================
  let tombol = document.getElementById('submit');
  tombol.addEventListener('click', function() {
    event.preventDefault();
    var username = document.getElementById('user').value;
    var password = document.getElementById('passw').value;
    var pesan = document.getElementById('pesan');
    var pembatas = document.getElementById('pembatas-2');
    var isi_pesan = document.getElementById('isi-pesan');

    function masukkan_pesan(pesannya, berhasilkah) {
      pembatas.style.height = '25px';
      setTimeout(function() { pesan.style.opacity = '1'; }, 1000);
      isi_pesan.innerHTML = `<strong>${pesannya}</strong>`;
      pesan.style.backgroundColor = berhasilkah ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)';
      pesan.style.border = berhasilkah ? '2px solid rgb(0, 255, 0)' : '2px solid rgb(255, 0, 0)';
    }

    if (username == "" && password == "") {
      masukkan_pesan("User dan Passwordnya di isi dlu syg", false);
    } else if (password == "") {
      masukkan_pesan("Lupa pw banh ?", false)
    } else if (username == "") {
      masukkan_pesan("Hoho kamu siapa...?", false)
    } else {
      fetch('/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          masukkan_pesan(`Selamat datang, ${data.username}!`, true);
          setTimeout(() => {
            window.sessionStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/menu_page';
          }, 2000);
        } else {
          masukkan_pesan('User atau Password salah.', false);
        }
      })
      .catch(error => {
        console.error('There was a problem fetching the data:', error);
      });
    }
  });
  //===========================================================================

  //Intro dlu ges==============================================================
  let logo_intro = document.getElementById('logo-intro');
  logo_intro.style.opacity = '1';
  logo_intro.style.transform = 'rotate(45deg) translateX(40%) translateY(-70%) scale(1.1)';

  let banner = document.getElementById('banner');
  banner.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';

  let intro = document.getElementById('intro');
  setTimeout(function() {intro.style.opacity = '0';}, 1000);
  setTimeout(function() {intro.remove();}, 1300);
  //===========================================================================

  //Info kicau mania===========================================================
  //Ngga jadi wak 😭==========================================================
});