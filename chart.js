var chart = {}

var currXOrd = null
var currYOrd = null
var currInitialPick = 1
var currLeagueSize = 8
var currDraftMode = 'normal'
var currW = null
// ======
var currXlabel = null
var currYlabel = null

function slugify(text) {
	return text.toString().toLowerCase()
	.replace(/\s+/g, '-')           // Replace spaces with -
	.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	.replace(/\-\-+/g, '-')         // Replace multiple - with single -
	.replace(/^-+/, '')             // Trim - from start of text
	.replace(/-+$/, '');            // Trim - from end of text
}

var prettyTickValues = [
	1,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,
	105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,
	205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,
]

var makeSettings = function(data) {

	var singleW = 10
	var singleH = 300
	
	var margin = {
		'top' : 40,
		'right' : 50,
		'bottom' : 50,
		'left' : 50
	}

	var chartW = margin.left + margin.right + (data.length * singleW)
	var chartH = margin.top + margin.bottom + singleH

	return {
		'singleH' : singleH,
		'singleW' : singleW,
		'margin' : margin,
		'chartH' : chartH,
		'chartW' : chartW
	}

}

var checkScreenPositionAndReturnClass = function(event) {

	var w = window
	var d = document
	var e = d.documentElement
	var g = d.getElementsByTagName('body')[0]
	var w = w.innerWidth || e.clientWidth || g.clientWidth

	if ( event.screenX < w*.18 ) {
		return 'snap-left'
	} else if ( event.screenX > w*.82 ) {
		return 'snap-right'
	} else {
		return 'snap-center'
	}

}

var makeDraftOrder = function(initialPick, numberOfPlayers, draftMode) {

	var picks = [initialPick]
	var currentPick = initialPick

	while (currentPick < 300) {

		if (draftMode == 'normal') {

			var newPick = currentPick + numberOfPlayers
			picks.push(newPick)
			currentPick = newPick

		}

		if (draftMode == 'serpentine') {

			var newPick = currentPick + (numberOfPlayers*2)
			picks.push(newPick)
			picks.push(newPick+1)
			currentPick = newPick+1

		}

	}

	return picks

}

chart.initialize = function(options) {

	var settings = makeSettings(options.data)
	
	var xScale = d3.scaleLinear()
		.domain([1,300])
		.range([0, settings.singleW*300])

	var yScale = d3.scaleLinear()
		.range([0, -settings.singleH])

	var color = d3.scaleLinear()
		.domain([14,38])
		.range(['#aaa', '#e6550d'])
		.clamp(true)

	var makeBandLabels = function(elem, data) {

		labels = elem.selectAll('text')
			.data(data)
		
		labels.enter().append('text')
			
		labels.exit().remove()

		labels = elem.selectAll('text')
			.attr('class', 'band-label')
			.attr('y', -4)
			.attr('x', function(d) {
				return xScale(d) + (settings.singleW/2)
			})
			.text(function(d) {
				return d
			})


	}

	var axi = d3.selectAll(options.chartAxis)
		.append('svg')
		.attr('width', 40)
		.attr('height', settings.chartH)

	var theLeftAxis = d3.select('.fixed-axis.axis-left svg')
		.append('g')
		.attr('transform', 'translate(40,'+(settings.chartH-settings.margin.bottom)+')')

	var theRightAxis = d3.select('.fixed-axis.axis-right svg')
		.append('g')
		.attr('transform', 'translate(0,'+(settings.chartH-settings.margin.bottom)+')')

	var shell = d3.select(options.chartBody)
		.append('svg')
		.attr('width', settings.chartW)
		.attr('height', settings.chartH)

	var bands = shell.append('g')
		.attr('class', 'chart-bands')
		.attr('transform', 'translate('+settings.margin.left+','+settings.margin.top+')')

	var bandLabels = shell.append('g')
		.attr('class', 'chart-bands-labels')
		.attr('transform', 'translate('+settings.margin.left+','+settings.margin.top+')')

	var axisLines = shell.append('g')
		.attr('class', 'chart-axis-lines')
		.attr('transform', 'translate('+settings.margin.left+','+(settings.chartH-settings.margin.bottom)+')')

	var axisBottom = shell.append('g')
		.attr('class', 'chart-axis-bottom')
		.attr('transform', 'translate('+(settings.margin.left + settings.singleW/2)+','+(settings.chartH-settings.margin.bottom)+')')

	var chartBody = shell.append('g')
		.attr('transform', 'translate('+settings.margin.left+','+settings.margin.top+')')

	var playerName = chartBody.append('text')
		.attr('class', 'spindle-text sans')
		.attr('y', -20)

	var spindles = chartBody.selectAll('g')
		.data(options.data)
		.enter()
		.append('g')
		.attr('class','spindle')
		.attr('id', function(d) {
			return slugify(d.name)
		})
		.each(function(d) {

			var _this = d3.select(this)
			var colorVal = d.basicStats.min / d.basicStats.games

			_this.append('line')
				.attr('class', 'spindle-focuser')
				.attr('x1', settings.singleW/2)
				.attr('y1', 0)
				.attr('x2', settings.singleW/2)
				.attr('y2', -settings.singleH-15)

			_this.append('line')
				.attr('class', 'spindle-line spindle-line-bd')
				.attr('x1', settings.singleW/2)
				.attr('y1', 0)
				.attr('x2', settings.singleW/2)

			_this.append('circle')
				.attr('class', 'spindle-end spindle-end-bd')
				.attr('cx', settings.singleW/2)
				.attr('r', settings.singleW/2)

			_this.append('line')
				.attr('class', 'spindle-line spindle-line-front')
				.attr('x1', settings.singleW/2)
				.attr('y1', 0)
				.attr('x2', settings.singleW/2)
				.style('stroke', color(colorVal))

			_this.append('circle')
				.attr('class', 'spindle-end spindle-end-front')
				.attr('cx', settings.singleW/2)
				.attr('r', (settings.singleW/2) - 1)
				.style('fill', color(colorVal))

		})
		.on('mouseover', function(d) {

			console.debug(d.basicStats.min, d.basicStats.games, d.basicStats.min / d.basicStats.games)

			var theClass = 'tooltip-active ' + checkScreenPositionAndReturnClass(d3.event)
			
			playerName.attr('x', xScale(d.projections[currXOrd]) )
				.text(d.name)
				.classed(theClass, true)

			d3.select(this)
				.classed('tooltip-active', true)
				.raise()

		}).on('mouseleave', function(d) {
			
			d3.select(this).classed('tooltip-active', false)
			playerName.classed('tooltip-active snap-center snap-right snap-left', false)

		})

	bands.selectAll('rect')
		.data(options.data)
		.enter().append('rect')
		.attr('class', function(d,i) {
			return 'band band-'+(i+1)
		})
		.attr('width', settings.singleW)
		.attr('height', settings.singleH)
		.attr('x', function(d,i) {
			return xScale(i+1)
		})
		.attr('y',0)

	var render = function(options) {

		var spindles = chartBody.selectAll('.spindle')

		if (options.x && options.x != currXOrd) {
			
			d3.select('.label-bottom span').text(options.xLabel + ' ADP')
			var currXlabel = options.xLabel

			var hasVal = spindles.filter(function(d) {
				return d.projections[options.x]
			})

			spindles.filter(function(d) {
				return !d.projections[options.x]
			}).transition()
			.style('opacity', 0)

			hasVal.sort(function(a,b) {
				return a.projections[options.x] - b.projections[options.x]
			})

			hasVal.transition()
				.ease(d3.easeCircleOut)
				.style('opacity', 1)
				.attr('transform', function(d,i) {
					return 'translate('+xScale(d.projections[options.x])+','+settings.singleH+')'
				})

			var newW = settings.margin.left + settings.margin.right + (250 * settings.singleW)
			shell.attr('width', newW)
			currW = newW

			var axis = d3.axisBottom()
				.scale(xScale)
				.tickValues(prettyTickValues)
				.tickSize(0)
				.tickPadding(8)

			axisBottom.call(axis)

			currXOrd = options.x

		}

		if (options.y && options.y != currYOrd) {

			d3.select('.label-units span').text(options.yLabel)
			var currYlabel = options.yLabel

			var extents = d3.extent(spindles.data(), function(d) {
				return d.basicStats[options.y]
			})

			yScale.domain([0, extents[1]])

			spindles.each(function(d) {

				var _this = d3.select(this)
				var spindleLine  = _this.selectAll('.spindle-line')
				var spindleEnd  = _this.selectAll('.spindle-end')

				var max = yScale(d.basicStats[options.y])

				spindleLine
					.transition()
					.ease(d3.easeCircleOut)
					.attr('y2', max)

				spindleEnd
					.transition()
					.ease(d3.easeCircleOut)
					.attr('cy', max)

			})

			var axisCenter = d3.axisLeft()
				.scale(yScale)
				.tickSize(-300*settings.singleW)
				.ticks(5)

			axisLines.call(axisCenter)

			var axisRight = d3.axisRight()
				.scale(yScale)
				.ticks(5)
				.tickSize(0)

			theRightAxis.call(axisRight)

			var axisLeft = d3.axisLeft()
				.scale(yScale)
				.ticks(5)
				.tickSize(0)

			theLeftAxis.call(axisLeft)


			currYOrd = options.y

		}

		if (options.initialPick) {

			currInitialPick = options.initialPick
			bands.selectAll('rect').classed('active-band', false)
			var picks = makeDraftOrder(currInitialPick, currLeagueSize, currDraftMode)

			bandLabels.call(makeBandLabels, picks)

			picks.forEach(function(elem) {
				d3.select('.band-' + elem).classed('active-band', true)
			})

		}

		if (options.leagueSize) {

			currLeagueSize = options.leagueSize
			bands.selectAll('rect').classed('active-band', false)
			var picks = makeDraftOrder(currInitialPick, currLeagueSize, currDraftMode)

			bandLabels.call(makeBandLabels, picks)

			picks.forEach(function(elem) {
				d3.select('.band-' + elem).classed('active-band', true)
			})

		}

		if (options.draftMode) {

			shell.classed('draftMode-normal draftMode-serpentine', false)

			currDraftMode = options.draftMode
			shell.classed('draftMode-' + options.draftMode, true)
			bands.selectAll('rect').classed('active-band', false)
			var picks = makeDraftOrder(currInitialPick, currLeagueSize, currDraftMode)

			bandLabels.call(makeBandLabels, picks)

			picks.forEach(function(elem) {
				d3.select('.band-' + elem).classed('active-band', true)
			})

		}




	}

	

	return {
		'render' : render
	}
	
}