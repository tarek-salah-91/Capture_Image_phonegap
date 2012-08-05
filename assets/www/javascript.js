/**
 * Manager : Eng Ahmed Adel
 * Auhtor : Tarek Salah
 * Company : BadrIT
 */

// add event device ready to begin check the location
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

var first_run;
// boolean to check that it is the first run
// if it is the first run load the image  and
// if not --> don't load it
var first_check = true;
// hold the path of the image
var path;

/*******************************CAPTURE IMAGE*******************************************/
// used to load image after the page load
function loadImg() {
	first_run = false;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

// called when the device become ready to
// work with GPS
function onDeviceReady() {
	// if it is the first time to run the program
	if(first_check == true) {
		loadImg();
		// disable the boolean so as not to login again
		first_check = false;
	}
}

// capture image
function captureImage() {
	navigator.device.capture.captureImage(captureSuccess, captureError, {
		limit : 1,                 // limit to number of captures
		saveToPhotoAlbum : false
		// it shouldn't save to memory but in android
		//this won't work
	});
}

// called when sucess on capture
function captureSuccess(mediaFiles) {
	// mediafile is the object that contains properties of the
	// pic like name , path ....
	var i, len;
	// for loop in case of many capture
	for( i = 0, len = mediaFiles.length; i < len; i += 1) {
		uploadFile(mediaFiles[i]);
	}
}

// called when failure
function captureError(error) {
	var msg = 'An error occurred during capture: ' + error.code;
	navigator.notification.alert(msg, null, 'Uh oh!');
}

// upload file to server and show the image in html
function uploadFile(mediaFile) {
	var ft = new FileTransfer(), name = mediaFile.name;
	path = mediaFile.fullPath;
	$("#IMG_1").attr("src", path);
	first_run = true;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

/*****************************SAVING&LOADING**********************************/
// open file system
function gotFS(fileSystem) {
	fileSystem.root.getFile("save.txt", {
		create : true,
		exclusive : false
	}, gotFileEntry, fail);
}

// called when succeeded in opening file system
function gotFileEntry(fileEntry) {
	if(first_run == false) {
		// read the file
		fileEntry.file(gotFile, fail);
		//alert(false);
	} else {
		// write the file
		fileEntry.createWriter(gotFileWriter, fail);
		//alert(true);
	}
}

// write the path of the image to file
function gotFileWriter(writer) {
	//alert(path);
	writer.write(path);
	writer.abort();
}

// read the path of the image and show it
// in HTML
function gotFile(file) {
	var reader = new FileReader();
	reader.onloadend = function(evt) {
		console.log("Read as data URL");
		console.log(evt.target.result);
		//alert(evt.target.result);
		$("#IMG_1").attr("src", evt.target.result);
	};
	reader.readAsText(file);
}

// called in case of failure
function fail(error) {
	console.log(error.code);
}