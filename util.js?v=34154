HTML5_CLIENT = false;
NATIVE_CLIENT = false;

checkEnvironment();

window.onload = init;
var browser = new GetPlatform();
var controlArguments = window.parent.controlArguments || new Object;
var installOnly = GetVar("installOnly");
var allUsers = GetVar("allusers");
var printJob = undefined;
var pdfData = undefined;
var dimensionsSet = false;
var dialogLocationVertical = "upper"; // top, upper, middle or bottom
var dialogLocationHorizontal = "center"; // left, center or right
var overrideLanguage = "";
var connectingtoString = "Connecting to "
var hostString = " host "
var pleaseCopyString = "please press Ctrl/Cmd+C to copy"
var nativeClientDisabledString = "It appears that AppController is not installed. Click below to run applications in your browser.";

var printFrame = document.getElementById("printFrame");

if (printFrame) {
	PDFJS.workerSrc = 'print/build/pdf.worker.js?v=34154';
}

determineClient();

var controlArgs = controlArgs || (function(){
    return { set : function(Args) { controlArguments[Args[0]] = Args[1]; } };
}());

function init() {

	if (controlArguments.hasOwnProperty("showTitle") &&
		controlArguments["showTitle"] == "true")
	{
		var bar = parent.document.getElementById('barFrame');
		if (bar)
		{
			bar.style.display = "block";
		}
	}

	var data = document.location.search.split("?");
	
	if (data[1] == "help=ac")
	{
		window.location.search = "?host=127.0.0.1&useApp=false&adminWithArgs=true&app=adminconsole&args=-eventNotifications&help=quickstart.html&noscale=true";
		return;
	}

	if ((NATIVE_CLIENT == true) && (BROWSER_INTERFACE == true))
	{
		CallbackLoop();
	}
}

function ReloadOnce() {	
    console.log("ReloadOnce");
	var reloads = window.localStorage.getItem('RELOAD_COUNT');	
	
	if ((reloads) && (reloads > 0)) {	
		console.log("ResetReloadCount");	
		localStorage.removeItem("RELOAD_COUNT");
	}
	else {		
		window.localStorage.setItem('RELOAD_COUNT', reloads + 1);
		ReloadPage();
	}
}

function GetState() {
	var state = window.localStorage.getItem('UI_STATE');
	
	if (state == undefined)	{
		state = "UI_LOADING";	
	
		var nativeAppState = window.localStorage.getItem('INSTALLED_STATE');
		
		if (nativeAppState != undefined) {
			window.localStorage.setItem("nextState", "UI_LAUNCH");	
		}
				
		var installerDownloaded = window.localStorage.getItem('installerDownloaded');
		
		if (installerDownloaded == undefined) {
			window.localStorage.setItem('installerDownloaded', "false");			
		}
	}

	return state;
}

function SetState(state) {	
	if (state == undefined)	{
		state = "UI_LOADING";		
	}
		
	window.localStorage.setItem('UI_STATE', state);
}

function UpdateState(state) {	
	console.log("UpdateState(" + state + ")");
	var delayUI = false;
	var longDelay = false;
	var oldState = GetState();
	var update = true;
	
	if (state == undefined) {
		state = oldState;
		
		nextState = window.localStorage.getItem('nextState');
		
		if (nextState == "UI_NONE") {
			window.localStorage.removeItem("nextState");
		}
	}
	
	if (state == "UI_NONE") {
		state = "UI_LOADING";
	}
	
	SetState(state);
	
	switch(state) {
		case "UI_DOWNLOAD":			
			if (oldState != "UI_DOWNLOAD") {
				delayUI = true;	
				ReloadPage();
			}
			break;
		case "UI_LAUNCH":		
			if (oldState == "UI_DOWNLOAD") {
				window.localStorage.setItem('installerDownloaded', "true");	
				delayUI = true;	
				ReloadPage();				
			}
			else if (oldState != "UI_LAUNCH") {
				delayUI = true;	
				ReloadPage();
			}
			break;
		case "UI_FIRSTLOAD":
			state = GetState();	
			UpdateUI(state);
			longDelay = true;	
			break;
		case "UI_LOADING":
			if (oldState != "UI_LOADING") {
				ReloadPage();
			}
			longDelay = true;	
			UpdateUI(state);
			break;
		case "UI_CONFIRM":
			if (window.localStorage.getItem('confirmationCheckbox') == "true") {
				cancelDialog();
				update = false;
				SetState("UI_LAUNCH");
			}			
			break;
		case "UI_RECONNECT":
			delayUI = true;	
			SetState("UI_LOADING");
			window.localStorage.setItem("nextState", "UI_LAUNCH");
			ReloadPage();
			break;
		case "UI_APPROVEHTML5":
			SetState("UI_LAUNCH");
			break;
		case "UI_CANCELHTML5":
			SetState("UI_LAUNCH");
			delayUI = true;	
			ReloadPage();
			break;
		default:		
	}
	
	if (longDelay) {
		setTimeout(function() {
			state = GetState();
			
			if ((state == "UI_FIRSTLOAD") || (state == "UI_LOADING")) {
				// only make changes if the state is still UI_LOADING
			
				//console.log("8 second timeout");
				if (state == "UI_FIRSTLOAD") {
					SetState("UI_LAUNCH");
				}
				else if (state == "UI_LOADING") {
					nextState = window.localStorage.getItem('nextState');
					
					if (nextState != undefined) {
						SetState(nextState);
						window.localStorage.removeItem("nextState");
						
						/*if (nextState == "UI_DOWNLOAD") {
							ReloadPage();
						}*/
					}
					else {
						SetState("UI_LAUNCH");
					}
				}
					
				state = GetState();
				
				if (state != "UI_NONE") {
					UpdateUI(state);
				}
			}
		}, 8000);
	}
	else if (delayUI) {
		setTimeout(function() {
			//console.log("1 second timeout");
			UpdateUI(state);
		}, 1000);
	}
	else if (update == true) {
		UpdateUI(state);
	}
}

function UpdateUI(state) {
	var dialog = document.getElementById("installAppContent");
	
	var elementList = dialog.getElementsByClassName("UI");
					
	if (elementList) {
		for (i = 0; i < elementList.length; i++) {
			occurance = elementList[i];
			
			if (occurance) {
				if (occurance.classList.contains(state)) {
					occurance.style.visibility = "visible";
					occurance.style.display = "block";
				}
				else {
					occurance.style.visibility = "hidden";	
					occurance.style.display = "none";					
				}
			}
		}
	}
		
	if ((GetVar("useApp") == "false") || ((controlArguments.hasOwnProperty("useApp") && controlArguments["useApp"] == "false"))) {
		closeDialog();
	//	DisplayBar();
	}
	else {
		TweakUI();
	//	DisplayBar();
		DisplayUI();
	}
}

function TweakUI() {	
	var connectingMessageObject = parent.document.getElementById("connectingMessage");
	
	if (connectingMessageObject) {
		var endPointName = window.localStorage.getItem('BRAND_NAME_ENDPOINT');
		
		if (endPointName) {
			connectingMessageObject.innerHTML = connectingtoString + endPointName + "...";
		}
		else if (location.hostname) {		
			connectingMessageObject.innerHTML = connectingtoString + location.hostname + "...";
		}
	}		

	var runInBrowserObject = parent.document.getElementById("runInBrowser");
	
	if ((runInBrowserObject) && (GetVar("useApp") == "force")) {
		runInBrowserObject.style.visibility = "hidden";	
		runInBrowserObject.style.display = "none";	
	}	
	
	var runInBrowserLink = parent.document.getElementById("runInBrowserLink");
	
	if (runInBrowserLink) {
		var defaultElement = DEFAULT_ELEMENT_STRINGS[BRAND_ELEMENT_LIST.indexOf("BRAND_CLIENT_BROWSER")];
		
		if (defaultElement == runInBrowserLink.innerHTML) {
		
			var apps = GetVar("app");
			
			if ((apps != undefined) && (apps != "")) {
				runInBrowserLink.innerHTML = defaultElement.replace("applications", apps);
			}
		}
	}
	
	var reconnectObject = parent.document.getElementById("reconnectLink");
	
	if (reconnectObject) {
		var reconnectString = reconnectObject.innerHTML;
		var endPointName = window.localStorage.getItem('BRAND_NAME_ENDPOINT');
		
		if (endPointName) {
			reconnectObject.innerHTML = reconnectString.replace(hostString, " " + endPointName + " ");	
		}
		else if (location.hostname) {
			reconnectObject.innerHTML = reconnectString.replace(hostString, " " + location.hostname + " ");
		}
	}	
			
	var installerDownloaded = window.localStorage.getItem('installerDownloaded');
	var installedState = window.localStorage.getItem('INSTALLED_STATE');
	
	if (((installerDownloaded != undefined) && (installerDownloaded == "false")) || (GetState() == "UI_DOWNLOAD") || ((installedState != undefined) && (installedState != "installed"))) {
		var runDownload = parent.document.getElementById("runDownload");
		
		if (runDownload != undefined) {
			runDownload.style.display = "none";		
		}
		
		var runInstall = parent.document.getElementById("runInstall");
		
		if (runInstall != undefined) {
			runInstall.style.display = "none";
		}			
			
		var promptMessage = parent.document.getElementById("promptMessage");
		
		if (promptMessage != undefined) {
			promptMessage.innerHTML = promptMessage.innerHTML.replace("3. ", "");
		}
		
		if ((GetVar("installApp") == "false") || (GetVar("installApp") == "0")) {
			if (promptMessage != undefined) {				
				promptMessage.innerHTML = promptMessage.innerHTML = nativeClientDisabledString; 
						
				var nothingHappening = parent.document.getElementById("nothingHappening");
		
				if (nothingHappening != undefined) {
					nothingHappening.style.display = "none";
				}
				
				var startButton = parent.document.getElementById("startButton");
		
				if (startButton != undefined) {
					startButton.style.display = "none";
				}
			}		
		}
	}	
	else if ((GetState() == "UI_LAUNCH") && ((installedState != undefined) && (installedState == "installed"))) {
		var runDownload = parent.document.getElementById("runDownload");
		
		if (runDownload != undefined) {
			runDownload.style.display = "none";		
		}
		
		var runInstall = parent.document.getElementById("runInstall");
		
		if (runInstall != undefined) {
			runInstall.style.display = "none";
		}			
			
		var promptMessage = parent.document.getElementById("promptMessage");
		
		if (promptMessage != undefined) {				
			promptMessage.innerHTML = promptMessage.innerHTML.replace("3. ", "");
		}	
	}
}

function UpdateDialogTitle() {	
	var dialogObject = parent.document.getElementById("installDialogTitle");
	
	if (dialogObject) {
		var endPointName = window.localStorage.getItem('BRAND_NAME_ENDPOINT');
		
		if (endPointName) {
			dialogObject.innerHTML = endPointName;	
		}
		else if (location.hostname) {
			dialogObject.innerHTML = location.hostname;
		}
	}
}

function AddBarMessage(message, uiLink, downloadLink) {
	var barObject = parent.document.getElementById("messageAppContent");
	
	if (barObject) {
		var messageID = uiLink + "_Header";
		var messageObject = parent.document.getElementById(messageID);	
		
		if (messageObject) {
			// This message is already displayed
			return;
		}
		
		var messageDiv = document.createElement("div");
		messageDiv.id = messageID;
		messageDiv.classList.add("barFrame");
		messageDiv.classList.add("messageHeader");
		
		var tabDiv = document.createElement("div");
		tabDiv.classList.add("tab")
		
		var linkTag = document.createElement("a");
		
		if (downloadLink) {
			linkTag.href = downloadLink;
		}
		else {
			linkTag.href = "javascript:void(0)";
		}
		
		linkTag.id = uiLink + "_Link";
		linkTag.title = uiLink;
		linkTag.innerHTML = message;
		
		linkTag.classList.add("barLink");
		
		linkTag.addEventListener('click', function(e) {
			console.log('Click happened for: ' + e.target.id);
			var linkObject = parent.document.getElementById(e.target.id);
			
			if ((linkObject) && (linkObject.title)) {
				UpdateState(linkObject.title);
			}
		});
		
		barObject.style.display = "block";
		messageDiv.style.visibility = "visible";
		messageDiv.style.display = "block";
		
		tabDiv.appendChild(linkTag);
		messageDiv.appendChild(tabDiv);	
		barObject.appendChild(messageDiv);	
		
		var customColor = localStorage.getItem("BRAND_CLIENT_COLOR");
	
		if (!customColor) {
			customColor = "#0f3b80";
		}
		
		var contrastColor = invertColor(customColor, true);
					
		var elementList = document.getElementsByClassName('barLink');
		
		if (elementList) {
			for (i = 0; i < elementList.length; i++) {
				occurance = elementList[i];
				
				if (occurance) {
					occurance.style.backgroundColor = customColor;
					occurance.style.borderColor = customColor;
					occurance.style.color = contrastColor;
				}
			}
		}

		var elementListFrame = document.getElementsByClassName('barFrame');
		
		if (elementListFrame) {
			for (i = 0; i < elementListFrame.length; i++) {
				occurance = elementListFrame[i];
				
				if (occurance) {
					occurance.style.backgroundColor = customColor;
					occurance.style.borderColor = customColor;
					occurance.style.color = contrastColor;
				}
			}
		}
		
		var dialogObject = parent.document.getElementById("messageApp");
		
		if (dialogObject) {
			dialogObject.style.display = "inline-block";
		}
				
		var elementList = document.getElementsByClassName('messageHeader');
			
		if (elementList) {
			for (i = 0; i < elementList.length; i++) {
				occurance = elementList[i];
				
				if ((occurance) && (occurance.offsetWidth)) {
					var middlePoint = ((window.innerWidth / 2) - (occurance.offsetWidth / 2));
					dialogObject.style.top = "0px";
					dialogObject.style.left = middlePoint + "px";
				}
			}
		}
	}
}

function DisplayUI() {
	if (window.innerWidth < 480) { // small, mobile screens		
		var modal = document.getElementById('installApp');
		
		if (modal) {
			modal.style.width = window.innerWidth + "px";
		}
	}
	
	if (window.innerHeight < 480) { // small, mobile screens	
		dialogLocationVertical = "top";
	}
		
	var dialogContent = parent.document.getElementById("installAppContent");
	
	if (dialogContent) {
		dialogContent.style.display = "inline-block";
	}
	
	var dialogObject = parent.document.getElementById("installApp");
	
	if (dialogObject) {
		dialogObject.style.display = "inline-block";
	}
	
	if (dialogObject) {
		dialogTop = localStorage.getItem('dialogTop');
		dialogLeft = localStorage.getItem('dialogLeft');
	
		if (dialogTop && dialogLeft) {
			dialogObject.style.top = dialogTop + "px";
			dialogObject.style.left = dialogLeft + "px";			
		}
		else {
			if (dialogLocationVertical == "bottom") {
				dialogObject.style.bottom = "10px";
			}
			else if (dialogLocationVertical == "middle") {
				var middlePoint = ((window.innerHeight - dialogObject.offsetHeight) / 2);
				dialogObject.style.top = middlePoint + "px";
			}
			else if (dialogLocationVertical == "upper") {
				var upperPoint = ((window.innerHeight - dialogObject.offsetHeight) / 4);
				dialogObject.style.top = upperPoint + "px";
			}
			else { // top				
				dialogObject.style.top = "0px";
			}
						
			if (dialogLocationHorizontal == "right") {
				dialogObject.style.right = "0px";
			}
			else if (dialogLocationHorizontal == "center") {
				var middlePoint = ((window.innerWidth - dialogObject.offsetWidth) / 2);
				dialogObject.style.left = middlePoint + "px";
			}
			else { // left				
				dialogObject.style.left = "0px";
			}
		}
		
		dragElement(dialogObject);	
	}
}

function OpenLink(url) {	
	console.log("OpenLink(" + url + ")");
	
	if ((url) && (url.length > 0)) {
		location.assign(url);
	}
}

function OpenApp(object) {	
	console.log("OpenApp(" + object + ")");
	
	if ((object) && (object.length > 0)) {		
		var url = document.getElementById(object);
		
		if ((url) && (url.title)) {
			location.assign(url.title);
		}
		
		if (object == "linkIOS") {
			NativeAppConnectedNotification("false");			
		}
	}
}

function inputCheckChanged() {
	const input = document.getElementById('confirmationCheckbox');
	
	if (input) {
		window.localStorage.setItem('confirmationCheckbox', input.checked);		
	}
}

function determineClient() {
	
	if (browser.cros)
	{
		HTML5_CLIENT = true;
		NATIVE_CLIENT = false;
	}
	else if ((GetVar("useApp") == "force") || IsInstalled())
	{
		NATIVE_CLIENT = true;
		HTML5_CLIENT = false;
	}
	else
	{
		HTML5_CLIENT = true;
		NATIVE_CLIENT = false;
	}
}

function NextStep(step)
{
	var instructionList = document.getElementsByClassName(step);
		
	if (instructionList) {
		for (i = 0; i < instructionList.length; i++) {
			occurance = instructionList[i];
			occurance.style.visibility = "visible";
		}
	}	

    setPage("", step);
	
	return true;
}

function TailorForOS()
{
	BrandColors();
	
	if (!browser) {
		browser = new GetPlatform();
	}
	
	var os = "OS_UNKNOWN";
	
	if (browser.win)
	{
		if (allUsers == "true")
		{
			os = "OS_WINDOWS_ALLUSERS";			
		}
		else
		{
			os = "OS_WINDOWS";
		}
	}
	else if (browser.ios)
	{
		os = "OS_IOS";
	}
	else if (browser.cros)
	{
		os = "OS_CHROME";
	}
	else if (browser.android)
	{
		os = "OS_ANDROID";
	}
	else if (browser.mac)
	{
		os = "OS_MAC";
	}
	else if (browser.linux)
	{
		if ((browser.redhat) || (browser.suse))
		{
			os = "OS_LINUX_REDHAT";			
		}
		else if (browser.ubuntu)
		{
			os = "OS_LINUX_DEBIAN";			
		}
		else
		{
			os = "OS_LINUX_UNKNOWN";
		}
	}
		
	var elementList = document.getElementsByClassName("OS");
		
	if (elementList) {
		for (i = 0; i < elementList.length;) {
			occurance = elementList[i];
			
			if (occurance.classList.contains(os))
			{
				occurance.style.visibility = "visible";
				occurance.style.display = "block";
				i++;
			}
			else
			{
				occurance.parentNode.removeChild(occurance);
			}
		}
	}
}

function TailorForBrowser()
{
	if (!browser) {
		browser = new GetPlatform();
	}
	
	if (!browser.chrome)
	{
		var elementList = document.getElementsByClassName("browserChrome");
			
		if (elementList) {
			for (i = 0; i < elementList.length; i++) {
				occurance = elementList[i];
				occurance.style.display = "none";
			}
		}
	}		
	
	if (!browser.firefox)
	{
		var elementList = document.getElementsByClassName("browserFirefox");
			
		if (elementList) {
			for (i = 0; i < elementList.length; i++) {
				occurance = elementList[i];
				occurance.style.display = "none";
			}
		}
	}
	
	if (!browser.msie)
	{
		var elementList = document.getElementsByClassName("browserMSIE");
			
		if (elementList) {
			for (i = 0; i < elementList.length; i++) {
				occurance = elementList[i];
				occurance.style.display = "none";
			}
		}
	}		
	
	if (!browser.edge)
	{
		var elementList = document.getElementsByClassName("browserEdge");
			
		if (elementList) {
			for (i = 0; i < elementList.length; i++) {
				occurance = elementList[i];
				occurance.style.display = "none";
			}
		}
	}
}

function resetInstallationState() {
	localStorage.removeItem("INSTALLED_STATE");
	localStorage.removeItem("UI_STATE");
	location.reload();
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

function GetPlatform()
{
	// Browser name string, major version, and agent string
	var name     = navigator.appName;
	var ver      = parseInt(navigator.appVersion);
	var agent    = navigator.userAgent;
	var platform = navigator.platform;

	// Microsoft Internet Explorer and version
	this.msie     = (document.documentMode != undefined);
	this.msie4up  = (document.documentMode >= 4);  
	this.msie6up  = (document.documentMode >= 6);
	this.msie7up  = (document.documentMode >= 7);
	this.msie10orlower  = (document.documentMode <= 10);

	this.edge = (agent.toLowerCase().indexOf("edge/") != -1);
	
	// Netscape Navigator and version
	this.ns = (name.indexOf("Netscape") != -1);
	this.ns4up = (this.ns && (ver >= 4));

	// Netscape 6 version is actually version 5.0 when getting the appVersion property.	
	this.ns6up = (this.ns && (ver >= 5));

	this.ff3     = (agent.toLowerCase().indexOf("firefox/3") != -1);
	this.ff4     = (agent.toLowerCase().indexOf("firefox/4") != -1);
	this.firefox = (agent.toLowerCase().indexOf("firefox") != -1);
	this.firefoxversion = (parseInt(agent.toLowerCase().substr((agent.toLowerCase().indexOf("firefox") + 8), 4)));

	this.chrome  = (agent.toLowerCase().indexOf("chrome") != -1);
	this.cros    = (agent.toLowerCase().indexOf("cros") != -1);
	
	if (this.cros == true)
	{
		this.chrome = false;
		this.safari = false;		
	}
	
	if (this.edge == true)
	{
		this.chrome = false;
		this.safari = false;
	}	
	else if (this.chrome == true)
	{
		this.safari = false;
	}
	else if (this.cros == false)
	{
		this.safari = (agent.toLowerCase().indexOf("safari") != -1);
	}
	
	if (this.safari)
	{
		this.safari10 = (agent.toLowerCase().indexOf("version/1") != -1);		
	}

	// Operating system, test both Netscape agent or MSIE agent strings.
	this.win95 = ((agent.indexOf("Win95")!=-1) || (agent.indexOf("Windows 95")!=-1));
	this.win98 = ((agent.indexOf("Win98")!=-1) || (agent.indexOf("Windows 98")!=-1));
	this.winnt = ((agent.indexOf("WinNT")!=-1) || (agent.indexOf("Windows NT")!=-1));
    if(this.winnt == true)
    {
        this.surface = isTouchDevice();
    }
	this.win   = (agent.indexOf("Win") != -1);
	this.mac   = (agent.indexOf("Mac") != -1);
	this.sun   = (agent.indexOf("SunOS") != -1);
	this.linux = (agent.indexOf("Linux") != -1);
	this.os2   = (agent.indexOf("OS2") != -1) || (agent.indexOf("OS/2") != -1);
	this.ce    = (platform.indexOf("CE") != -1);
	this.ppc   = (agent.indexOf("PPC") != -1);
	this.ios   = /iPad|iPhone|iPod/.test(agent) && !window.MSStream;
	this.android = (agent.toLowerCase().indexOf("android") != -1);
	this.ubuntu = (agent.toLowerCase().indexOf("ubuntu") != -1);
	this.redhat = (agent.toLowerCase().indexOf("red hat") != -1);
	this.suse = (agent.toLowerCase().indexOf("suse") != -1);
	
	if ((this.mac == true) && (this.ios == false))
	{
		// Check if this is a touch screen device.
		// If so, we're on an iPad requesting the desktop version of this site.
		if (isTouchDevice() == true) {
			this.mac = false;
			this.ios = true;
		}
	}
	
	this.softkeyboard = ((this.android == true) || (this.ios == true) || (this.surface == true));
}

function IsInstalled()
{	
	// TODO: determine if the native client is installed
	return false;
}

function GetSearchString()
{
	return_value = '';
	get_string = document.location.search;

	if (get_string != '')
	{
		question_index = get_string.indexOf('?');
		return_value = get_string.substr(question_index + 1, get_string.length - 1);
	}

	return (return_value);  
}

function GetVarDecoded(name)
{
    var result = GetVar(name);
    return decodeURIComponent(result);
}

function GetVar(name)
{
	get_string = document.location.search;         
	return_value = '';
	
	do 
	{
		name_index = get_string.indexOf(name + '=');
		
		if (name_index != -1)
		{
			get_string = get_string.substr(name_index + name.length + 1, get_string.length - name_index);
			
			end_of_value = get_string.indexOf('&');

			if (end_of_value != -1)     
			{           
				value = get_string.substr(0, end_of_value);       
			}         
			else                
			{
				value = get_string;        
			}        
			
			if (return_value == '' || value == '')
			{
				return_value += value;
			}
			else
			{
				return_value += ', ' + value;
			}
		}
	} 
	while (name_index != -1)
	
	space = return_value.indexOf('+');

	while (space != -1)
	{ 
		return_value = return_value.substr(0, space) + ' ' + 
		return_value.substr(space + 1, return_value.length);
		space = return_value.indexOf('+');
	}

	return (return_value);
}

function buildCommandLine(useOIDC) {
	var query = location.search.substr(1);
	var data = query.split("&");
	var appArgs = false;
	var fullCommandLine = "";
	var websocketDefined = false;
	var host = location.hostname;
	var port = "491";

	if (useOIDC === 1)
	{
		var hash = window.location.hash.split("#");
		if (hash[1] !== undefined) {
			fullCommandLine += writeCommandLineParameter("OIDC", decodeURIComponent(hash[1])) + " ";
		}
	}
		
	var endPointName = window.localStorage.getItem('BRAND_NAME_ENDPOINT');
		
	if (endPointName) {
		fullCommandLine += writeCommandLineParameter("endpointName", "\"" + endPointName + "\"") + " ";
	}
			
	// Process any arguments added in logon.html
	for (var property in controlArguments) {
		if (controlArguments.hasOwnProperty(property)) {
			if (data[0] == "")
			{
				data[0] = property + "=" + controlArguments[property];
			}
			else
			{
				data[data.length] = property + "=" + controlArguments[property];
			}
		}
	}
	
	for (var i = 0; i < data.length; i++)
	{		
		var item = data[i].split("=");
		
		if (item[0] == "WebSocketURL")
		{
			websocketDefined = true;
		}
		else if (item[0] == "host")
		{
		    host = item[1];
		}
		else if (item[0] == "port")
		{
		    port = item[1];
		}
		else if ((item[0] == "r") || (item[0] == "args"))
		{
			// make sure any app-bound arguments are put at the end of the command line
			appArgs = true;
			appArgsValue = item[1];
			continue;		
		}
        else if (item[0] == "language")
        {
            overrideLanguage = item[1];
        }
		
		if (item[0] != "" && item[0] != "host")
		{
			fullCommandLine += writeCommandLineParameter(item[0], decodeURIComponent(item[1])) + " ";
		}
	}
	
	if ((location.protocol == "https:") && (websocketDefined == false))
	{
		host = "wss://" + host;
	}
	
	fullCommandLine += writeCommandLineParameter("host", host) + " ";

	if (appArgs == true)
	{
		fullCommandLine += writeCommandLineParameter("r", decodeURIComponent(appArgsValue)) + " ";
	}
	
	return fullCommandLine;
}

function writeCommandLineParameter(param, value) {
	var retVal = "";
	var iframeElement = document.getElementById("iFrameWebApp");
	var iframeElementLogon = document.getElementById("iFrameLogon");
	var canvasElement = document.getElementById("canvas");
	
	if (value && (value.length > 0))
	{
		if (value == "true")
		{
			value = "1";
		}
		else if (value == "false")
		{
			value = "0";
		}
	
		switch (param) {
			case "host":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-h');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}

				var address = value.split('//');
				if (address[1] != undefined)
				{
					value = address[1];
				}

				retVal = "-h " + value;
				break;
			case "user":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-u');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-u " + value;
				break;
			case "password":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-p');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-p " + value;
				break;
			case "app":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-a');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-a " + value;
				break;
			case "port":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-hp');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-hp " + value;
				break;			
			case "printerconfig":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-ac');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-ac " + value;
				break;					
			case "keyboard":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-kb');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-kb " + value;
				break;			
			case "args":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-r');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-r " + value;
				break;
			case "multimonitor":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-mm');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-mm " + value;
				break;
            case "showlogon":
                if (iframeElement) {
                    iframeElement.contentWindow.Module['arguments'].push('-showlogon');
                    iframeElement.contentWindow.Module['arguments'].push(value);
                }
                retVal = "-showlogon " + value;
                break;
			case "video":
				
				if (value == 1)
				{
					if (iframeElement) 
					{
						iframeElement.contentWindow.Module['arguments'].push('-video');
					}			
					retVal = "-video";
				}
				else if(value == 2)
				{
					if (iframeElement) 
					{
						iframeElement.contentWindow.Module['arguments'].push('-fullvideo');
					}
					retVal = "-fullvideo";
				}
				else if(value == 3)
				{
					if (iframeElement) 
					{
						iframeElement.contentWindow.Module['arguments'].push('-video');
						iframeElement.contentWindow.Module['arguments'].push('-testvideo');
					}
					retVal = "-video -testvideo";
				}
				else if(value == 4)
				{
					if (iframeElement) 
					{
						iframeElement.contentWindow.Module['arguments'].push('-fullvideo');
						iframeElement.contentWindow.Module['arguments'].push('-testvideo');
					}
					retVal = "-fullvideo -testvideo";
				}
				else // (value == 0)
				{
					if (iframeElement) 
					{
						iframeElement.contentWindow.Module['arguments'].push('-novideo');
					}
					retVal = "-novideo";
				}
				
				break;
            case "keyreportingmethod":
                if (iframeElement) {
                    iframeElement.contentWindow.Module['arguments'].push('-krm');
                    iframeElement.contentWindow.Module['arguments'].push(value);
                }
                retVal = "-krm " + value;
                break;
			case "maxbpp":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-mx');
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-mx " + value;
				break;
            case "computerName":
                if (iframeElement) {
                    iframeElement.contentWindow.Module['arguments'].push('-cn');
                    iframeElement.contentWindow.Module['arguments'].push(value);
                }
                retVal = "-cn " + value;
                break;
			case "clientframe":
			case "f":
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-f');
				}
				retVal = "-f " + value;
				break;
			case "compression":	
			case "c":
				if (value == 1)
				{
					if (iframeElement) {
						iframeElement.contentWindow.Module['arguments'].push('-c');
					}
					retVal = "-c";
				}
				else
				{
					if (iframeElement) {
						iframeElement.contentWindow.Module['arguments'].push('-nc');
					}
					retVal = "-nc";
				}					
				break;
			case "nc":
				if (value == 1)
				{
					if (iframeElement) {
						iframeElement.contentWindow.Module['arguments'].push('-nc');
					}
					retVal = "-nc";
				}
				else
				{
					if (iframeElement) {
						iframeElement.contentWindow.Module['arguments'].push('-c');
					}
					retVal = "-c";
				}					
				break;
			case "WebSocketURL":
			    if (iframeElement && iframeElement.contentWindow.Module)
				{
					var ws = new WebSocket(value, 'binary');
					if (iframeElement) {
						iframeElement.contentWindow.Module['websocket'] = ws;
					}
					retVal = "-websocket " + ws;
				}
				break;
			case "width":
				if (value.includes("%")) {
					var pct = value.split("%");
					value = this.innerWidth * pct[0] / 100;
					value = value.toString();
				}
			case "height":
				if (value.includes("%")) {
					var pct = value.split("%");
					value = this.innerHeight * pct[0] / 100;
					value = value.toString();
				}
				
				dimensionsSet = true;
			
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-' + param);
					iframeElement.contentWindow.Module['arguments'].push(value);
					iframeElement.setAttribute(param, value);
				}
				
				if (iframeElementLogon) {
					iframeElementLogon.setAttribute(param, value);
				}

				if (canvasElement) {
					canvasElement.setAttribute(param, value);
				}
				
				retVal = "-" + param + " " + value;
				
				break;
			case "useApp":
				if (value.includes("force")) {
					var runInBrowserObject = parent.document.getElementById("runInBrowser");
		
					if (runInBrowserObject) {
						runInBrowserObject.style.visibility = "hidden";	
						runInBrowserObject.style.display = "none";	
					}	
				}
				// fall through
			case "gateway":
				if (value == 1)
				{
					gateway = 1;
				}
				// fall through
			default:
				// supported by default: -h, -u, -p, -a, -hp, -ac, -kb, -r, -mm, -mx, -f,
				// -bc, -st, -fb, -lz, -cbs, -md, -qt, -so, -ss, -cw
				// -authorityKey, -credentialsKey, -sessionID, -autoreconnect, 
				if (iframeElement) {
					iframeElement.contentWindow.Module['arguments'].push('-' + param);
					iframeElement.contentWindow.Module['arguments'].push(value);
				}
				retVal = "-" + param + " " + value;
				break;
		}
	}	
	
	return(retVal);
}

function GetCurrentLang() {
    
    if(overrideLanguage.length != 0)
    {
        return overrideLanguage;
    }
    
    var language = window.navigator.userLanguage || window.navigator.language;

    // Change any understore to a dash
    language = language.replace("_", "-");
    
    if (language == null)
    {
        language = "en";
    }
    
    return language;
}

function GetLocalizedClientStrings() {
    
    var lang = GetCurrentLang();
    
    var fileName = "\\localization\\strings\\gg_client_strings_" + lang + ".xml";
    
    var request = new XMLHttpRequest();
    request.open('GET', fileName, false);
    request.send();
    
    if(request.status == 200)
    {
        return request.responseText;
    }
    else if(lang.includes("-"))
    {
        var dashIndex = fileName.lastIndexOf("-")
        var shortFileName = fileName.substr(0, dashIndex);
        shortFileName = shortFileName + ".xml";
        
        var requestShort = new XMLHttpRequest();
        requestShort.open('GET', shortFileName, false);
        requestShort.send();
        
        if(requestShort.status == 200)
        {
            return requestShort.responseText;
        }
    }
    
    return "";
}

var PrintJob = function(filename) {
	this.parts = [];
	this.filename = filename;
}

PrintJob.prototype.append = function(filename, part) {
	if (this.filename == filename)
	{
		this.parts.push(part);
	}
	else
	{
		console.error("Error occurred while appending print job data: " + filename);
	}
};

PrintJob.prototype.getData = function(filename) {
	var baLength = 0;
	var raw = [];
	
	try
	{
		if (this.filename == filename)
		{
			for (var i = 0; i < this.parts.length; i++)
			{
				raw[i] = atob(this.parts[i]);
				baLength += raw[i].length;
			}
			
			var uint8Array = new Uint8Array(new ArrayBuffer(baLength));
			var uintPos = 0;
			
			for (var i = 0; i < raw.length; i++)
			{
				for (var j = 0; j < raw[i].length; j++)
				{
					uint8Array[uintPos] = raw[i].charCodeAt(j);
					uintPos++;
				}	
			}
		}
		else
		{
			console.error("Error occurred while getting print job data: " + filename);
		}
	}
	catch(err)
	{
		console.error("Error occurred while displaying print job: " + filename + " " + err.message);
	}
	
	return uint8Array;
};

function writePrintJob(filename, data) {	
	if ((printJob) && (printJob.filename != filename))
	{
		printJob = undefined;
	}
	
	if (!printJob) 
	{
		printJob = new PrintJob(filename);
	}
	
	printJob.append(filename, data);
}

function UnloadPdfDocument() {
	var iframeElement = document.getElementById("iFrameWebApp");

	if (iframeElement) {
		iframeElement.contentWindow.Module.ccall('PaintRootWindowCallback', 'null', ['null']);
	}
}

function LoadPdfDocument() {
	var printiFrame = document.getElementById('pdfViewer');
	
	printiFrame.addEventListener("unload", UnloadPdfDocument);	
	printiFrame.contentWindow.PDFViewerApplication.open(pdfData);
}

function displayFile(filename, type) {
	try
	{
		var frameDoc = document.getElementById('iFrameWebApp').contentDocument;
		var canvasFrame = frameDoc.getElementById('canvas');
		
		pdfData = printJob.getData(filename);
		
		var printiFrame = document.createElement("iframe");
		printiFrame.id = "pdfViewer";
		printiFrame.src = "print/web/viewer.html?v=34154";
		printiFrame.style = "width: 100%; height: 100%;";	
		printiFrame.width = canvasFrame.width;
		printiFrame.height = canvasFrame.height;			
		printiFrame.onload = function() {
			LoadPdfDocument();
		};
		
		var printFrame = document.getElementById('printFrame');
		printFrame.style.display = "block";
		printFrame.width = canvasFrame.width;
		printFrame.height = canvasFrame.height;		
		printFrame.appendChild(printiFrame);	
	}
	catch(err)
	{
		console.error("Error occurred while displaying print job: " + filename + " " + err.message);
	}
}

function checkEnvironment()
{
	// Define and methods that are undefined as noops
	var methods = ["assert", "cd", "clear", "count", "countReset", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed",
		"groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "select", "table", "time", "timeEnd", "timeStamp", "timeline", "timelineEnd", "trace", "warn"];
	var length = methods.length;
	var console = (window.console = window.console || {});
	var method;
	var noop = function() {};
	while (length--) {
		method = methods[length];
		if (!console[method])
			console[method] = noop;
	}
}

//Clipboard 'Copy Link' related functions
function startCopyLinkToClipboard(text) {
    document.getElementById("copy_link_text").value = text;
    document.getElementById("copyLinkClipboardModal").style.display = "block";
}

function copyLinkToClipboard(copyButton) {
    // find copy target element
    var
	copyTarget = copyButton.dataset.copytarget,
	inp = (copyTarget ? document.querySelector(copyTarget) : null);

    // is element selectable?
    if (inp && inp.select) {
        // select text
        inp.select();
        var success = false;

        try {
            // copy text
            success = document.execCommand('copy');
        }
        catch (err) {
            success = false;
        }

        if (success) {
            closeCopyLinkClipboardDialog();
        }
        else {
            alert(pleaseCopyString);
        }
    }
}

// When the user clicks on <span> (x), close the copy clipboard dialog
function closeCopyLinkClipboardDialog() {
    document.getElementById("copyLinkClipboardModal").style.display = "none";
    setPage("quickstart.html", "AC_GetLinkClose");
}

// When the user clicks anywhere outside of the copy clipboard dialog, close it
window.onclick = function (event)
{
	var modalLink = document.getElementById("copyLinkClipboardModal");
	if (event.target == modalLink)
	{
		closeCopyLinkClipboardDialog();
	}
	var modal = document.getElementById("copyClipboardModal");
	if (event.target == modal)
	{
		closeCopyClipboardDialog();
	}
}

//Clipboard MENU copy related functions
function startCopyToClipboard(text) {
	document.getElementById("copy_text").value = text;
	document.getElementById("copyClipboardModal").style.display = "block";
}

function copyToClipboard(copyButton) {
	// find copy target element
	var
	copyTarget = copyButton.dataset.copytarget,
	inp = (copyTarget ? document.querySelector(copyTarget) : null);

	// is element selectable?
	if (inp && inp.select) {
		// select text
		inp.select();
		var success = false;

		try {
			// copy text
			success = document.execCommand('copy');
		}
		catch (err) {
			success = false;
		}

		if (success) {
			closeCopyClipboardDialog();
		}
		else {
			alert(pleaseCopyString);
		}
	}
}

// When the user clicks on <span> (x), close the copy clipboard dialog
function closeCopyClipboardDialog() {
	document.getElementById("copyClipboardModal").style.display = "none";
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (parent.document.getElementById(elmnt.id + "Content")) {
    parent.document.getElementById(elmnt.id + "Content").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    parent.document.onmouseup = closeDragElement;
    parent.document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
	var dialogObject = parent.document.getElementById("installApp");
	
	if (dialogObject) {
		dialogTop = dialogObject.offsetTop;
		dialogLeft = dialogObject.offsetLeft;
		
		if (dialogTop < 0) {
			dialogTop = 0;
		}
		
		if (dialogLeft < 0) {
			dialogLeft = 0;
		}
		
		window.localStorage.setItem('dialogTop', dialogTop);
		window.localStorage.setItem('dialogLeft', dialogLeft);
	}	
	
    parent.document.onmouseup = null;
    parent.document.onmousemove = null;
  }
}