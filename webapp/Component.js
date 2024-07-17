/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "excelupload/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("excelupload.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
               var JSZIPpath=sap.ui.require.toUrl("excelupload/model/jszip.js")
               var Xlsxpath=sap.ui.require.toUrl("excelupload/model/xlsx.js")

                jQuery.sap.includeScript(JSZIPpath);
                jQuery.sap.includeScript(Xlsxpath);
                //jQuery.sap.includeScript('./model/xlsx.js');
            }
        });
    }
);