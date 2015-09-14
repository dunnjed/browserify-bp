//'use strict';

var $ = require('jquery');

var helloWorld = function () {
	console.log("Hello world");
	
	$("#hi").html("Hello World there");
};

var services = {};
services.helloWorld = helloWorld;

module.exports = services;


