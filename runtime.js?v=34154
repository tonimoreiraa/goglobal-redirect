var statusElement = document.getElementById('status');
var progressElement = document.getElementById('progress');
var spinnerElement = document.getElementById('spinner');
var Module = {
	arguments: [],
	preRun: [],
	postRun: [],
	print: (function() {
		return function(text) {
			if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
			console.log(text);
		};
	})(),
	printErr: function(text) {
		if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
		if (0) { // XXX disabled for safety typeof dump == 'function') {
			dump(text + '\n'); // fast, straight to the real console
		} else {
			console.error(text);
		}
	},
	canvas: (function() {
		var canvas = document.getElementById('canvas');
		// As a default initial behavior, pop up an alert when webgl context is lost. To make your
		// application robust, you may want to override this behavior before shipping!
		// See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
		canvas.addEventListener("webglcontextlost", function(e) { alert('WebGL context lost. You will need to reload the page.'); e.preventDefau(); }, false);
		return canvas;
	})(),
	setStatus: function(text) {
		if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
		if (text === Module.setStatus.text) return;
		var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
		var now = Date.now();
		if (m && now - Date.now() < 30) return; // if this is a progress update, skip it if too soon
		if (m) {
		text = m[1];
			progressElement.value = parseInt(m[2])*100;
			progressElement.max = parseInt(m[4])*100;
			progressElement.hidden = false;
			spinnerElement.hidden = false;
		} else {
			progressElement.value = null;
			progressElement.max = null;
			progressElement.hidden = true;
			if (!text) spinnerElement.hidden = true;
		}
			statusElement.innerHTML = text;
	},
	totalDependencies: 0,
	monitorRunDependencies: function(left) {
	this.totalDependencies = Math.max(this.totalDependencies, left);
	Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
	}
};
Module.setStatus('Downloading...');
window.onerror = function() {
	Module.setStatus('Exception thrown, see JavaScript console');
	spinnerElement.style.display = 'none';
	Module.setStatus = function(text) {
		if (text) Module.printErr('[post-exception status] ' + text);
	};
};
                              
//iFrame window resize event
function iFrameWindowResize(e)
{
	var bIsScaleOnResize = Module.ccall('isScaleOnResizeCallback', 'number', ['null']);
	
	var frameHeight = 0;
	if(parent.parent != null)
	{
		var bar = parent.parent.document.getElementById('barFrame');
		if(bar != null)
			frameHeight = bar.offsetHeight;
	}

//	frameHeight += parent.document.getElementById('CSIMEFrame').offsetHeight;
//	console.log("function iFrameWindowResize() [%d,%d - %d]", e.target.innerWidth, e.target.innerHeight, frameHeight);

	if((parent.browser.android == true) || (parent.browser.ios == true) || (parent.browser.surface == true))
	{
		var canvas = e.target.document.getElementById('canvas');
		
        // If the width is staying the same on Android clients, this is due to the keyboard showing/hiding
		if((canvas.width == e.target.innerWidth) && (parent.browser.softkeyboard == true) && (parent.browser.android == true))
		{
			if(canvas.height - (e.target.innerHeight - frameHeight) > 200)
			{
                // Keyboard was just shown
				Module.ccall('softkeyboardToggleCallback', 'null', ['number'], [1]);
			}
			else
			{
                // Keyboard was just hidden
				Module.ccall('softkeyboardToggleCallback', 'null', ['number'], [0]);
			}

            // Change the size of the viewable size
			Module.ccall('ViewResizeCallback', 'null', ['number', 'number'], [e.target.innerWidth, e.target.innerHeight - frameHeight]);
		}
		else
		{
			// This is an orientation change, check if we want to scale the image, or resize the session
			if( ! bIsScaleOnResize)
			{
                //console.log("iFrameWindowResize Changing Session Size %d x %d", e.target.innerWidth, e.target.innerHeight - frameHeight);
                              
				var canvas = e.target.document.getElementById('canvas');
				canvas.width = e.target.innerWidth;
				canvas.height = e.target.innerHeight - frameHeight;
				Module.ccall('iFrameWindowResizeCallback', 'null', ['number', 'number'], [e.target.innerWidth, e.target.innerHeight - frameHeight]);
			}
			else
			{
                //console.log("iFrameWindowResize Changing View Size %d x %d", e.target.innerWidth, e.target.innerHeight - frameHeight);
                              
				var canvas = e.target.document.getElementById('canvas');
				canvas.width = e.target.innerWidth;
				canvas.height = e.target.innerHeight - frameHeight;
				Module.ccall('ViewResizeCallback', 'null', ['number', 'number'], [e.target.innerWidth, e.target.innerHeight - frameHeight]);
			}
		}
	}
	else
	{
		if ((!bIsScaleOnResize) || (!parent.dimensionsSet))
		{
			var canvas = e.target.document.getElementById('canvas');
			canvas.width = e.target.innerWidth;
			canvas.height = e.target.innerHeight - frameHeight;
			Module.ccall('iFrameWindowResizeCallback', 'null', ['number', 'number'], [e.target.innerWidth, e.target.innerHeight - frameHeight]);
		}
		else
		{
			Module.ccall('ViewResizeCallback', 'null', ['number', 'number'], [e.target.innerWidth, e.target.innerHeight - frameHeight]);
		}
	}
}

function outputKeyEvent(src, e)
{
	console.log("%s %s LOC %d KEY %s %d CODE %s '%s' keyCode %s ALT %s CTRL %s META %s SHIFT %s, input %s", src, e.type, e.location, e.key, e.key.length, e.code, e.char, e.keyCode, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey, parent.document.getElementById("CSIMEInput").value);
}

function outputFocusEvent(src, e)
{
	console.log("%s %s TAR %s %s BUB %s CAN %s REL %s", src, e.type, e.target, e.target.id, e.bubbles, e.cancelable, e.relatedTarget);
}

//Client Side IME event callback functions
function CSIMECompositionstart(e)
{
	//console.log("function CSIMECompositionstart() %s", e.data);
	//Reset the client side IME buffers before the composition starts.
	Module.ccall('CSIMECompositionstartCallback', 'null', ['null']);
	
	if((!parent.browser.android) && (!parent.browser.ios) && (!parent.browser.surface))
	{						  
		parent.document.getElementById('CSIMEInput').style.left = 'auto';
	}
}

function CSIMECompositionend(e)
{
	//console.log("function CSIMECompositionend() %s", e.data);
	parent.document.getElementById('CSIMEInput').style.left = '-999em';
	Module.ccall('CSIMECompositionendCallback', 'null', ['string'], [e.data]);
}

function CSIMEInput(e)
{
	var inputValue = parent.document.getElementById('CSIMEInput').value;
	//console.log("function CSIMEInput() %s", inputValue);
	Module.ccall('CSIMEInputCallback', 'null', ['string'], [inputValue]);
}
       
var isCSIMEFocused = false;
function CSIMEInputFocus(e)
{
    //console.log("function CSIMEInputFocus()");
    //            outputFocusEvent("INPUT", e);
                              
    isCSIMEFocused = true;
    Module.ccall('CSIMEFocusGainedCallback', 'null', ['null']);
                              
    // If the CSIMEInput gained the focus, we know any soft keyboard will be shown
    // On the surface, we are NOT told when the keyboard is hidden with the taskbar.
    // This causes the CSIMEInput to retain focus, so the keyboard would open for every tap.
    // By not setting the keyboard toggle to open, we will blur the CSIMEInput on the next tap.
    // The downside is that the keyboard will close on the tap and the user will need to reopen it.
    if((parent.browser.softkeyboard == true) && (parent.browser.surface == false))
    {
        Module.ccall('softkeyboardToggleCallback', 'null', ['number'], [1]);
    }
                              
    // For the ios or surface client, we know the keyboard will be showing if the CSIMEInput has the focus, so adjust the viewable area
    if(((parent.browser.ios == true) || (parent.browser.surface == true)) && (parent.browser.softkeyboard == true))
    {
        // For landscape, allow over-panning to 1/4 of the session height
        // For portrait, allow over-panning to 1/2 of the session height
        var canvas = document.getElementById('canvas');
        if(canvas.width > canvas.height)
        {
            Module.ccall('ViewResizeCallback', 'null', ['number', 'number'], [canvas.width, canvas.height/4]);
        }
        else
        {
            Module.ccall('ViewResizeCallback', 'null', ['number', 'number'], [canvas.width, canvas.height/2]);
        }
    }
}

function CSIMEInputBlur(e)
{
	//console.log("function CSIMEInputBlur()");
                              
    isCSIMEFocused = false;
                              
	// The IMEInput window receives the blur event, so we need to forward it to the window so SDL gets it. 
	// SDL resets all keydown status on this call to prevent the command key being stuck down during a command/tab 
                              
	var newEvent;
	newEvent = document.createEvent('Event');
	newEvent.initEvent('blur', e.bubbles, e.cancelable);
	newEvent.composed = e.composed;
	window.dispatchEvent(newEvent);

    // If the CSIMEInput lost the focus, we know any soft keyboard will be hidden
    if(parent.browser.softkeyboard == true)
    {
        Module.ccall('softkeyboardToggleCallback', 'null', ['number'], [0]);
        
        // For the Surface, set the focus back to the window, so if the user opens the softkeyboard with the taskbar, we will get the next keypress
        if(parent.browser.surface == true)
        {
            window.focus();
        }
    }

    // For the ios client, we know the keyboard will be hidden if the CSIMEInput lost the focus, so adjust the viewable area
    if(((parent.browser.ios == true) || (parent.browser.surface == true)) && (parent.browser.softkeyboard == true))
    {
        var canvas = document.getElementById('canvas');
        Module.ccall('ViewResizeCallback', 'null', ['number', 'number'], [canvas.width, canvas.height]);
    }
}
          
// This function, called when the window receives a keypress event, checks to see if the CSIMEInput element has the focus.
// If it doesn't, this must be a mobile client with a hardware keyboard. We need to set the focus to the CSIMEInput element,
// and then set the char (if it was a char) into the element and trigger an input event to send the char to the host.
// NOTE: For the Window's Surface, the softkeyboard, if opened with the taskbar item, will also come into this function
// without the CSIMEInput having focus, so it is treated slightly differently.
function CheckCSIMEInputFocus(e)
{
    //console.log("function CheckCSIMEInputFocus()");
                              
    if(isCSIMEFocused == false)
    {
        // For the Surface, we don't know if this is really a hardware keyboard
        if(parent.browser.surface == false)
        {
            // The only way to get here is a mobile client, hardware keyboard, first key pressed
            parent.browser.softkeyboard = false;
        }
        
        // Give the focus to the CSIMEInput element
        var input = parent.document.getElementById('CSIMEInput');
        input.focus();
                     
        // Check if this is a character that should have go into the CSIMEInput element
        if (String.fromCharCode(event.keyCode).length != 0)//.match(/(\w|\s)/g))
        {
            // Set the CSIMEInput string to the character
            input.value = String.fromCharCode(event.keyCode);
                
            // Trigger an input event so that we handle the new character in the CSIMEInput function
            var inputEvent = document.createEvent('Event');
            inputEvent.initEvent('input', true, true);
            input.dispatchEvent(inputEvent);
        }
    }
}
                              
function ParentBlur(e)
{
      //console.log("function ParentBlur()");
                              
      if(parent.browser.softkeyboard == true)
      {
          parent.document.getElementById('CSIMEInput').blur();
      }
}
                              
function SessionVisibility(e)
{
    //console.log(document.hidden, document.visibilityState);
                              
    if ( document.visibilityState == 'hidden' )
    {
        // To keep the main thread from being paused, keep playing a silent sound while hidden
        playSilentSound();
                              
        Module.ccall('sessionVisibility', 'null', ['number'], [0]);
    }
    else
    {
        Module.ccall('sessionVisibility', 'null', ['number'], [1]);
    }
}

var bHadFirstIECutOrCopy = false;

function onIEKeyDown(e)
{
//	outputKeyEvent("onIEKeyDown", e);

	if(e.ctrlKey)
	{
		var bIsCut = false;
		switch(e.key)
		{
		case 'x':
		case 'X':
			bIsCut = true;
		case 'c':
		case 'C':
		{
			var cut = Module.ccall('GetSelectedText', 'string', ['null']);
//			console.log("function onIEKeyDown() bIsCut %d bHadFirstIECutOrCopy %d %s", bIsCut, bHadFirstIECutOrCopy, cut);

			if(cut != null)
			{
				window.clipboardData.setData('Text', cut);

				// Since we will be canceling the cut operation, we need to manually
				// update the document to remove the currently selected text.
				if(bIsCut)
					Module.ccall('DeleteSelectedTextOnCut', 'null', ['null']);
			}

			if( ! bHadFirstIECutOrCopy)
			{
				bHadFirstIECutOrCopy = true;
				e.preventDefault();
			}

			break;
		}
		} // switch
	}
}

/*
 * Fix for bug #16599 - GRAPHON_Chromebook_HTML5 Client: Alt+gr key to produce the
 * euro sign € is not working in some applications
 * http://bugs.graphon.com/show_bug.cgi?id=16599
 * The Chrome OS AltGr key is processed as just an Alt key on the host. When the
 * Alt key is pressed on the host UNICODE characters are not processed. The fix
 * here is to prevent the default action of the AltGr key in javascript. We still
 * get the Euro key messages.
 *
 * Tested with Logon dialog, KeyMessages test app, Notepad and Wordpad.
 */
function onCROSKeyDown(e)
{
//	outputKeyEvent("onCROSKeyDown", e);

	if(e.type == 'keydown' && e.key == 'AltGraph')
	{
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
}

function onSuppressClipboard(e)
{
	// Prevent the default clipboard actions
	e.preventDefault();
}

var mouseButtonTimer;
function setMouseButtonTimer()
{
	//console.log("function setMouseButtonTimer()");
	mouseButtonTimer = setTimeout(mouseButtonTimerAlert, 200);
}
function cancelMouseButtonTimer()
{
	//console.log("function cancelMouseButtonTimer()");
	clearTimeout(mouseButtonTimer);
}
function mouseButtonTimerAlert() 
{
	//console.log("function mouseButtonTimerAlert()");
	Module.ccall('mouseButtonTimerCallback', 'null', ['null']);
}

// This touchend listener lets us know SDL has already put the same event into its queue.
// Now we can flush the SDL event queue and process any possible keyboard show/hide during the finger event
// This is only needed for ios as keyboard show/hide must be on during the finger event
function AddPostSDLTouchEventListener()
{
	if((parent.browser.ios == true) || (parent.browser.android == true))
	{
		var canvas = document.getElementById('canvas');
		if(canvas)
		{
			canvas.addEventListener('touchend', function(e) 
			{
                initializeAudio();
                if(parent.browser.ios == true)
                {
                     Module.ccall('FlushFingerUpSDLEvents', 'null', ['null']);
                }
			} );
		}
	}
}
 
function audioContextCheck() {
    if (typeof AudioContext !== "undefined") {
        return new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
        return new webkitAudioContext();
    } else if (typeof mozAudioContext !== "undefined") {
        return new mozAudioContext();
    } else {
       // Do stuff with soundmanager or something else if Web Audio API is not supported
        console.log("audioContextCheck() No Web Audio API\n");
        return undefined;
    }
}

var bHasAudioBeenInitialized = false;
var audioCtx = undefined;
function initializeAudio()
{
    //console.log("initializeAudio");
                              
    audioCtx = audioContextCheck();                          
    if (audioCtx !== undefined && bHasAudioBeenInitialized == false)
    {
          // play a dummy sound
          // this will initialize the audioCtx so that it can play sounds at any time
          var oscillator = audioCtx.createOscillator();
          var gainNode = audioCtx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          gainNode.gain.value = .01;
          oscillator.frequency.value = 100;
          oscillator.type = 'sine';
          
          oscillator.start();
          setTimeout(
                     function() {
                     oscillator.stop();
                     },
                     1
                     );
                              
        bHasAudioBeenInitialized = true;
    }
};
                              
function playTone(gain, frequency, time)
{
    //console.log("function playTone());
                              
    // For Mobile clients, the audio must have been initialized during a user touch event
    if((parent.browser.ios == true) || (parent.browser.android == true))
    {
        if(bHasAudioBeenInitialized == false)
        {
            return;
        }
    }

    if (audioCtx === undefined)
    {
        initializeAudio();

        if (audioCtx === undefined)
        {
            return;
        }
    }

    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
                              
    // If the gain is set to 0, use the min gain value, so hopefully it will not be audible
    if(gain == 0)
    {
         gainNode.gain.value = gainNode.gain.minValue;
    }
    else
    {
         gainNode.gain.value = gain;
    }
    
    // If the frequency is set to 0, use the max frequency value, so hopefully it will not be audible
    if(frequency == 0)
    {
         oscillator.frequency.value = oscillator.frequency.maxValue;
    }
    else
    {
         oscillator.frequency.value = frequency;
    }
    oscillator.type = 'sine';
    
    oscillator.start();
    setTimeout(
             function() {
             oscillator.stop();
             },
             time
             );
};
                
function beep()
{
    //console.log("function beep");

    playTone(.5, 1500, 100);
};
           
// This function will play a silent sound every half second to keep the process active
// This prevents the browser from pausing the main thread, which would disconnect the session
function playSilentSound()
{
    //console.log("function playSilentKeepAliveSound");
                              
    // Play the 'silent' sound
    playTone(0, 0, 1);
                   
    // wait 500 ms and play the sound again as long as we are still hidden
    setTimeout(function()
                        {
                            if(document.visibilityState == 'hidden')
                            {
                                playSilentSound();
                            }
                        },
               500);
};

//We need to add these event listeners after main() has been called
//so we do it from EventHandlerSDL::Initialize().
var isALTGrDown = false;
function AddInputEventListeners()
{
	//console.log("function AddInputEventListeners()");
                              
    window.addEventListener('resize', function(event) { iFrameWindowResize(event) }, false);
                              
    document.addEventListener('visibilitychange', function(event) { SessionVisibility(event) }, false);
                              
    // For the Surface, the parent will receive a blur event if you switch to another app. This call will remove focus from the CSIMEInput element
    // so the keyboard doesn't pop up when the focus is returned to the browser.
    if(parent.browser.surface == true)
    {
        parent.addEventListener('blur', function(e) { ParentBlur(e); } );
    }
                              
	var input = parent.document.getElementById('CSIMEInput');
	if(input)
	{
		//console.log("function AddInputEventListeners() found CSIMEInput");
		if(parent.browser.softkeyboard == false)
		{
			//First set the focus so input goes to the logon dialog.
			input.focus();
		}
        else
        {
            window.focus();
            window.addEventListener('keypress', function(e) { CheckCSIMEInputFocus(e); }, true);
        }

		input.addEventListener('compositionstart', function(e) { CSIMECompositionstart(e); }, false);
//		input.addEventListener('compositionupdate', function(e) { console.log("CSIMECompositionupdate() %s", e.data); }, false);
		input.addEventListener('compositionend', function(e) { CSIMECompositionend(e); }, false);
		input.addEventListener('input', function(e) { CSIMEInput(e); }, false);
//		input.addEventListener('textinput', function(e) { outputKeyEvent("INPUT", e) }, false);

		if(parent.browser.cros)
			input.addEventListener('keydown', function(e) { onCROSKeyDown(e); }, false);

//		input.addEventListener('keydown', function(e) { outputKeyEvent("INPUT", e); }, false);
//		input.addEventListener('keypress', function(e) { outputKeyEvent("INPUT", e); }, false);
//		input.addEventListener('keyup', function(e) { outputKeyEvent("INPUT", e); }, false);

//		input.addEventListener('focusin', function(e) { outputFocusEvent("INPUT", e); } );
        input.addEventListener('focus', function(e) { CSIMEInputFocus(e); } );
//		input.addEventListener('focusout', function(e) { console.log("CSIMEInput focusout"); outputFocusEvent("INPUT", e); } );
		input.addEventListener('blur', function(e) { CSIMEInputBlur(e); } );
	}

	parent.document.addEventListener('keydown', function(e)
	{
		//outputKeyEvent("PARDOC", e);
                                     
        if(e.key == "AltGraph")
        {
            isALTGrDown = true;
        }

		if(e.altKey &&
		   e.ctrlKey &&
		   (e.key.length == 1 ||
			(e.key.length == 12 &&
			 e.key == "Unidentified")))
		{
			//Part of fix for bug #17299 - ALT-GR key characters dont type
			//Adding the preventDefault() caused this.
		}
        else if((isALTGrDown == true) &&
                (e.key.length == 1 ||
                (e.key.length == 12 && e.key == "Unidentified")))
        {
            // Do the same thing as if ctrl & alt are down
        }
        else
        {
			var newEvent;

			if(parent.browser.msie)
			{
				newEvent = document.createEvent('Event');
				newEvent.initEvent('keydown', e.bubbles, e.cancelable);
				newEvent.key = e.key;
				newEvent.code = e.code;
				newEvent.charCode = e.charCode;
				newEvent.keyCode = e.keyCode;
				newEvent.location = e.location;
				newEvent.which = e.which;
				newEvent.composed = true;
			}
			else if(parent.browser.firefox)
			{
				newEvent = new KeyboardEvent('keydown', {key: e.key, code: e.code, composed: true, charCode: e.charCode, keyCode: e.keyCode, bubbles: true, cancelable: true, location: e.location, ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey});
				newEvent.keyCode = e.keyCode;
				newEvent.which = e.keyCode;
newEvent.location = e.location;
			}
			else
			{
				newEvent = new Event('keydown', {key: e.key, code: e.code, composed: true, charCode: e.charCode, keyCode: e.keyCode, bubbles: true, cancelable: true, location: e.location, ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey});
				newEvent.keyCode = e.keyCode;
				newEvent.which = e.keyCode;
newEvent.location = e.location;
			}

			var frame = parent.document.getElementById('iFrameWebApp').contentDocument;
			frame.dispatchEvent(newEvent);

			if(e.keyCode == 9 || //tab
			   e.keyCode == 116 || //F5
			   e.altlKey ||
			   (e.ctrlKey &&
				! g_bHtml5ClipboardEnabled) ||
			   (e.ctrlKey &&
				e.keyCode != 88 && //CTRL+X
				e.keyCode != 67 && //CTRL+C
				e.keyCode != 86)) //CTRL+V
			{
//				console.log("PARDOC prevent default keydown");
				e.preventDefault();
			}
		}
	});

	parent.document.addEventListener('keyup', function(e)
	{
		//outputKeyEvent("PARDOC", e);
                                     
        if(e.key == "AltGraph")
        {
            isALTGrDown = false;
        }

		var newEvent;

		if(parent.browser.msie)
		{
			newEvent = document.createEvent('Event');
			newEvent.initEvent('keyup', e.bubbles, e.cancelable);
			newEvent.key = e.key;
			newEvent.code = e.code;
			newEvent.charCode = e.charCode;
			newEvent.keyCode = e.keyCode;
			newEvent.location = e.location;
			newEvent.which = e.which;
			newEvent.composed = true;
		}
		else if(parent.browser.firefox)
		{
			newEvent = new KeyboardEvent('keyup', {key: e.key, code: e.code, composed: true, charCode: e.charCode, keyCode: e.keyCode, bubbles: true, cancelable: true, location: e.location, ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey});
			newEvent.keyCode = e.keyCode;
			newEvent.which = e.keyCode;
newEvent.location = e.location;
		}
		else
		{
			newEvent = new Event('keyup', {key: e.key, code: e.code, composed: true, charCode: e.charCode, keyCode: e.keyCode, bubbles: true, cancelable: true, location: e.location, ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey});
			newEvent.keyCode = e.keyCode;
			newEvent.which = e.keyCode;
newEvent.location = e.location;
		}

		var frame = parent.document.getElementById('iFrameWebApp').contentDocument;
		frame.dispatchEvent(newEvent);

		if(e.keyCode == 9 || //tab
		   e.keyCode == 116 || //F5
		   e.altlKey ||
		   (e.ctrlKey &&
			! g_bHtml5ClipboardEnabled) ||
		   (e.ctrlKey &&
			e.keyCode != 88 && //CTRL+X
			e.keyCode != 67 && //CTRL+C
			e.keyCode != 86)) //CTRL+V
		{
//			console.log("PARDOC prevent default keyup");
			e.preventDefault();
		}
	});

	parent.document.addEventListener('focus', function (e)
	{
//		outputFocusEvent("PARDOC", e)

		if(parent.browser.softkeyboard == false)
		{
			var input = parent.document.getElementById('CSIMEInput');
			input.value = "";
			input.focus();
			if ( ! parent.browser.edge)
				input.select();
		}
	} );

	//Add the embedded client clipboard suppressors
	parent.document.addEventListener('cut', onSuppressClipboard);
	parent.document.addEventListener('copy', onSuppressClipboard);
	parent.document.addEventListener('paste', onSuppressClipboard);
}

//We need to add these event listeners when only the HTML5 client
//is used so we do it from ClipboardClientSDL::initClient().
var g_bHtml5ClipboardEnabled = false;
var g_bSupressNextClipboardModal = false;
function AddClipboardEventListeners()
{
//	console.log("function AddClipboardEventListeners()");

	//First remove the embedded client clipboard suppressors
	parent.document.removeEventListener('cut', onSuppressClipboard);
	parent.document.removeEventListener('copy', onSuppressClipboard);
	parent.document.removeEventListener('paste', onSuppressClipboard);

	g_bHtml5ClipboardEnabled = true;
	Module.ccall('SetHtml5ClipboardEnabled', 'null', ['null']);

	if(parent.browser.msie)
	{
		var input = parent.document.getElementById('CSIMEInput');
		if(input)
			input.addEventListener('keydown', function(e) { onIEKeyDown(e); }, false);
	}
	else
	{
		// Overwrite what is being copied to the clipboard.
		parent.document.addEventListener('copy', function(e)
		{
			var direction = Module.ccall('GetClipboardDirection', 'number', ['null']);
			if(direction == 0 || //ClipboardClientSDL::BiDirectional
				direction == 1)  //ClipboardClientSDL::HostToClient
			{
				g_bSupressNextClipboardModal = true;

				var copy = Module.ccall('GetSelectedText', 'string', ['null']);
//				console.log("function onCopyToLocalClipboard() %s", copy);
				// e.clipboardData is initially empty, but we can set it to the
				// data that we want copied onto the clipboard.
				e.clipboardData.setData('text/plain', copy); //UTF16ToString(copy));
				_free(copy);
			}

			// This is necessary to prevent the current document selection from
			// being written to the clipboard.
			e.preventDefault();
		});

		// Overwrite what is cut to the clipboard.
		parent.document.addEventListener('cut', function(e)
		{
			var direction = Module.ccall('GetClipboardDirection', 'number', ['null']);
			if(direction == 0 || //ClipboardClientSDL::BiDirectional
				direction == 1)  //ClipboardClientSDL::HostToClient
			{
				var cut = Module.ccall('GetSelectedText', 'string', ['null']);
//				console.log("function onCutToLocalClipboard() %s", cut);
				// e.clipboardData is initially empty, but we can set it to the
				// data that we want copied onto the clipboard as part of the cut.
				// Write the data that we want copied onto the clipboard.
				e.clipboardData.setData('text/plain', cut);
				_free(cut);

				// Since we will be canceling the cut operation, we need to manually
				// update the document to remove the currently selected text.
				Module.ccall('DeleteSelectedTextOnCut', 'null', ['null']);
			}

			// This is necessary to prevent the document selection from being
			// written to the clipboard.
			e.preventDefault();
		});
	}

	//Paste the data on the clipboard into the remote app.
	parent.document.addEventListener('paste', function(e)
	{
		//Reset the client side IME buffers before the paste.
		Module.ccall('CSIMECompositionendCallback', 'null', ['string'], [""]);

		var paste = null;
		// clipboardData contains the data that is about to be pasted.
		if(parent.browser.msie)
		{
			paste = window.clipboardData.getData('Text');
//			console.log("IE function onPasteToRemoteClipboard() %s", paste);
		}
		else if (parent.browser.edge ||
			e.clipboardData.types.indexOf('text/plain') > -1)
		{
			paste = e.clipboardData.getData('text/plain');
//			console.log("function onPasteToRemoteClipboard() %s", paste);
		}

		if(paste != null)
		{
			// Since we are canceling the paste operation, we need to manually
			// paste the data into the document.
			Module.ccall('SetRemoteClipboardString', 'null', ['string'], [paste]);
		}

		// This is necessary to prevent the default paste action.
		e.preventDefault();
	});

//	document.addEventListener('beforepaste', function(e) { console.log("function onBeforePaste"); } );
}

function NativeAppIsInstalled() {
    Module.ccall('NativeAppIsInstalled', 'null', ['null']);
}

function NativeAppIsNotInstalled() {
	Module.ccall('NativeAppIsNotInstalled', 'null', ['null']);
}

function InitiateAppInstall() {
	Module.ccall('InitiateAppInstall', 'null', ['null']);
}

function UseWebApp() {
	Module.ccall('UseWebApp', 'null', ['null']);
}
                              
function CancelReconnect() {
    Module.ccall('cancelReconnect', 'null', ['null']);
}


parent.buildCommandLine(1);

//Replacement Object.assign() function for IE 11
if (typeof Object.assign !== 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target === null || target === undefined) {
        		throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
        		var nextSource = arguments[index];

	        	if (nextSource !== null && nextSource !== undefined) {
					for (var nextKey in nextSource) {
					// Avoid bugs when hasOwnProperty is shadowed
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
        	}
		}
		return to;
		},
		writable: true,
		configurable: true
	});
}
