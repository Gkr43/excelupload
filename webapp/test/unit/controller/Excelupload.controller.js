/*global QUnit*/

sap.ui.define([
	"excelupload/controller/Excelupload.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Excelupload Controller");

	QUnit.test("I should test the Excelupload controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
