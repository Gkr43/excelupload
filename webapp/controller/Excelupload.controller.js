sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader",
	"sap/m/StandardListItem",
	"sap/m/MessageToast"
],
function (Controller,Item,JSONModel,Uploader,ListItem,MessageToast) {
    "use strict";

    return Controller.extend("excelupload.controller.Excelupload", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel();
            this.localModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.localModel, "localModel");
       
    },
    redAMDID:function(){
        var that=this;
        that.oModel.read("/ZCPR_UPLOAD", {
            success: function(response) {
                //that.localModel.setData(response.results);
                that.excelData
                var items = that.getView().getModel("localModel").getData().items;
                var indices = that.byId("ExcellUploadTable").getSelectedIndices();
                for(var i=0;i<response.results.length;i++){
                    for(var j=0;j<indices.length;j++){
                        if(response.results[i].Bstnk ===  items[indices[j]]['PO Number'] && response.results[i].Posex=== items[indices[j]]['PO item'] && response.results[i].Amdno=== items[indices[j]]['POAM No'] ){ 
                           
                            items[indices[j]]['POAM ID']  =  response.results[i].AmdID;    
                        }
                    }
                }
                that.nextAMDID = response.results.length + 1;
                that.getView().getModel("localModel").refresh(true);
                

                //this.getView().setModel(this.localModel, "localModel");
              },
              error: function(error) {
                
              }
          });
    },

    onUpload: function (e) {
        this._import(e.getParameter("files") && e.getParameter("files")[0]);
    },

    _import: function (file) {
        var that = this;
        var excelData = {};
        if (file && window.FileReader) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });
                workbook.SheetNames.forEach(function (sheetName) {
                    // Here is your object for every sheet in workbook
                    that.excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                });
                // Setting the data to the local model 
                that.localModel.setData({
                    items: that.excelData
                });
                that.localModel.refresh(true);
                that.redAMDID();
            };
            reader.onerror = function (ex) {
                console.log(ex);
            };
            reader.readAsBinaryString(file);
        }
    },

    onDateConvert :function(dateString){
       // var dateString = "30.06.2022";

        // Split the string into day, month, and year
        var parts = dateString.split('.');
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1; // Month in JavaScript Date object is zero-based (0-11)
        var year = parseInt(parts[2], 10);
        
        // Create a new Date object
        var dateObject = new Date(year, month, day);
        
       // console.log(dateObject);
       return dateObject;

    },

  //  onUpdatePriceButton: function(AmdID) {
     
  //       debugger;
  //       var oModel = this.getOwnerComponent().getModel();
  //       //all excel file data 
  //       var items = this.getView().getModel("localModel").getData().items;

  //      var indices = this.byId("ExcellUploadTable").getSelectedIndices();
        
  //       for (var i = 0; i < indices.length; i++) {
  //          // var obj = items[i];
  //          var obj = items[indices[i]];
  //         var oldfr =  this.onDateConvert(obj['Old From']);
  //         var Enddate =  this.onDateConvert( obj['End Date']); 
  //         var engdt =  this.onDateConvert(obj['Change Date']);
  //           var ExcellpayLoad={
  //                "AmdID": parseInt(Math.random()*1000).toString(), 
  //             //"AmdID": obj['POAM ID'],
  //               "Amdno": obj['POAM No'] ,
  //               "Lifnr": obj['Vendor'],
  //               "Bstnk": obj['PO Number'],
  //               "Posex" : obj['PO item'] ,
  //               "Kdmat" : obj['Cust.material'] ,
  //              // "Txz01" : obj['Short Text'] ,
  //               "Ablad" : obj['Unloading Point'] ,
  //               "Pcond" : obj['Condition Type'],
  //               "Oldfr" : oldfr,
  //               "Oldpr" : obj['Old Price'],
  //               "Newpr" : obj['New From'],
  //               "Newpr" : obj['New Price'],
  //               "Waers" : obj['Currency'],
  //               "Meins" : obj['Base Unit'],
  //               "Etrac" : obj['Ex Track'],

  //               "Ntrac" : obj['New Track'],
  //               "Newto" : obj['New Utpto'],
  //               "Knumh" : obj['Cond.record no.'],
  //               "Refno" : obj['Sales Document'],
  //               "Ritem" : obj['Item'],
  //               "Aubel" : obj['Sales Document'],
  //               "Aupos" : obj[' Aupos Item'],
  //               "Vkorg" : obj['Sales Org.'],

  //               "Vtweg" : obj['Distr. Channel'] ,
  //               "Spart" : obj['Divisiono'] ,
  //               "Kunnr" : obj['Customer'] ,
  //               "Matnr" : obj['Material'] ,
  //               "Werks" : obj['Plant'] ,
  //               "Lgort" : obj['Stor. Location'] ,
  //               "Vstel" : obj['Shipping Point'] ,
  //               "Kmein" : obj['Unit of measure'] ,

  //             //  "Kunwe" : obj['Ship-to party'] ,
  //               "Kpein" : obj['Pricing unit'] ,
  //               "Kschl" : obj['Condition Type'] ,
  //               "Sdate" : Enddate,
  //               "Auart" : obj['Sales Doc. Type'] ,
  //               "Usnam" : obj['User Name'] ,
  //              // "Cngdt" : engdt ,
  //               "Chusr" : obj['Change By'] ,
  //               "Mwskz" : obj['Tax code'] 
  //           };

  //          var that =this;
  //          //Upload
  //          //ZCPR_UPLOAD
  //         this.oModel.create("Uploaded", ExcellpayLoad, {
  //               success: function(response) {
  //                   sap.m.MessageToast.show("Excell File Data Saved Successfully.");
            
  //                 },
  //                 error: function(error) {
  //                   sap.m.MessageToast.show("Failed to save Excell Fil Data.");
                    
  //                 }

  //             });
        
  //           }
        

  //       }
//serivice url :ZCPR_UPLD_SB_01
  onUpdatePriceButton: function(AmdID) {
    debugger;
    var oModel = this.getOwnerComponent().getModel();
  
    //all excel file data 
    var items = this.getView().getModel("localModel").getData().items;

   var indices = this.byId("ExcellUploadTable").getSelectedIndices();


    
    for (var i = 0; i < indices.length; i++) {
       // var obj = items[i];
       var obj = items[indices[i]];
      var oldfr =  this.onDateConvert(obj['Old From']);
      var newfr =  this.onDateConvert(obj['New From']);
      obj['New From']
      var amdId=this.nextAMDID.toString();
      amdId=amdId.padStart(10,0);
     // var Enddate =  this.onDateConvert( obj['End Date']); 
      //var engdt =  this.onDateConvert(obj['Change Date']);
       
      var ExcellpayLoad={
                      // "AmdID": parseInt(Math.random()*1000).toString(), 
                       "AmdID": amdId,
                       "Amdno": obj['POAM No'] ,
                       "Lifnr": obj['Vendor'],
                       "Bstnk": obj['PO Number'],
                       "Posex" : obj['PO item'] ,
                       "Kdmat" : obj['Cust.material'] ,
                       "Txz01" : obj['Short Text'] ,
                       "Ablad" : obj['Unloading Point'] ,
                     "Pcond" : obj['Condition Type'],
                       "Oldfr" : oldfr,
                    "Oldpr" : obj['Old Price'],
                     "Newfr" : newfr,
                       "Newpr" : obj['New Price'],
                       "Waers" : obj['Currency'],
                       "Meins" : obj['Base Unit'],
                       "Etrac" : obj['Ex Track'],
  
                       "Ntrac" : obj['New Track'],
                //        "Newto" : obj['New Utpto'],
                //        "Knumh" : obj['Cond.record no.'],
                //        "Refno" : obj['Sales Document'],
                //        "Ritem" : obj['Item'],
                //        "Aubel" : obj['Sales Document'],
                //        "Aupos" : obj[' Aupos Item'],
                //        "Vkorg" : obj['Sales Org.'],
  
                //        "Vtweg" : obj['Distr. Channel'] ,
                //        "Spart" : obj['Divisiono'] ,
                //        "Kunnr" : obj['Customer'] ,
                //        "Matnr" : obj['Material'] ,
                //        "Werks" : obj['Plant'] ,
                //        "Lgort" : obj['Stor. Location'] ,
                //        "Vstel" : obj['Shipping Point'] ,
                //        "Kmein" : obj['Unit of measure'] ,
  
                //    //  "Kunwe" : obj['Ship-to party'] ,
                //        "Kpein" : obj['Pricing unit'] ,
                //        "Kschl" : obj['Condition Type'] ,
                //        "Sdate" : Enddate,
                //        "Auart" : obj['Sales Doc. Type'] ,
                //        "Usnam" : obj['User Name'] ,
                //       // "Cngdt" : engdt ,
                //        "Chusr" : obj['Change By'] ,
                //        "Mwskz" : obj['Tax code'] 
                   };

       var that =this;
       // ZCPR_UPLOAD
       //zcpr_upload_sb_01

      this.oModel.create("/ZCPR_UPLOAD", ExcellpayLoad, {
            success: function(response) {
                that.redAMDID();
                sap.m.MessageToast.show("Excell File Data Saved Successfully.");
              },
              error: function(error) {
                sap.m.MessageToast.show("Failed to save Excell Fil Data.");
              }
          });
        }
        }

   
        

      
      
          
    });
});