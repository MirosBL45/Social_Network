class User {
    user_id = '';
    username = '';
    email = '';
    password = '';
    api_url = 'https://62bc49d2eff39ad5ee21d752.mockapi.io';


    create() {
        let data = {
            username: this.username,
            email: this.email,
            password: this.password
        }

        data = JSON.stringify(data);

        fetch(this.api_url + '/users', {
            method: 'POST',
            //POST sluzi za kreiranje necega
            //GET za citanje necega
            //PUT za menjanje
            //DELETE za brisanje
            headers: {
                'Content-Type': 'application/json'
            },
            //body je sta saljemo
            body: data
        })
            .then(response => response.json())
            .then(podatakIzBaze => {
                let session = new Session();
                session.user_id = podatakIzBaze.id;
                session.startSession();

                window.location.href = 'hexa.html';
            });
    }


    async get(user_id) {
        let api_url = this.api_url + '/users/' + user_id;

        let response = await fetch(api_url);
        let podatakIzBaze = await response.json();

        return podatakIzBaze;
    }


    edit() {
        let podatak = {
            username: this.username,
            email: this.email
        };

        podatak = JSON.stringify(podatak);

        let session = new Session();
        session_id = session.getSession();

        fetch(this.api_url + '/users/' + session_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: podatak
        })
            .then(odgovor => odgovor.json())
            .then(() => {
                window.location.href = 'hexa.html'
            });
    }


    login() {
        /**
         * ne mora da se pise method GET jer se on podrzumeva,
         * a ostali se uvek pisu, PUT, POST, DELETE
         */
        fetch(this.api_url + '/users')
            .then(response => response.json())
            .then(podatakIzBaze => {

                let uspesan_login = 0;

                podatakIzBaze.forEach(db_user => {
                    if (db_user.email === this.email && db_user.password === this.password) {
                        let session = new Session();
                        session.user_id = db_user.id;
                        session.startSession();
                        uspesan_login = 1;
                        window.location.href = 'hexa.html';
                    }
                });

                if (uspesan_login === 0) {
                    alert('Pogresan email ili lozinka');
                }
            })
    }

    delete() {
        let session = new Session();
        session_id = session.getSession();

        fetch(this.api_url + '/users/' + session_id, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => {
                let session = new Session();
                session.destroySession();

                window.location.href = "/";
            })
    }
}

/**
 * Cookie “user_id” does not have a proper “SameSite” attribute value.
 * Soon, cookies without the “SameSite” attribute or with an invalid
 * value will be treated as “Lax”. This means that the cookie will
 * no longer be sent in third-party contexts. If your application depends
 * on this cookie being available in such contexts, please add the
 * “SameSite=None“ attribute to it. To know more about the “SameSite“ attribute,
 * read https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite
 */