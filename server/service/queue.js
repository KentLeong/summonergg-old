const fs = require('fs');
const log = require('../config/log');
const dev = require('../config/dev');

Array.prototype.asyncForEach = async function(cb) {
  for(let i=0; i<this.length; i++) {
    await cb(this[i], i, this)
  }
}

module.exports = (region) => {
  var local = require('../config/localClient')(region);
  return {
    async getMatches(callback) {
      try {
        var res = await local.get('/setup/matches/');
        log(`Retrieved ${res.data.length} matches`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Couldn't retrieve matches`, 'error');
        callback(false)
      }
    },
    async getProfiles(callback) {
      try {
        var res = await local.get('/setup/profiles/');
        log(`Retrieved ${res.data.length} profiles`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Couldn't retrieve profiles`, 'error');
        callback(false)
      }
    },
    async getSummoners(callback) {
      try {
        var res = await local.get('/setup/summoners/');
        log(`Retrieved ${res.data.length} summoners`, 'success')
        callback(res.data)
      } catch(err) {
        log(`Couldn't retrieve summoners`, 'error');
        callback(false)
      }
    },
    async newMatch(id) {
      try {
        var res = await local.post('/setup/matches/', {gameId: id});
        log(`GameID: ${id} added to the match queue`, 'success')
      } catch(err) {
        log(`Couldn't add ${id} to the match queue`, 'error');
      }
    },
    async newProfile(profile) {
      try {
        var res = await local.post('/setup/profiles/', {profile: profile});
        log(`${profile.name} added to the profile queue`, 'success')
      } catch(err) {
        log(`Couldn't add ${profile.name} to the profile queue`, 'error');
      }
    },
    async newSummoner(summoner) {
      try {
        var res = await local.post('/setup/summoners/', {summoner: summoner});
        log(`${summoner.name} added to the summoenr queue`, 'success')
      } catch(err) {
        log(`Couldn't add ${summoner.name} to the queue`, 'error');
      }
    },
    async deleteMatch(id) {
      try {
        var res = await local.delete('/setup/matches/'+id);
        log(`${id} removed from match queue`, 'success')
      } catch(err) {
        log(`Couldn't remove ${id} to the match queue`, 'error');
      }
    },
    async deleteProfile(id) {
      try {
        var res = await local.delete('/setup/profiles/'+id);
        log(`${id} removed from profile queue`, 'success')
      } catch(err) {
        log(`Couldn't remove ${id} to the profile queue`, 'error');
      }
    },
    async deleteSummoner(id) {
      try {
        var res = await local.delete('/setup/summoners/'+id);
        log(`${id} removed from summoner queue`, 'success')
      } catch(err) {
        log(`Couldn't remove ${id} to the summoner queue`, 'error');
      }
    }
  }
}