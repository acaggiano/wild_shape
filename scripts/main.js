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
    level: 1,
    view: {
        text: 'View All',
        all: false,
    },
    search: '',
},
watch: {
    search: function() {
        console.log(this.search);
    },
    circle: function() {
        if(this.circle) {
        console.log(this.view.all);
            this.view.all = false;
        }
    },
    'view.all': function() {
         if(this.view.all) {
            this.circle = '';
                            this.view.text = 'Clear All';
                 }
                 else {
                          this.view.text = 'View All';
                 }
    }
},
methods: {
    increment: function() {
        if (this.level < 20)
            this.level += 1;
    },
        decrement: function() {
        if (this.level > 1)
            this.level -= 1;
    },
},
computed: {
filteredBeasts: function() {
    if(this.view.all) {
        return this.beasts.filter(function (beast) {
            return beast.name.toLowerCase().includes(app.search.toLowerCase());
        });
    }
    else{
    if(this.circle === "Moon"){
        if(this.level >= 2 && this.level < 4) {
            return this.beasts.filter(function (beast) {
                return !beast.speed.includes('fly') && !beast.speed.includes('swim') && beast.challenge <= 1;
                });
        }
        else if(this.level >= 4 && this.level < 6) {
            return this.beasts.filter(function (beast) {
                return !beast.speed.includes('fly') && beast.challenge <= 1;
                                });
        }
        else if(this.level >= 6 && this.level < 8){
            return this.beasts.filter(function (beast) {
                return !beast.speed.includes('fly') && beast.challenge <= Math.trunc(app.level/2);
                                });
        }
        else if(this.level >= 8){
            return this.beasts.filter(function (beast) {
                                        return beast.challenge <= Math.trunc(app.level/2);
                                });
        }
    }
    else if(this.circle != '') {
        if(this.level >= 2 && this.level < 4) {
            return this.beasts.filter(function (beast) {
                                return !beast.speed.includes('fly') && !beast.speed.includes('swim') && beast.challenge <= .25;
                            });
        }
        else if(this.level >=4 && this.level < 8) {
            return this.beasts.filter(function (beast) {
                                        return !beast.speed.includes('fly') && beast.challenge <= .5;
                                });
        }
        else if(this.level >= 8) {
            return this.beasts.filter(function (beast) {
                                        return beast.challenge <= 1;
                                });
        }
    }
    }

},
}
})

loadJSON(function(response) {
app.beasts = JSON.parse(response);
});