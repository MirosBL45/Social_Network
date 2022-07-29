class Session {
    user_id = '';

    startSession() {
        const day = new Date();
        day.setTime(day.getTime() + (2*24*60*60*1000));
        let isticeCookie = "expires=" + day.toUTCString();
        document.cookie = "user_id=" + this.user_id + ";" + isticeCookie;
    }

    getSession() {
        let ime = 'user_id=';
        let kolacic = document.cookie.split(';');

        for (let i = 0; i < kolacic.length; i++) {
            let lacko = kolacic[i];
            while (lacko.charAt(0) == ' ') {
                lacko = lacko.substring(1);
            }
            if (lacko.indexOf(ime) == 0) {
                return lacko.substring(ime.length, lacko.length);
            }
        }

        return "";
    }

    destroySession() {
        let kolacic = document.cookie.split(";");

        for (let i = 0; i < kolacic.length; i++) {
            let element = kolacic[i];
            let eqPos = element.indexOf("=");
            let ime = eqPos > -1 ? element.substr(0, eqPos) : element;
            document.cookie = ime + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            
        }
    }
}