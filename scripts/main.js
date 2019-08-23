function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/beasts.json', true);
    xobj.onreadystatechange = function () {
        if(xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var app = new Vue({
    el: '#app',
    data: {
        beasts: [],
        circle: '',
        level: 2,
        view: {
            text: 'View All',
            all: false,
        },
        search: '',
        sort: 'name',
        reverseToggle: false,
    },
    watch: {
        level: function() {
            if(this.level == '')
                this.level = 2;
        },
        circle: function() {
            if(this.circle) {
                this.view.all = false;
            }
        },
        'view.all': function() {
            if(this.view.all) {
                this.circle = '';
                this.view.text = 'Clear All';
                this.search = '';
            }
            else {
                this.view.text = 'View All';
                this.reverseToggle = false;
                this.search = '';
            }
        },
        sort: function() {
            this.reverseToggle = false;
            this.sortBeasts();
        },
        reverseToggle: function() {
            this.sortBeasts();
        },
    },
    methods: {
        increment: function() {
            if (this.level < 20)
                this.level += 1;
            else
                this.level = 2;
        },
            decrement: function() {
            if (this.level > 2)
                this.level -= 1;
        },
        sortBeasts: function() {
            if(this.sort == 'name') {
                this.beasts = _.orderBy(this.beasts, 'name', this.reverseToggle ? 'desc':'asc');
            }
            else if (this.sort == 'size') {
                this.beasts = _.orderBy(this.beasts, [function(beast) {
                    var size = {
                        "Tiny": 1,
                        "Small": 2,
                        "Medium": 3,
                        "Large": 4,
                        "Huge": 5,
                        "Gargantuan": 6
                    };
    
                    return size[beast.size];
                }, 'name'], [this.reverseToggle ? 'desc':'asc', 'asc']);
            }
            else if(this.sort == 'challenge') {
                this.beasts = _.orderBy(this.beasts, [(beast) => parseFloat(beast.challenge), 'name'], [this.reverseToggle ? 'desc':'asc', 'asc']);
            }
        },
    },
    computed: {
        message: function() {
            if(this.circle == '') {
                if(this.view.all)
                    return "Displaying All Beasts";
                else
                    return "Please select a circle";
            }

            else if(this.level > 20 || this.level < 2) {
                return "Please enter a valid level";
            }
        },
        filteredBeasts: function() {
            var no_fly = (beast) => !beast.speed.includes('fly');
            var no_swim = (beast) => !beast.speed.includes('swim');
            var challenge_lte = (beast, level) => beast.challenge <= level;
            var search = (beast, term) => beast.name.toLowerCase().includes(term.toString().toLowerCase());

            var func = (x, y) => false;

            if(!this.view.all) {
                if(this.circle == 'Moon') {
                    if(this.level >= 2 && this.level < 4) {
                        func = (beast) => no_fly(beast) && no_swim(beast) && challenge_lte(beast, 1);
                    }
                    else if(this.level >= 4 && this.level < 6){
                        func = (beast) => no_fly(beast) && challenge_lte(beast, 1);
                    }
                    else if(this.level >=6 && this.level < 8){
                        func = (beast) => no_fly(beast) && challenge_lte(beast, app.level / 3);
                    }
                    else if(this.level >= 8 && this.level < 21){
                        func = (beast) => challenge_lte(beast, app.level / 3);
                    }
                }
                else if(this.circle == 'Land') {
                    if(this.level >= 2 && this.level < 4)
                        func = (beast) => no_fly(beast) && no_swim(beast) && challenge_lte(beast, .25);
                    else if(this.level >=4 && this.level < 8)
                        func = (beast) => no_fly(beast) && challenge_lte(beast, .5);
                    else if(this.level >=8)
                        func = (beast) => challenge_lte(beast, 1);
                }
            }
            else {
                func = (x, y) => true;
            }
        
            return this.beasts.filter((beast) => func(beast) && search(beast, app.search));
        },
    },
    filters: {
        fraction: function (value) {
            if(!value) return '';
            value = value.toString();
            if(value == '.125') return '1/8';
            else if(value == '.25') return '1/4';
            else if(value == '.5') return '1/2';
            else return value;
        }
    }
});

loadJSON(function(response) {
    app.beasts = JSON.parse(response);
});
