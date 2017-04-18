var _this = this;
(function () {
    'use strict';
}());
var request = require('request');
var perference = require('./preference.js');
var testjson = require('./test.js');
var api_key = 'RGAPI-2c57be6f-0f51-42cc-b54c-d62f19e26023';
// console.log(request);
var playstat = (function () {
    function playstat(id) {
        this.id = id + '';
    }
    playstat.prototype.getNear = function () {
        return this.near;
    };
    playstat.prototype.setNear = function (near) {
        this.near = near;
    };
    playstat.prototype.returnJson = function (error, response, data, fun) {
        if (!error && response.statusCode == 200) {
            data = JSON.parse(data);
            this.near = data;
            fun(data);
        }
        else {
            console.log(response.statusCode);
        }
    };
    playstat.prototype.getCurrent = function (fun) {
        var _this = this;
        var url = 'https://na.api.riotgames.com/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/' + this.id + '?api_key=' + api_key;
        request(url, function (error, response, data) {
            _this.returnJson(error, response, data, fun);
        });
    };
    playstat.prototype.getRecent = function (fun) {
        var _this = this;
        var url = 'https://na.api.riotgames.com/api/lol/NA/v1.3/game/by-summoner/' + this.id + '/recent?api_key=' + api_key;
        request(url, function (error, response, data) {
            _this.returnJson(error, response, data, fun);
        });
    };
    playstat.prototype.analysisNear = function () {
        //mid,bot,top,sup,jungle
        var people = [[], []];
        var ids = [[], []];
        var result = [[], []];
        var participants = this.near['participants'];
        for (var i = 0; i < participants.length; i++) {
            var champid = participants[i]['championId'];
            var summorskill = [participants[i]['spell1Id'], participants[i]['spell2Id']];
            var lane = perference.getlane(champid);
            for (var j = 0; j < summorskill.length; j++) {
                lane = perference.weightspell(summorskill[j], lane);
            }
            if (participants[i]['teamId'] == 100) {
                people[0].push(lane);
                ids[0].push(champid);
                // console.log(champid);
            }
            else {
                people[1].push(lane);
                ids[1].push(champid);
            }
        }
        //mid,bot,top,sup,jungle
        for (var i = 0; i < people.length; i++) {
            for (var j = 0; j < people[i].length; j++) {
                var ar = [];
                for (var k = 0; k < people[i].length; k++) {
                    ar.push(people[i][k][j]);
                }
                result[i].push(perference.getChampName(ids[i][nodefunctions.smallest(ar)]));
                people[i][nodefunctions.smallest(ar)] = [6, 6, 6, 6, 2.5];
            }
        }
        return result;
    };
    return playstat;
}());
var nodefunctions = {
    smallest: function (array) {
        var smalllest = array[0];
        var pointer = 0;
        for (var i = 1; i < array.length; i++) {
            if (array[i] < smalllest) {
                smalllest = array[i];
                pointer = i;
            }
        }
        return pointer;
    },
    terminal: function (array) {
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                switch (j) {
                    case 0:
                        console.log('Mid:' + array[i][j]);
                        break;
                    case 1:
                        console.log('Bot:' + array[i][j]);
                        break;
                    case 2:
                        console.log('Top:' + array[i][j]);
                        break;
                    case 3:
                        console.log('Sup:' + array[i][j]);
                        break;
                    case 4:
                        console.log('Jungle:' + array[i][j]);
                        break;
                }
            }
        }
    },
    getSummonerId: function (id, fun) {
        var url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + id + '?api_key=' + api_key;
        request(url, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                data = JSON.parse(data);
                _this.near = data;
                fun(data);
            }
            else {
                console.log(response.statusCode);
            }
        });
    }
};
// nodefunctions.getSummonerId('apollo', (data) => {
//     var miao = new playstat(data.id);
//     miao.getCurrent(data => {
//         console.log(data);
//         console.log(miao.analysisNear());
//     })
//     // console.log(data.id);
// })
var miao = new playstat(123);
miao.setNear(testjson);
nodefunctions.terminal(miao.analysisNear());
// miao.getCurrent((data) => {
//     console.log(data);
// })
