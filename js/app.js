let sessionLoc = new Session();
sessionLoc = sessionLoc.getSession();

if (sessionLoc !== "") {
    window.location.href = "hexa.html";
}


//poziv elemenata iz DOM
const prikazEl = document.querySelector('.custom_modal');
const zatvoriEl = document.querySelector('#closeModal');
const prikaziEl = document.querySelector('#registracija');
const formaZaRegisEl = document.querySelector('#registrationForm');
const formaZaLogEl = document.querySelector('#loginForm');


zatvoriEl.addEventListener('click', () => {
	prikazEl.style.display = 'none'
})


prikaziEl.addEventListener('click', () => {
	prikazEl.style.display = 'block'
})



let konfiguracija = {
    'korisnicko_ime': {
        potrebno: true,
        minDuzina: 5,
        maxDuzina: 50
    },

    'register_email': {
        potrebno: true,
        email: true,
        minDuzina: 5,
        maxDuzina: 50
    },

    'register_lozinka': {
        potrebno: true,
        minDuzina: 7,
        maxDuzina: 25,
        gadjaSeSa: 'ponovi_lozinku'
    },

    'ponovi_lozinku': {
        potrebno: true,
        minDuzina: 7,
        maxDuzina: 25,
        gadjaSeSa: 'register_lozinka'
    }
}

/**
 * Ovo je ono kao kada se pravi osoba1 od new Osoba
 * i ima konfiguraciju za argument
 */
let validator = new NoviValidator(konfiguracija, '#registrationForm');

formaZaRegisEl.addEventListener('submit', e => {
    e.preventDefault();

    if (validator.validationPassed()) {
        /**
         * potreban nam je backend, neki server, baza podataka,
            koristimo mockAPI
         */
        let user = new User();
        user.username = document.querySelector('#korisnicko_ime').value;
        user.email = document.querySelector('#email').value;
        user.password = document.querySelector('#lozinka').value;
        user.create();
    } else {
        alert('Polja nisu dobro popunjena')
    }
});


formaZaLogEl.addEventListener('submit', e => {
    e.preventDefault();

    let emailEl = document.querySelector('#login_email').value;
    let passwordEl = document.querySelector('#login_lozinka').value;

    let user = new User();
    user.email = emailEl;
    user.password = passwordEl;
    user.login();
})