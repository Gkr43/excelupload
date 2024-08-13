sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader",
	"sap/m/StandardListItem",
	"sap/m/MessageToast", 
    "sap/ui/model/Filter",
    "sap/ui/core/format/DateFormat",
],
function (Controller,Item,JSONModel,Uploader,ListItem,MessageToast,Filter,DateFormat) {
    "use strict";

    return Controller.extend("excelupload.controller.Excelupload", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel();
            this.oModel.setUseBatch(true);
            this.localModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.localModel, "localModel");
       
    },
    readExistingEntry:function(oFilter,index,oPayload){
        var that=this;
        var BusyDialog = new sap.m.BusyDialog();
        BusyDialog.open();
        that.oModel.read("/ZCPR_UPLOAD", {
            urlParameters: {
                "$top": "1000"
            },
            async:false,
            filters:oFilter,
            success: function(response) {
                BusyDialog.close();
                //that.localModel.setData(response.results);
                if(response.results.length>0){
                    //that.excelData
                var items = that.getView().getModel("localModel").getData().items;
                var indices = that.byId("ExcellUploadTable").getSelectedIndices();
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "dd.MM.yyyy" ///ddmmyyyy
                });
               // var dateval= new Date(date);
               
                //items[indices[index]]['POAM ID']=response.results[response.results.length-1].AmdID;
                for(var i=0;i<response.results.length;i++){
                    for(var j=0;j<items.length;j++){
                        var newfr = oDateFormat.format(response.results[i].Newfr);
                        if(response.results[i].Bstnk ===  items[j]['PO Number'] && response.results[i].Posex=== items[j]['PO item'] && newfr=== items[j]['New From'] ){ 
                           
                          //  items[indices[j]]['POAM ID']  =  response.results[i].AmdID; 
                          var obj=response.results[response.results.length-1];
                        
                       // var dateval= new Date(date);
                       var newfr = oDateFormat.format(obj.Newfr);
                          var filItem=items.filter(function(e){if(e['POAM No']===obj.Amdno && e['New From']=== newfr &&  e['PO Number']===obj.Bstnk && e['PO item']===obj.Posex){ return e;}})   
                          if(filItem.length>0){
                            filItem[0]['POAM ID']  =  obj.AmdID; 
                            sap.m.MessageToast.show('POAM ID '+obj.AmdID+" already exist!" );
                          }
                            
                        }
                    }
                }
                that.getView().getModel("localModel").refresh(true);
                
                }
                // else{
                    
                //    // that.createEntryArr.push(that.oModel._createBatchRequest("ZCPR_UPLOAD","POST",oPayload));
                //     that.createEntry(oPayload,that);
                // }
                

                //this.getView().setModel(this.localModel, "localModel");
              },
              error: function(error) {
                BusyDialog.close();
              }
          });
    },
    createEntry:function(ExcellpayLoad,that){
        var BusyDialog = new sap.m.BusyDialog();
        BusyDialog.open();
        that.oModel.create("/ZCPR_UPLOAD", ExcellpayLoad, {
            async:false,
            success: function(response) {
                BusyDialog.close();
                that.readAMDID();
                sap.m.MessageToast.show("Excell File Data Saved Successfully.");
              },
              error: function(error) {
                BusyDialog.close();
                sap.m.MessageToast.show("Failed to save Excell Fil Data.");
              }
          });
    },
    readAMDID:function(){
        var that=this;
        var BusyDialog = new sap.m.BusyDialog();
        BusyDialog.open();
        that.oModel.read("/ZCPR_UPLOAD", {
            urlParameters: {
                "$top": "1000"
            },
            success: function(response) {
                BusyDialog.close();
                //that.localModel.setData(response.results);
                that.excelData;
                var items = that.getView().getModel("localModel").getData().items;
                var indices = that.byId("ExcellUploadTable").getSelectedIndices();
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "dd.MM.yyyy" ///ddmmyyyy
                });
                for(var i=0;i<response.results.length;i++){
                    for(var j=0;j<indices.length;j++){
                        var newFr = oDateFormat.format(response.results[i].Newfr);
                        if(response.results[i].Bstnk ===  items[indices[j]]['PO Number'] && response.results[i].Posex=== items[indices[j]]['PO item'] && response.results[i].Amdno=== items[indices[j]]['POAM No'] && newFr === items[indices[j]]['New From'] ){ 
                           
                            items[indices[j]]['POAM ID']  =  response.results[i].AmdID;    
                        }
                    }
                }
               // that.nextAMDID = response.results.length + 1;
                that.getView().getModel("localModel").refresh(true);
                

                //this.getView().setModel(this.localModel, "localModel");
              },
              error: function(error) {
                BusyDialog.close();
              }
          });
    },
    getCount:function(){
        var that=this;
        var BusyDialog = new sap.m.BusyDialog();
        BusyDialog.open();
        that.oModel.read("/ZCPR_UPLOAD/$count", {
            urlParameters: {
                "$top": "1000"
            },
            async:false,
            success: function(response) {
                BusyDialog.close();
                that.nextAMDID = parseInt(response) + 1;
               },
              error: function(error) {
                BusyDialog.close();
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
                //that.readAMDID();
                that.getCount();
                for(var i=0;i<that.excelData.length;i++){
                    var aFilters=[];
                    var obj=that.excelData[i];
                    var newfr =  that.onDateConvert(obj['New From']);
                    newfr= new Date(newfr.getTime() + (24 * 60 * 60 * 1000));
                    var oldfr =  that.onDateConvert(obj['Old From']);
                    oldfr= new Date(oldfr.getTime() + (24 * 60 * 60 * 1000));
                    var oPayload ={
                       
                       "Amdno": obj['POAM No'] ,
                       "Bstnk": obj['PO Number'],
                       "Posex" : obj['PO item'] ,
                       "Newfr" : newfr,
                       
                    }
                   
                    aFilters.push(new Filter("Bstnk","EQ", oPayload.Bstnk));
                    aFilters.push(new Filter("Posex","EQ", oPayload.Posex));
                    aFilters.push(new Filter("Newfr","EQ", newfr));
                    aFilters.push(new Filter("Amdno","EQ", oPayload.Amdno));
                    that.readExistingEntry(aFilters,i,oPayload);
                }
                

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

if(indices.length===0){
    sap.m.MessageToast.show('Select atleast one line item');
    return;
}
    this.createEntryArr=[];
    for (var i = 0; i < indices.length; i++) {
       // var obj = items[i];
       var obj = items[indices[i]];
      var oldfr =  this.onDateConvert(obj['Old From']);
      oldfr= new Date(oldfr.getTime() + (24 * 60 * 60 * 1000));
      var newfr =  this.onDateConvert(obj['New From']);
      newfr= new Date(newfr.getTime() + (24 * 60 * 60 * 1000));
      var amdId=(this.nextAMDID+i).toString();
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
      
       
            // var aFilters=[];
            // aFilters.push(new Filter("Bstnk","EQ", ExcellpayLoad.Bstnk));
            // aFilters.push(new Filter("Posex","EQ", ExcellpayLoad.Posex));
            // aFilters.push(new Filter("Newfr","EQ", ExcellpayLoad.Newfr));
            // aFilters.push(new Filter("Amdno","EQ", ExcellpayLoad.Amdno));
        

            //this.readExistingEntry(aFilters,i,ExcellpayLoad);
            that.createEntry(ExcellpayLoad,this);
        
         
    
      
        }
        
      
        this.oModel.submitChanges({
            success: function(data, response) {
                //To do
            },
            error: function(e) {
                //To do
            }
        });


        },
        onSelectRow:function(oEvent){
            debugger;
                var rowIndex=oEvent.getParameter('rowIndex');
				var selectAll=oEvent.getParameter('selectAll');
				var data=this.getView().getModel('localModel').getData().items;
                if(selectAll){
                    for(var i=0;i<data.length;i++){
						if(data[i].AmdID!==undefined){
                            sap.m.MessageToast.show(data[i].AmdID+" already exist");
                        }
					}
                }else if(rowIndex===-1){
                    
                }else{
                    //var index=oEvent.getParameter('rowIndex');
                    var spath=oEvent.getParameter('rowContext').getPath();
                    var index=parseInt(spath.substring(spath.lastIndexOf('/')+1));
                    var obj=this.getView().getModel('localModel').getData().items[index];
                    if(obj.AmdID!==undefined){
                        sap.m.MessageToast.show(obj.AmdID+" already exist");
                    }
                }
        },

   
        

      
      
          
    });
});