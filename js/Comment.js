class Comment {
    post_id = '';
    user_id = '';
    content = '';
    api_url = 'https://62bc49d2eff39ad5ee21d752.mockapi.io';

    create() {
        let podatak = {
            post_id: this.post_id,
            user_id: this.user_id,
            content: this.content
        };

        podatak = JSON.stringify(podatak);

        fetch(this.api_url + '/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: podatak
        })
        .then(odgovor => odgovor.json())
        .then(() => {alert('Postavljen komentar')});
    }

    async get(post_id) {
        let api_url = this.api_url + '/comments';

        const odgovor = await fetch(api_url);
        const podatak = await odgovor.json();
        let post_comments = [];

        let i = 0;
        podatak.forEach(item => {
            if (item.post_id === post_id) {
                post_comments[i] = item;
                i++;
            }
        });

        return post_comments;
    }
}