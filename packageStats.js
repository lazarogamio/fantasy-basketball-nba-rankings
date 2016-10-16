var fs = require('fs')
var _ = require('underscore')

var readAndReturnJSON = function(file) {
	return JSON.parse(fs.readFileSync(file))
}

console.debug = console.log

var expertsConsensus = _.indexBy(readAndReturnJSON('./expert-consensus.json'), ' Player Name ')
var adpConsesus = _.indexBy(readAndReturnJSON('./adp-consensus.json'), ' Player Name ')
var projections = readAndReturnJSON('./projections.json')
var teamNames = readAndReturnJSON('./acronymTranslator.json')

var makeRankings = function(name) {
	
	rankingObject = {}

	// Yahoo
	if ( adpConsesus.hasOwnProperty(name) && adpConsesus[name].hasOwnProperty('Yahoo ') ) {
		rankingObject.yahoo = parseFloat(adpConsesus[name]['Yahoo '])	
	} else {
		rankingObject.yahoo = null
	}

	// ESPN
	if ( adpConsesus.hasOwnProperty(name) && adpConsesus[name].hasOwnProperty(' ESPN ') ) {
		rankingObject.espn = parseFloat(adpConsesus[name][' ESPN '])	
	} else {
		rankingObject.espn = null
	}

	// CBS
	if ( adpConsesus.hasOwnProperty(name) && adpConsesus[name].hasOwnProperty(' CBS ') ) {
		rankingObject.cbs = parseFloat(adpConsesus[name][' CBS '])	
	} else {
		rankingObject.cbs = null
	}

	// FP
	if ( adpConsesus.hasOwnProperty(name) && adpConsesus[name].hasOwnProperty('ADP ') ) {
		rankingObject.fantasyPros = parseFloat(adpConsesus[name]['ADP '])	
	} else {
		rankingObject.fantasyPros = null
	}

	// Expert Best
	if ( expertsConsensus.hasOwnProperty(name) && expertsConsensus[name].hasOwnProperty(' Best Rank ') ) {
		rankingObject.expBest = parseFloat(expertsConsensus[name][' Best Rank '])	
	} else {
		rankingObject.expBest = null
	}

	// Expert Worst
	if ( expertsConsensus.hasOwnProperty(name) && expertsConsensus[name].hasOwnProperty(' Worst Rank ') ) {
		rankingObject.expWorst = parseFloat(expertsConsensus[name][' Worst Rank '])	
	} else {
		rankingObject.expWorst = null
	}

	// Expert avg
	if ( expertsConsensus.hasOwnProperty(name) && expertsConsensus[name].hasOwnProperty(' Ave Rank ') ) {
		rankingObject.expAvg = parseFloat(expertsConsensus[name][' Ave Rank '])	
	} else {
		rankingObject.expAvg = null
	}

	return rankingObject

}

var niceData = []

_.each(projections, function(elem) {

	var niceObj = {}
	
	// Basic bio
	niceObj.name = elem['Player Name ']
	niceObj.position = elem['Position ']
	niceObj.teamAcronym = elem['Team ']
	niceObj.fullTeamName = teamNames[niceObj.teamAcronym]

	// Stats
	niceObj.basicStats = {
		'points' : elem[' PTS'],
		'rebounds' : elem['REB'],
		'assists' : elem['AST'],
		'block' : elem['BLK'],
		'steals' : elem['STL'],
		'fgperc' : elem['FG%'],
		'ftperc' : elem['FT%'],
		'threes' : elem['3PM'],
		'games' : elem['GP'],
		'min' : elem['MIN'],
		'to' : elem['TO'],
	}

	// Projections
	niceObj.projections = makeRankings(niceObj.name)

	niceData.push(niceObj)

})

fs.writeFileSync('data.json', JSON.stringify(niceData))