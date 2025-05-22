// GO-Global JavaScript Interface

var callbackLoopRunning = 0;
var callbackFrequency = 200; // sets the frequency of call to check for new messages
var messageProcessorInitialized = false;

// Deprecated function, use CallbackLoop()
function EnterCallbackLoop()
{
	CallbackLoop();
}

// Required function
function CallbackLoop()
{
	if (messageProcessorInitialized == false)
	{
		try
		{
			// An exception can be thrown here if the plugin is not loaded yet.
			var rapidx = document.getElementById(RAPIDX_CONTROL_NAME);
			
			if (rapidx != null) {
				rapidx.ResetMessageProcessor();
				messageProcessorInitialized = true;
			}
		}
		catch(err){}		
	}
		
	try
	{		
		var rapidx = document.getElementById(RAPIDX_CONTROL_NAME);
			
		if (rapidx != null) {
			rapidx.MessageProcessor();
		}
	}
	catch(err){}	
	
	setTimeout("CallbackLoop()", callbackFrequency);
}

// Required function
function ReturnValue(value)
{
	try
	{		
		if (HTML5_CLIENT == true)
		{
			return value;
		}
		else if (browser.firefox || browser.chrome)
		{ 	
			var rapidx = document.getElementById(RAPIDX_CONTROL_NAME);
				
			if (rapidx != null) {
				return rapidx.ReturnMessage(value);
			}
		}
	}
	catch(err){}
		
	return value;
}

// Optional function
function ConnectionOpened()
{
	console.log("ConnectionOpened()");
	
	try {
		parent.parent.window.ConnectionOpenedCB ();
	} catch(e) { }

	return ReturnValue();
}

// Optional function
function ConnectionClosed()
{
	console.log("ConnectionClosed()");
	
	try {
		parent.parent.window.ConnectionClosedCB ();
	} catch(e) { }

	if (browser.msie)
	{
		var isEmbedded = document.getElementsByName("isembeddedwin")[0];
		
		if (isEmbedded)
		{			
			isEmbedded = isEmbedded.value;
		}
		
		var autoclose = document.getElementsByName("autoclosebrowser")[0];
		
		if (autoclose)
		{			
			autoclose = autoclose.value;
		}
		
		if ((isEmbedded != null) && (isEmbedded == "true"))
		{
			if (autoclose == "true")
			{
				setTimeout(function() {window.close();}, 100); 
			}				
		}
	}
	
	return ReturnValue();
}

function DisplayHelp(page, section)
{
	parent.setPage(page, section);
}

function CopyToClipboard(text)
{
	parent.startCopyLinkToClipboard(text);
}

/////////////////////////////////////////////////////////////////////////////////////

// The functions below are provided as examples, they can be removed or modified as necessary.

function JavaScriptAlert()
{
	var outputString = "";

	for (var i = 0; i < arguments.length; i++)
	{
		outputString += arguments[i] + " ";
	}

	return ReturnValue(alert(outputString));
}

function JavaScriptConfirm()
{
	var outputString = "";

	for (var i = 0; i < arguments.length; i++)
	{
		outputString += arguments[i] + " ";
	}

	return ReturnValue(confirm(outputString));
}

function JavaScriptPrompt()
{
	var outputString = "";
	var defaultValue = 0;

	for (var i = 0; i < arguments.length; i++)
	{
		if (i == 0)
		{
			defaultValue = arguments[i];
		}
		else
		{
			outputString += arguments[i] + " ";
		}
	}

	return ReturnValue(prompt(outputString, defaultValue));
}

function JavaScriptAdd()
{
	var retVal = 0

	for (var i = 0; i < arguments.length; i++)
	{
		retVal += parseInt(arguments[i]);
	}

	return ReturnValue(retVal);
}

function JavaScriptStrlen()
{
	var totalStringLength = 0;

	for (var i = 0; i < arguments.length; i++)
	{
		totalStringLength += arguments[i].length;
	}

	return ReturnValue(totalStringLength)
}

