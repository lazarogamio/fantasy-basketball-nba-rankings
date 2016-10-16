var chart = {}

var currXOrd = null
var currYOrd = null

function slugify(text) {
	return text.toString().toLowerCase()
	.replace(/\s+/g, '-')           // Replace spaces with -
	.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	.replace(/\-\-+/g, '-')         // Replace multiple - with single -
	.replace(/^-+/, '')             // Trim - from start of text
	.replace(/-+$/, '');            // Trim - from end of text
}

var makeSettings = function(data) {

	var singleW = 10
	var singleH = 300
	
	var margin = {
		'top' : 20,
		'right' : 20,
		'bottom' : 20,
		'left' : 20
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

var tt = d3.select('#tooltip')
var ttName = tt.select('.tt-name')

chart.initialize = function(options) {

	console.debug(options.data)
	var settings = makeSettings(options.data)
	
	var xScale = d3.scaleLinear()
		.domain([1,options.data.length])
		.range([0, settings.singleW * options.data.length])

	var yScale = d3.scaleLinear()
		.range([0, -settings.singleH])

	var shell = d3.select(options.chartBody)
		.append('svg')
		.attr('width', settings.chartW)
		.attr('height', settings.chartH)

	var chartBody = shell.append('g')
		.attr('transform', 'translate('+settings.margin.left+','+settings.margin.top+')')

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

			_this.append('line')
				.attr('class', 'spindle-line spindle-line-bd')
				.attr('x1', settings.singleW/2)
				.attr('y1', settings.singleW/2)
				.attr('x2', settings.singleW/2)

			_this.append('circle')
				.attr('class', 'spindle-end spindle-end-bd')
				.attr('cx', settings.singleW/2)
				.attr('r', settings.singleW/2)

			_this.append('line')
				.attr('class', 'spindle-line spindle-line-front')
				.attr('x1', settings.singleW/2)
				.attr('y1', settings.singleW/2)
				.attr('x2', settings.singleW/2)

			_this.append('circle')
				.attr('class', 'spindle-end spindle-end-front')
				.attr('cx', settings.singleW/2)
				.attr('r', settings.singleW/2)

		})
		.on('mouseover', function(d) {
			
			tt.style('left', xScale(d.projections[currXOrd]) + 'px')
			tt.style('top',  settings.margin.top + 'px')

			ttName.text(d.name)

			d3.select(this).classed('tooltip-active', true)
			tt.classed('tooltip-active', true)

		}).on('mouseleave', function(d) {
			d3.select(this).classed('tooltip-active', false)
			tt.classed('tooltip-active', false)
		})

	var render = function(options) {

		var spindles = chartBody.selectAll('.spindle')

		if (options.x && options.x != currXOrd) {
			

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

			var newLen = hasVal.nodes().length
			var newW = settings.margin.left + settings.margin.right + (newLen * settings.singleW)
			shell.attr('width', newW)


			currXOrd = options.x

		}

		if (options.y && options.y != currYOrd) {

			console.debug('rendering Y')

			yScale.domain(d3.extent(spindles.data(), function(d) {
				return d.basicStats[options.y]
			}))

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

			currYOrd = options.y

		}


	}

	

	return {
		'render' : render
	}
	
}