var related, comments, length, scope;
var defaultChannels = {
    "UCQJT7rpynlR7SSdn3OyuI_Q" : { name: "0LoLEventVods", run: true },
    "UCeyxJjDWDBg6moUMDj9j4Kg" : { name: "1CSEventVods", run: true },
    "UCr5TB_3vBI0-WHuDCd3du9g" : { name: "2DotaVods", run: true },
    "UC6cCL29i24P9wT8Kws2iq4Q" : { name: "3HSVods", run: true },
    "UCPhab209KEicqPJFAk9IZEA" : { name: "4Onivia", run: true },
    "UCLhS7bMcch5vodboEGpIPlg" : { name: "6What A Play", run: true },
    "UCvqRdlKsE5Q8mf8YXbdIJLw" : { name: "6LolEsports", run: true },
    "UC-I8d_BjKP6MMsYjZhAtjIA" : { name: "6LolEsports Latino", run: true },
    "UCmvoPMHe9l0ytr9ONu5-1vw" : { name: "6Riot Games Latino", run: true },
    "UCJ6EyrObjc396m3MToJhblQ" : { name: "6LolEsports Oce", run: true },
    "UCiN3B0QRdL4wn1TMJ_cJyMQ" : { name: "6LolEsports Japan", run: true },
    "UC48rkTlXjRd6pnqqBkdV0Mw" : { name: "6LolEsports Brasil", run: true },
    "UCCqnLewexMM7LwGzqpMpPrA" : { name: "6Garena TW", run: true },
    "UCGA73hIgOhANAW_ruTXDKig" : { name: "6Alphadraft", run: true },
    "UC0G2qz-hoaCswQNgoWU_LTw" : { name: "5ESL", run: true },
    "UCPvn7OUsnyc9hINqbY7EmCA" : { name: "6CSGO TV", run: true },
    "UC3EVJoJw7OajdrYmBfCvcdw" : { name: "6FaceIt", run: true },
    "UCBvPF-tKhZVrp_mW_sXAKsg" : { name: "6Game On", run: true },
    "UCbEhNEf6zVdmd4C61Ayvv2w" : { name: "5joindota", run: true },
    "UCQfAxSNTJvLISaFNJ0Dmg8w" : { name: "5Beyond The Summit", run: true },
    "UCbHRJG9q56QvNypQTYNOAtQ" : { name: "6CoolDota2 TV", run: true },
    "UCTQ4Q67NXJVn_dr_BCbh2EA" : { name: "6Hefla TV", run: true },
    "UCJN4ouJkqCpo6OwoK_bEWbA" : { name: "6Rasmus TV", run: true },
    "UCrZTN5qnHqGhZglG3wUWKng" : { name: "6Reynad", run: true },
    "UCP5L0BTkW1pYxlyo6jF2Gvw" : { name: "6TempoStorm", run: true },
    "UCv3orfdLg5rLIg6qnkCcitA" : { name: "6LoL Esports VODs & Highlights", run: true }
};

function initialise() {
    related = document.getElementById('related');
    comments = document.getElementById('comments');
    length = document.getElementById('length');
    chrome.storage.sync.get({
        related: true,
        comments: true,
        length: true,
        channels: defaultChannels
    }, (items) => {
        var update = false;
        related.checked = items.related;
        comments.checked = items.comments;
        length.checked = items.length;
        scope = angular.element('body').scope();
        scope.$apply(function(){
            scope.channels = items.channels;//items.channels;
        });
        for(var key in defaultChannels){
            if(typeof channels[key] == "undefined"){
                channels[key] = defaultChannels[key];
                chrome.storage.sync.set({
                    channels: channels
                });
            }
        }
    });
    related.addEventListener('change', saveChanges);
    comments.addEventListener('change', saveChanges);
    length.addEventListener('change', saveChanges);
}

function saveChanges() {
    chrome.storage.sync.set({
        related: related.checked,
        comments: comments.checked,
        length: length.checked
    });
}

document.addEventListener('DOMContentLoaded', initialise, false);