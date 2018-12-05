function disable() {
    var controlPairs = new Array();
    controlPairs['F1'] = 'PV';
    controlPairs['F2'] = 'PMT';
    controlPairs['F3'] = 'interest';
    controlPairs['F4'] = 'period';
    var disabledClass = "disabled vis biginput R W120";
    var enabledClass = "vis biginput R W120";

    for (var i in controlPairs) {
        var field = document.getElementById(controlPairs[i]);
        var toggle = document.getElementById(i);

        field.disabled = toggle.checked ? true : false;
        field.className = toggle.checked ? disabledClass : enabledClass;
    }
}

function RATE(nper, pmt, pv, fv, type, guess)
{
	var FINANCIAL_ACCURACY = 1.0e-9;
	var FINANCIAL_MAX_ITERATIONS = 100;
	var rate = guess;
	var i  = 0;
	var x0 = 0;
	var x1 = rate;
	var y, y0, y1, x0, x1, f;

	if (Math.abs(rate) < FINANCIAL_ACCURACY) {
		y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
	} else {
		f = Math.exp(nper * Math.log(1 + rate));
		y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
	}

	y0 = pv + pmt * nper + fv;
	y1 = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;

	// find root by secant method
	while ((Math.abs(y0 - y1) > FINANCIAL_ACCURACY) && (i < FINANCIAL_MAX_ITERATIONS))
	{
		rate = (y1 * x0 - y0 * x1) / (y1 - y0);
		x0 = x1;
		x1 = rate;

		if (Math.abs(rate) < FINANCIAL_ACCURACY) {
			y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
		} else {
			f = Math.exp(nper * Math.log(1 + rate));
			y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
		}

		y0 = y1;
		y1 = y;
		i++;
	}
	return rate;
}

function loanCalc()
{

if 		(document.getElementById('T1').checked) { n=12; }
else if	(document.getElementById('T2').checked) { n=1; }

var F1	= document.getElementById('F1');
var F2	= document.getElementById('F2');
var F3	= document.getElementById('F3');
var F4	= document.getElementById('F4');
var total_sum	= document.getElementById('total_sum');
var total_interest	= document.getElementById('total_interest');


	if (document.getElementById('F1').checked) {
		var pv		= document.getElementById('PV');
		var pmt		= getFieldFloatValue('PMT');
		var r		= getFieldFloatValue('interest')/100;
		var t		= getFieldFloatValue('period')*n;
		var z = 1 / (1 + r/12);
		var div = 1 - Math.pow(z, t);

		pv.value = round((pmt * z * div)/(1-z), 2);
		total_sum.value	= round(pmt * t, 2);
		total_interest.value = round(total_sum.value - pv.value, 2);
}
	else if (document.getElementById('F2').checked) {
		var pmt		= document.getElementById('PMT');
		var pv		= getFieldFloatValue('PV');
		var r		= getFieldFloatValue('interest')/100;
		var t		= getFieldFloatValue('period')*n;
		var z = 1 / (1 + r/12);
		var div = 1 - Math.pow(z, t);

		pmt.value = round((pv * (1-z)) / (z * div), 2);
		total_sum.value	= round(pmt.value * t, 2);
		total_interest.value = round(total_sum.value - pv, 2);
}
	else if (document.getElementById('F3').checked) {
		var pmt		= getFieldFloatValue('PMT');
		var pv		= getFieldFloatValue('PV');
		var r		= document.getElementById('interest');
		var t		= getFieldFloatValue('period')*n;
		var z = 1 / (1 + r/12);
		var div = 1 - Math.pow(z, t);

//		if (round(RATE(t, pmt, -pv, 0, 0, 0.01)*100*12, 4) < 0) interest.value = "< 0";
		if (round(RATE(t, pmt, -pv, 0, 0, 0.01)*100*12, 3) > 250) interest.value = "N/A";
		else interest.value = round(RATE(t, pmt, -pv, 0, 0, 0.01)*100*12, 3)+" %";
		total_sum.value	= round(pmt * t, 2);
		total_interest.value = round(total_sum.value - pv, 2);
}
	else if (document.getElementById('F4').checked) {
		var pmt		= getFieldFloatValue('PMT');
		var pv		= getFieldFloatValue('PV');
		var r		= getFieldFloatValue('interest')/100;
		var t		= document.getElementById('period');
		var z = 1 / (1 + r/12);
		var div = 1 - Math.pow(z, t);

		t.value = round(Math.log(1 - (((1-z) * pv) / (z * pmt))) / (n * Math.log(z)), 3);
		total_sum.value	= round(pmt * t.value*n, 2);
		total_interest.value = round(total_sum.value - pv, 2);
}

}

function round(n,dec)
{
	X = n * Math.pow(10,dec);
	X= Math.round(X);
	return (X / Math.pow(10,dec)).toFixed(dec);
}
function resetValues(form)
{
  for(var i = 0; i < form.elements.length; i++) {
  if(form.elements[i].type == "text") { form.elements[i].value = "";}
  }
}
function getFieldFloatValue(fieldId) {
    return parseFloat(document.getElementById(fieldId).value.replace("\,","."));
}



google.load('visualization', '1', {'packages':['corechart']});

google.setOnLoadCallback(drawChart);


function drawChart() {

	var A = getFieldFloatValue("PV");
	var B = getFieldFloatValue("total_interest");

	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Topping');
	data.addColumn('number', 'Slices');
	data.addRows([
	['Loan Amount', A],
	['Interest', B]
	]);

	var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
	var options = {
	    width: 320,
        height: '100%',
		colors: ['#1aaef8'/*, '#63d937'*/, '#fdbe6f'],
		backgroundColor: '#f7f7f7',
		is3D: true,
		legend: 'right',
		legendTextStyle: {color: '#1789a6'},
		chartArea:{left: "3%",top: "3%",height: "94%",width: "94%"}
	};

	chart.draw(data, options);
}


function switchcontent(e,t){this.className=e;this.collapsePrev=false;this.persistType="none";this.filter_content_tag=typeof t!="undefined"?t.toLowerCase():""}switchcontent.prototype.setStatus=function(e,t){this.statusOpen=e;this.statusClosed=t};switchcontent.prototype.setColor=function(e,t){this.colorOpen=e;this.colorClosed=t};switchcontent.prototype.setPersist=function(e,t){if(e==true){if(typeof t=="undefined")this.persistType="session";else{this.persistType="days";this.persistDays=parseInt(t)}}else this.persistType="none"};switchcontent.prototype.collapsePrevious=function(e){this.collapsePrev=e};switchcontent.prototype.sweepToggle=function(e){if(typeof this.headers!="undefined"&&this.headers.length>0){for(var t=0;t<this.headers.length;t++){if(e=="expand")this.expandcontent(this.headers[t]);else if(e=="contract")this.contractcontent(this.headers[t])}}};switchcontent.prototype.defaultExpanded=function(){var e=[];for(var t=0;!this.collapsePrev&&t<arguments.length||this.collapsePrev&&t==0;t++)e[e.length]=arguments[t];this.expandedindices=e.join(",")};switchcontent.prototype.togglecolor=function(e,t){if(typeof this.colorOpen!="undefined")e.style.color=t};switchcontent.prototype.togglestatus=function(e,t){if(typeof this.statusOpen!="undefined")e.firstChild.innerHTML=t};switchcontent.prototype.contractcontent=function(e){var t=document.getElementById(e.id.replace("-title",""));t.style.display="none";this.togglestatus(e,this.statusClosed);this.togglecolor(e,this.colorClosed)};switchcontent.prototype.expandcontent=function(e){var t=document.getElementById(e.id.replace("-title",""));t.style.display="block";this.togglestatus(e,this.statusOpen);this.togglecolor(e,this.colorOpen)};switchcontent.prototype.toggledisplay=function(e){var t=document.getElementById(e.id.replace("-title",""));if(t.style.display=="block")this.contractcontent(e);else{this.expandcontent(e);if(this.collapsePrev&&typeof this.prevHeader!="undefined"&&this.prevHeader.id!=e.id)this.contractcontent(this.prevHeader)}if(this.collapsePrev)this.prevHeader=e};switchcontent.prototype.collectElementbyClass=function(e){var t=new RegExp("(^|\\s+)"+e+"($|\\s+)","i");this.headers=[],this.innercontents=[];if(this.filter_content_tag!="")var n=document.getElementsByTagName(this.filter_content_tag);else var n=document.all?document.all:document.getElementsByTagName("*");for(var r=0;r<n.length;r++){if(typeof n[r].className=="string"&&n[r].className.search(t)!=-1){if(document.getElementById(n[r].id+"-title")!=null){this.headers[this.headers.length]=document.getElementById(n[r].id+"-title");this.innercontents[this.innercontents.length]=n[r]}}}};switchcontent.prototype.init=function(){var e=this;this.collectElementbyClass(this.className);if(this.headers.length==0)return;if(this.persistType=="days"&&parseInt(switchcontent.getCookie(this.className+"_dtrack"))!=this.persistDays)switchcontent.setCookie(this.className+"_d","",-1);var t=this.persistType=="session"&&switchcontent.getCookie(this.className)!=""?","+switchcontent.getCookie(this.className)+",":this.persistType=="days"&&switchcontent.getCookie(this.className+"_d")!=""?","+switchcontent.getCookie(this.className+"_d")+",":this.expandedindices?","+this.expandedindices+",":"";for(var n=0;n<this.headers.length;n++){if(typeof this.statusOpen!="undefined")this.headers[n].innerHTML='<span class="status"></span>'+this.headers[n].innerHTML;if(t.indexOf(","+n+",")!=-1){this.expandcontent(this.headers[n]);if(this.collapsePrev)this.prevHeader=this.headers[n]}else this.contractcontent(this.headers[n]);this.headers[n].onclick=function(){e.toggledisplay(this)}}switchcontent.dotask(window,function(){e.rememberpluscleanup()},"unload")};switchcontent.prototype.rememberpluscleanup=function(){var e=new Array("none");for(var t=0;t<this.innercontents.length;t++){if(this.persistType!="none"&&this.innercontents[t].style.display=="block"&&(!this.collapsePrev||this.collapsePrev&&e.length<2))e[e.length]=t;this.headers[t].onclick=null}if(e.length>1)e.shift();if(typeof this.statusOpen!="undefined")this.statusOpen=this.statusClosed=null;if(this.persistType=="session")switchcontent.setCookie(this.className,e.join(","));else if(this.persistType=="days"&&typeof this.persistDays=="number"){switchcontent.setCookie(this.className+"_d",e.join(","),this.persistDays);switchcontent.setCookie(this.className+"_dtrack",this.persistDays,this.persistDays)}};switchcontent.dotask=function(e,t,n){var n=window.addEventListener?n:"on"+n;if(e.addEventListener)e.addEventListener(n,t,false);else if(e.attachEvent)e.attachEvent(n,t)};switchcontent.getCookie=function(e){var t=new RegExp(e+"=[^;]+","i");if(document.cookie.match(t))return document.cookie.match(t)[0].split("=")[1];return""};switchcontent.setCookie=function(e,t,n){if(typeof n!="undefined"){var r=new Date;var i=r.setDate(r.getDate()+n);document.cookie=e+"="+t+"; expires="+r.toGMTString()}else document.cookie=e+"="+t}
