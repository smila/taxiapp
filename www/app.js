var $ = require("./lib/jquery.min");

var message;
var custDet = [];
var sourceAddr = [];
var webview="";

var page = tabris.create("Page", {
  title: "Taxi App - Login",
  topLevel: true
});

tabris.create("TextInput", {
  id: "usernameInput",
  message: "Username"
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(page);

tabris.create("TextInput", {
  id: "passwordInput",
  message: "Password"
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(page);


tabris.create("Button", {
  id: "login",
  text: "Log In",
  background: "#FFCC00",
  textColor: "#4A4A4A"
}).on("select", function() {
	loginProcess();
}).appendTo(page);


function loginProcess(){
	if(page.children("#usernameInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter your username!');
	}
	else if(page.children("#passwordInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter your password!');
	}
	else{
		var username = page.children("#usernameInput").get("text");
		var password = page.children("#passwordInput").get("text");

		$.ajax({ //Process the form using $.ajax()
					type      : 'POST', //Method type
					url       : 'http://ghkasa.com/taxiapiserver/login-process.php', //Your form processing file URL
					data      : {username:username,password:password}, //Forms name
					dataType  : 'json',
					cache	 : false,
					success   : function(data) {
								if(data.errors){
									if(data.errors.username_err){
										window.plugins.toast.showLongCenter(data.errors.username_err)
									}
									else if(data.errors.password_err){
										window.plugins.toast.showLongCenter(data.errors.password_err)
									}
									else if(data.errors.login_err){
										window.plugins.toast.showLongCenter(data.errors.login_err)
									}
								}
								else if(data.success){
/*============================================User Control Page===========================================*/
									if(data.usertype=='car owner'){
										var taxi_no = data.taxi_no;
										carownerControlFunc(taxi_no).open();	
									}
									else if(data.usertype=='customer'){
										var username = data.username;
										customerControlFunc(username).open();
									}
										
								}//else if(data.success)
									},
					error	: function(data, errorThrown)
									{
										console.log('Update not fetched '+ errorThrown);	
									}
				});	
		
	}
}

/*===============================customer control page=================================*/
function customerControlFunc(username){
				var customerControlPage = tabris.create("Page", {
										  title: "Taxi App - User Control",
										  topLevel: false
										});
										
										tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Choose your route and press send button.</b>",
											id: "contentLabel"
										  }).appendTo(customerControlPage);
										tabris.create("TextInput", {
										  id: "startingLocationInput",
										  message: "Enter Starting Location"
										}).on("focus", function() {
										  this.set("background", "yellow");
										}).appendTo(customerControlPage);
										tabris.create("TextInput", {
										  id: "destLocationInput",
										  message: "Enter Destination Location"
										}).on("focus", function() {
										  this.set("background", "yellow");
										}).appendTo(customerControlPage);
										tabris.create("Button", {
											  id: "sendBtn",
											  text: "Send",
											  background: "#FFCC00",
											  textColor: "#4A4A4A"
											}).on("select", function() {
												if(customerControlPage.children("#startingLocationInput").get("text")==''){
													window.plugins.toast.showLongCenter('Enter Starting Location!');
												}
												else if(customerControlPage.children("#destLocationInput").get("text")==''){
													window.plugins.toast.showLongCenter('Enter Destination Location!');
												}
												else{
													var startingLocation = customerControlPage.children("#startingLocationInput").get("text");
													var destinationLocation = customerControlPage.children("#destLocationInput").get("text");
											 		customerControlProcess(username,startingLocation,destinationLocation).open();
												}
											}).appendTo(customerControlPage);
											
										customerControlPage.apply({
										   "#contentLabel": {layoutData: {left: 10, top: 40}},
										   "#startingLocationInput": {layoutData: {left: 10, top: ["#contentLabel", 20]}},
										   "#destLocationInput": {layoutData: {left: 10, top: ["#startingLocationInput", 20]}},
										   "#sendBtn": {layoutData: {left: 10, top: ["#destLocationInput", 20]}},
										});
						return customerControlPage;		
										

}
//validate customer fields
function customerControlProcess(username,startingLocation,destinationLocation){
		
	var calcRoutePage = tabris.create("Page", {
										  title: "Taxi App - Calculate Charges",
										  topLevel: false
										});
										
										tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Calculate Taxi Charges and notify car owner</b>",
											id: "contLabel"
										  }).appendTo(calcRoutePage);
										  tabris.create("Button", {
											  id: "findTaxiBtn",
											  text: "Notify Car Owner",
											  background: "#FFCC00",
											  textColor: "#4A4A4A"
											}).on("select", function() {
												notifyCarOwner(username,startingLocation,destinationLocation).open();
											}).appendTo(calcRoutePage);
										 webview = tabris.create("WebView", {
											  layoutData: {left: 0, top: ["#findTaxiBtn", 10], right: 0, bottom: 0}
											}).appendTo(calcRoutePage);
										webview.set("url", "http://ghkasa.com/map.php?s="+startingLocation+"&d="+destinationLocation);
										
										 calcRoutePage.apply({
										   "#contLabel": {layoutData: {left: 10, top: 40}},
										   "#findTaxiBtn": {layoutData: {left: 10, top: ["#contLabel", 20]}},
										});
		
		return calcRoutePage;	
		
	
}

/*======================================carowner page after login=========================================*/
function carownerControlFunc(taxi_no){
var carownerControlPage = tabris.create("Page", {
										  title: "Taxi App - User Control",
										  topLevel: false
										});
										tabris.create("Button", {
										  id: "editCarownerProfile",
										  text: "Edit Profile",
										  background: "#FFCC00",
										  textColor: "#4A4A4A"
										}).on("select", function() {
											
										}).appendTo(carownerControlPage);
										tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Requested services made by customers.</b>",
											id: "reqSevLabel"
										  }).appendTo(carownerControlPage);
										  //get customers requested for services
										  var taxi_no = taxi_no;
										  $.ajax({ //Process the form using $.ajax()
											type      : 'POST', //Method type
											url       : 'http://ghkasa.com/taxiapiserver/customer-service-request.php', //Your form processing file URL
											data      : {taxi_no:taxi_no}, //Forms name
											dataType  : 'json',
											cache	 : false,
											success   : function(data) {
												console.log(data);
														$.each(data, function(key, val){
																custDet.push({
																	fullname:val.fullname,
																	customer:val.customer,
																	date_created:val.date_created,
																	source_address:val.startingLocation,
																	destination_address:val.destinationLocation
																});
															});
															//console.log(JSON.stringify(custDet));
														tabris.create("CollectionView", {
														  layoutData: {left: 10, top: ["#reqSevLabel", 20], right: 0, bottom: 0},
														  items: custDet,
														  itemHeight: 200,
														  initializeCell: function(cell) {
															var fullnameTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: ["#reqSevLabel", 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var phoneTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [fullnameTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var sourceAddrTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [phoneTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															var destAddrTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [sourceAddrTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															
															var datecreatedTextView = tabris.create("TextView", {
															  layoutData: {left: 10, top: [destAddrTextView, 10]},
															  markupEnabled: true
															}).appendTo(cell);
															cell.on("change:item", function(widget, det) {
															  fullnameTextView.set("text", "<b>Fullname:</b> "+det.fullname);
															  phoneTextView.set("text", "<b>Mobile no.:</b> "+det.customer);
															  sourceAddrTextView.set("text", "<b>Source Address:</b> "+det.source_address);
															  destAddrTextView.set("text", "<b>Destination Address:</b> "+det.destination_address);
															  datecreatedTextView.set("text", "<b>Date:</b> "+det.date_created);
															});
														  }
														}).on("select", function(target, value) {
														  //console.log("selected", value.customer);
														}).appendTo(carownerControlPage);
															},
											error	: function(data, errorThrown)
															{
																console.log('Update not fetched '+ errorThrown);	
															}
										});	
										  
										carownerControlPage.apply({
										   "#editCarownerProfile": {layoutData: {left: 10, top: 20}},
										   "#reqSevLabel": {layoutData: {left: 10,  top: ["#editCarownerProfile", 20]}},
										});
										
		return carownerControlPage;
}

function notifyCarOwner(username,startingLocation,destinationLocation){
		
	var notifyCarOwnerPage = tabris.create("Page", {
										  title: "Taxi App - Notify Car Owner",
										  topLevel: false
										});
										
										tabris.create("TextView", {
											markupEnabled: true,
											text: "<b>Notify Car Owner</b>",
											id: "notifyLabel"
										  }).appendTo(notifyCarOwnerPage);
										  tabris.create("TextInput", {
										  id: "taxiNoInput",
										  message: "Enter Car No."
										}).on("focus", function() {
										  this.set("background", "yellow");
										}).appendTo(notifyCarOwnerPage);
										  tabris.create("Button", {
											  id: "findTaxiBtn",
											  text: "Notify",
											  background: "#FFCC00",
											  textColor: "#4A4A4A"
											}).on("select", function() {
												if(notifyCarOwnerPage.children("#taxiNoInput").get("text")==''){
													window.plugins.toast.showLongCenter('Enter Taxi No.!');
												}
												else{
													var taxino = notifyCarOwnerPage.children("#taxiNoInput").get("text");
											 		notifyCarOwerProcess(username,taxino,startingLocation,destinationLocation);
												}
											}).appendTo(notifyCarOwnerPage);
										
										 notifyCarOwnerPage.apply({
										   "#notifyLabel": {layoutData: {left: 10, top: 40}},
										   "#taxiNoInput": {layoutData: {left: 10, top: ["#notifyLabel", 10]}},
										   "#findTaxiBtn": {layoutData: {left: 10, top: ["#taxiNoInput", 20]}},
										});
		
		return notifyCarOwnerPage;	
		
	
}


function notifyCarOwerProcess(username,taxino,startingLocation,destinationLocation){

		$.ajax({ //Process the form using $.ajax()
					type      : 'POST', //Method type
					url       : 'http://ghkasa.com/taxiapiserver/service-request-process.php', //Your form processing file URL
					data      : {username:username,taxino:taxino,startingLocation:startingLocation,destinationLocation:destinationLocation}, //Forms name
					dataType  : 'json',
					cache	 : false,
					success   : function(data) {
						console.log(data);
								if(data.errors){
									window.plugins.toast.showLongCenter(data.errors.taxi_err);
								}
								else if(data.success){
									
									var fullname = data.fullname;
									var phoneno = data.phoneno;
									var cartype = data.cartype;
									var servicearea = data.servicearea;
									serviceRequestFunc(fullname,phoneno,cartype,servicearea).open();
								}//else if(data.success)
									},
					error	: function(data, errorThrown)
									{
										console.log('Update not fetched '+ errorThrown);	
									}
				});	
		
}


//==========================================Request for service===========================================================*/
function serviceRequestFunc(fullname,phoneno,cartype,servicearea){
				var serviceRequestPage = tabris.create("Page", {
										  title: "Taxi App - Service Request",
										  topLevel: false
										});
										tabris.create("TextView", {
											markupEnabled: true,
											alignment: "center",
											text: "<b>Thank you for using our services. Car Owner is notified successfully. Below are details of the car owner:</b>",
											id: "reqstLabel"
										  }).appendTo(serviceRequestPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											alignment: "center",
											text: "<b>Fullname:</b> "+fullname,
											id: "nameLabel"
										  }).appendTo(serviceRequestPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											alignment: "center",
											text: "<b>Mobile No.:</b> "+phoneno,
											id: "phoneLabel"
										  }).appendTo(serviceRequestPage);
										  tabris.create("TextView", {
											markupEnabled: true,
											alignment: "center",
											text: "<b>Car Type:</b> "+cartype,
											id: "cartypeLabel"
										  }).appendTo(serviceRequestPage);
										   tabris.create("TextView", {
											markupEnabled: true,
											alignment: "center",
											text: "<b>Area of Service:</b> "+servicearea,
											id: "serviceLabel"
										  }).appendTo(serviceRequestPage);
										
										serviceRequestPage.apply({
										   "#reqstLabel": {layoutData: {left: 10, top: 40,font: "30px Arial, sans-serif", textColor: "#333"}},
										   "#nameLabel": {layoutData: {left: 10, top: ["#reqstLabel", 10]}},
										   "#phoneLabel": {layoutData: {left: 10, top: ["#nameLabel", 10]}},
										   "#cartypeLabel": {layoutData: {left: 10, top: ["#phoneLabel", 10]}},
										   "#serviceLabel": {layoutData: {left: 10, top: ["#cartypeLabel", 10]}},
										   
										});
										
					return serviceRequestPage;					
		}
//===========================================================registration page=================================================================================//
tabris.create("Button", {
  id: "register",
  text: "Register",
  background: "#4A4A4A",
  textColor: "white"
}).on("select", function() {
  var registrationPage = tabris.create("Page", {
  title: "Taxi App - Register",
  topLevel: false
});


var customer_checkbox = tabris.create("CheckBox", {
  id: "customer_register",
  text: "Customer",
  selection: true,
}).on("change:selection", function(checkBox, selection) {
  //this.set("text", selection ? "selected" : "deselected");
  if(selection){
	  window.plugins.toast.showLongCenter('You are registering as Customer!');
	  carowner_checkbox.set('selection',false);
	  car_number.set('visible',false);
	  car_type.set('visible',false);
	  serviceArea.set('visible',false);
	  customerBtn.set('visible',true);
	  carOwnerBtn.set('visible',false);
  }
  
}).appendTo(registrationPage);

var carowner_checkbox = tabris.create("CheckBox", {
  id: "carowner_register",
  text: "Car Owner"
}).on("change:selection", function(checkBox, selection) {
  //this.set("text", selection ? "selected" : "deselected");
  if(selection){
	  window.plugins.toast.showLongCenter('You are registering as Car Owner!');
	  customer_checkbox.set('selection',false);
	  car_number.set('visible',true);
	  car_type.set('visible',true);
	  serviceArea.set('visible',true);
	  carOwnerBtn.set('visible',true);
	  customerBtn.set('visible',false);
  }
  
}).appendTo(registrationPage);



tabris.create("TextInput", {
  id: "fullnameInput",
  message: "Full Name"
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);

tabris.create("TextInput", {
  id: "mobileInput",
  message: "Mobile Number eg.0545485128"
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);

var car_number = tabris.create("TextInput", {
  id: "carNumberInput",
  message: "Car Number",
  visible:false,
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);

var car_type =  tabris.create("Picker", {
	id: "cartypeInput",
	 visible:false,
	items: ["Floating Car","Station Car"],
	selectionIndex: 0
	}).on("focus", function() {
	 this.set("background", "yellow");
}).appendTo(registrationPage);

var serviceArea = tabris.create("TextInput", {
  id: "serviceAreaInput",
  message: "Service Area",
  visible:false,
}).on("focus", function() {
  this.set("background", "yellow");
}).appendTo(registrationPage);


var customerBtn = tabris.create("Button", {
  id: "cust_register_btn",
  text: "Register as Customer",
  background: "#FFCC00",
  textColor: "#4A4A4A",
}).on("select", function() {
  	validateCustReg();
}).appendTo(registrationPage);

var carOwnerBtn = tabris.create("Button", {
  id: "carowner_register_btn",
  text: "Register as Car Owner",
  background: "#FFCC00",
  textColor: "#4A4A4A",
  visible:false,
}).on("select", function() {
	validateCarOwnReg();
}).appendTo(registrationPage);


//validate customer fields
function validateCustReg(){
	if(registrationPage.children("#fullnameInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter your fullname!');
	}
	else if(registrationPage.children("#mobileInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter your mobile no.!');
	}
	else{
		var fullname = registrationPage.children("#fullnameInput").get("text");
		var mobileno = registrationPage.children("#mobileInput").get("text");

		$.ajax({ //Process the form using $.ajax()
					type      : 'POST', //Method type
					url       : 'http://ghkasa.com/taxiapiserver/customer-registration-process.php', //Your form processing file URL
					data      : {fullname:fullname,mobileno:mobileno,usertype:'customer'}, //Forms name
					dataType  : 'json',
					cache	 : false,
					success   : function(data) {
								
								if(data.errors){
									if(data.errors.fullname_err){
										window.plugins.toast.showLongCenter(data.errors.fullname_err)
									}
									else if(data.errors.mobileno_err){
										window.plugins.toast.showLongCenter(data.errors.mobileno_err)
									}
								}
								else if(data.success){
									//cordova.plugins.notification.badge.set(data.generated_password);
									//console.log(data.generated_password);
									window.plugins.toast.showLongCenter(data.posted)
									registrationPage.children("#fullnameInput").set("text", "");
									registrationPage.children("#mobileInput").set("text", "");
								}
									},
					error	: function(data, errorThrown)
									{
										console.log('Update not fetched '+ errorThrown);	
									}
				});	
		
	}
}

//validate car owner fields
function validateCarOwnReg(){
	if(registrationPage.children("#fullnameInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Fullname!');
	}
	else if(registrationPage.children("#mobileInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Mobile no.!');
	}
	else if(registrationPage.children("#carNumberInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Car no.!');
	}
	else if(registrationPage.children("#floatInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Floating!');
	}
	else if(registrationPage.children("#stationInput").get("text")==''){
		window.plugins.toast.showLongCenter('Enter Station!');
	}
	else{
		var fullname = registrationPage.children("#fullnameInput").get("text");
		var mobileno = registrationPage.children("#mobileInput").get("text");
		var car_no = registrationPage.children("#carNumberInput").get("text");
		var car_type = registrationPage.children("#cartypeInput").get("selection");
		var serviceArea = registrationPage.children("#serviceAreaInput").get("text");
   
   		$.ajax({ //Process the form using $.ajax()
					type      : 'POST', //Method type
					url       : 'http://ghkasa.com/taxiapiserver/carowner-registration-process.php', //Your form processing file URL
					data      : {fullname:fullname,mobileno:mobileno,car_no:car_no,car_type:car_type,serviceArea:serviceArea,usertype:'car owner'}, //Forms name
					dataType  : 'json',
					cache	 : false,
					success   : function(data) {
								console.log(data);
								if(data.errors){
									if(data.errors.fullname_err){
										window.plugins.toast.showLongCenter(data.errors.fullname_err)
									}
									else if(data.errors.mobileno_err){
										window.plugins.toast.showLongCenter(data.errors.mobileno_err)
									}
									else if(data.errors.car_no_err){
										window.plugins.toast.showLongCenter(data.errors.car_no_err)
									}
								}
								else if(data.success){
									window.plugins.toast.showLongCenter(data.posted)
									registrationPage.children("#fullnameInput").set("text", "");
									registrationPage.children("#mobileInput").set("text", "");
									registrationPage.children("#carNumberInput").set("text", "");
									registrationPage.children("#serviceAreaInput").set("text", "");
								}
									},error:function(data, errorThrown)
									{
										console.log('Update not fetched'+ errorThrown);	
									}
				});	
		
	}
}

registrationPage.apply({
   "#customer_register": {layoutData: {left: 10, top: 20, width: 120}},
   "#carowner_register": {layoutData: {left: ["#customer_register", 10], right: 10, baseline: "#customer_register"}},
   "#fullnameInput": {layoutData: {left: 10, right: 10, top:["customer_register",70]}},
   "#mobileInput": {layoutData: {left: 10, right: 10, top:["#fullnameInput",10]}},
   "#carNumberInput": {layoutData: {left: 10,  right: 10, top:["#mobileInput",10]}},
   "#cartypeInput": {layoutData: {left: 10,  right: 10,top: ["#carNumberInput", 10]}},
   "#serviceAreaInput": {layoutData: {left: 10,  right: 10, top:["#cartypeInput",10]}},
   "#cust_register_btn": {layoutData: {left: 10,  right: 10, top:["#mobileInput",10]}},
   "#carowner_register_btn": {layoutData: {left: 10,  right: 10, top:["#serviceAreaInput",10]}},
});


registrationPage.open();
}).appendTo(page);




page.apply({
   "#usernameInput": {layoutData: {left: 10, right: 10, top:40}},
   "#passwordInput": {layoutData: {left: 10, right: 10, top:["#usernameInput",10]}},
   "#login": {layoutData: {left: 10, width: 140, top:["#passwordInput",10]}},
   "#register": {layoutData: {left: ["#login", 10],right: 10, baseline: "#login"}}
});
page.open();