class Post {
    post_id = '';
    post_content = '';
    user_id = '';
    likes = '';
    api_url = 'https://62bc49d2eff39ad5ee21d752.mockapi.io';

    async create() {
        let session = new Session();
        session_id = session.getSession();

        let data = {
            //ovo su oni nazivi stavki iz mockAPI
            user_id: session_id,
            content: this.post_content,
            likes: 0
        }

        data = JSON.stringify(data);

        let odgovor = await fetch(this.api_url + '/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        data = await odgovor.json();

        return data;
    }

    async getAllPosts() {
        let odgovor = await fetch(this.api_url + '/posts');
        let podatak = await odgovor.json();
        return podatak;
    }

    like(post_id, likes) {
        let podatak = {
            likes: likes
        };

        podatak = JSON.stringify(podatak);

        fetch(this.api_url + '/posts/' + post_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: podatak
        })
            .then(odgovor => odgovor.json())
            .then(() => { alert('Post lajkovan!!!') });
    }

    delete(post_id) {
        fetch(this.api_url + '/posts/' + post_id, {
            method: 'DELETE'
        })
            .then(odgovor => odgovor.json())
            .then(() => { alert('Post obrisan') });
    }
}