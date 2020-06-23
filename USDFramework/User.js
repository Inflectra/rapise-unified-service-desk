/**
 *  Functions for testing Microsoft Dynamics 365 Unified Service Desk
 */

// List of USD instance names
if (typeof(g_usdInstance) == "undefined")
{
	g_usdInstance = "WebClientIE";
	//g_usdInstance = "WebClientChrome";
	//g_usdInstance = "ServiceClientIE";
	//g_usdInstance = "ChromeStandalone";
}

zConfig();

if (!g_recording)
{
	TestInit = function()
	{
		Global.DoLoadObjects('%WORKDIR%/Objects.js');
		Global.DoLoadObjects('%WORKDIR%/ObjectsCrm.js');
		Navigator.EnsureVisibleVerticalAlignment = "center";
		zSetSeleniumDriverExecutableFolder();
		//WebDriver.CreateDriver();
	}
}
else
{
	TestPrepare = function()
	{
		g_recordUrls = false;
		g_UIAutomationWrapper.DeepPointTracking(true);
		if (IsSeleniumTest())
		{
			zSetSeleniumDriverExecutableFolder()
			WebDriver.CreateDriver();
            //zPrintChromeUrlAndTitle();
		}
	}
}

/**
 * Selects browser profile and config for a given USD instance.
 * Modify this function as needed.
 */
function zConfig()
{
	switch(g_usdInstance)
	{
		case "WebClientIE":
			g_browserLibrary = "UnifiedServiceDesk_IE";
			g_usdConfigPath = "ConfigInflectraIE.xlsx";
			break;
		case "WebClientChrome":
			g_browserLibrary = "Selenium - Chrome";
			g_usdConfigPath = "ConfigInflectraChrome.xlsx";	
			break;
		case "ServiceClientIE":
			g_browserLibrary = "UnifiedServiceDesk_IE";
			g_usdConfigPath = "ConfigInflectraService.xlsx";
			break;
		case "ChromeStandalone":
			g_browserLibrary = "ChromeWeb";
			break;
		default:
			g_browserLibrary = "UnifiedServiceDesk_IE";
			g_usdConfigPath = "ConfigInflectraIE.xlsx";
	}
}

/**
 * Checks if we are working with Chrome hosted controls via Selenium 
 * or attaching to IE hosted controls via Rapise native connector.
 */
function IsSeleniumTest()
{
    return (typeof(WebDriver) != "undefined" && WebDriver);
}

/**
 * Launches Unified Service Desk application.
 */
function USDLaunch()
{
	var pfFolder = Global.GetSpecialFolderPath("ProgramFilesX86");
	var usdPath = pfFolder + "\\Microsoft Dynamics CRM USD\\USD\\UnifiedServiceDesk.exe"
	if(!File.Exists(usdPath))
	{
		Tester.Message("Unified Service Desk Client is not installed on this computer");
		return;
	}
	
	var windows = g_util.FindWindows("regex:Unified Service Desk.*", "regex:HwndWrapper.*");
	if (windows.length == 0)
	{
		Tester.Message("Unified Service Desk Client is not started.");
		Global.DoLaunch(usdPath);
		if (Global.DoWaitFor("G_Change_Credentials"))
		{
			SeS('G_Change_Credentials').DoClick();
			USDLogin();
		}
		zWaitForMainUSDWindow();
		return;
	}
}

/**
 * Logs into Unified Service Desk application. `g_usdConfigPath` points
 * to a config file with USD instance credentials.
 */
function USDLogin()
{
	var region = Global.GetProperty('OnlineRegion', "", "%WORKDIR%/" + g_usdConfigPath);
	var usr = Global.GetProperty('UserName', "", "%WORKDIR%/" + g_usdConfigPath);
	var pwd = Global.GetProperty('Password', "", "%WORKDIR%/" + g_usdConfigPath);
	var org = Global.GetProperty('OrganizationName', "", "%WORKDIR%/" + g_usdConfigPath);
	
	var commandInterval = g_commandInterval;
	g_commandInterval = 100;
	
	SeS('G_Display_List').DoSetCheck(true);
	
	var regionCombo = SeS('G_Online_Region');
	regionCombo.DoClick(regionCombo.GetWidth() - 10);
	regionCombo.DoClick(regionCombo.GetWidth() - 10);
	regionCombo.DoSelectItem(region);
	
	SeS('G_UserName').DoClick();
	SeS('G_UserName').DoSendKeys("^a");
	SeS('G_UserName').DoSendKeys(usr);
	SeS('G_Password').DoClick();
	SeS('G_Password').DoSendKeys("^a");
	SeS('G_Password')._DoSendKeys(pwd);
	Global.DoSleep(500);
	SeS('G_Login').DoClick();
	
	Global.DoSleep(3000);
	SeS('G_Organization', {object_name: org}).DoClick();
	SeS('G_Login1').DoClick();
	
	g_commandInterval = commandInterval;
	
	Global.DoWaitFor("G_DASHBOARD", 300000);
}

/**
 * Closes Unified Service Desk application.
 */
function USDClose()
{
	//zCloseWindowsByTitle("regex:Unified Service Desk.*");
	SeS('G_Close').DoClick();
	if (Global.DoWaitFor("G_YesClose", 3000))
	{
		SeS('G_YesClose').DoClick();
	}
}

/**
 * Sets text into a rich editor.
 */
function USDSetRichText(/**objectId*/ editor, /**string*/ text)
{
	var obj = SeS(editor);
	Navigator.ExecJS('arguments[0].innerHTML = "' + text + '"', obj);
	Tester.Assert("Set text into " + editor, true);
}

/**
 *  Attaches to a Chrome hosted control based on URL/Title match or index.
 */
function USDSelectWindow(/**string|number*/ urlOrTitleOrIndex, /**number*/ timeout)
{
    if (!IsSeleniumTest())
    {
        return;
    }
    
    timeout = timeout || 30000;
    
    function _SelectWindow()
    {
        var handles = WebDriver.GetWindowHandles();
        if (handles && handles.length)
        {
            if (typeof(urlOrTitleorIndex) == "number")
            {
                var index = parseInt(urlOrTitleOrIndex);
                if (index < handles.length)
                {
                    var handle = handles[index];
                    WebDriver.SwitchToWindow(handle);
                    return true;
                }
                else
                {
                    if (l3) Log3("There is no Chrome window with index: " + index);
                }
            }
            else
            {
                var urlOrTitle = ("" + urlOrTitleOrIndex).toLowerCase();
                for(var i = 0; i < handles.length; i++)
                {
                    var handle = handles[i];
                    WebDriver.SwitchToWindow(handle);
                    var url = ("" + WebDriver.GetUrl()).toLowerCase();
                    var title = ("" + WebDriver.GetTitle()).toLowerCase();
                    if (url.indexOf(urlOrTitle) != -1 || title.indexOf(urlOrTitle) != -1)
                    {
                        return true;
                    }
                }
                
                if (l3) Log3("There is no Chrome window with title/url matching: " + urlOrTitleOrIndex);
            }
        }
        return false;
    }
    
    var _start = new Date();
    do
    {
        var _res = _SelectWindow();
        if (_res)
        {
            return;
        }
        else
        {
            Global.DoSleep(1000);
        }
    }
    while ((new Date() - _start) < timeout);
    
    Tester.Assert("Chrome window not found: " + urlOrTitleorIndex, false);
}

function zPrintChromeUrlAndTitle()
{
    var handles = WebDriver.GetWindowHandles();
    if (handles && handles.length)
    {
        for(var i = 0; i < handles.length; i++)
        {
            var handle = handles[i];
            WebDriver.SwitchToWindow(handle);
            var url = ("" + WebDriver.GetUrl()).toLowerCase();
            var title = ("" + WebDriver.GetTitle()).toLowerCase();
            Tester.Message('Window: ' + i);
            Tester.Message('Url: ' + url);
            Tester.Message('Title: ' + title);
        }
    }
}

function zCloseWindowsByTitle(regexTitle)
{
	var arrFoundWindows = g_util.FindWindows(regexTitle, 'regex:.*');
	
	for( var i=0;i<arrFoundWindows.length; i++)
	{
		var wnd = /**HWNDWrapper*/ arrFoundWindows[i];
		
		Log("Closing: "+wnd.Text);
		
		// This will close main window of the window's process.
		wnd.CloseMainWindow();
		
		// Alternative way would be bringing window to front and sending Alt+F4 to it.
	}
}

function zWaitForMainUSDWindow()
{
	var count = 60;
	var found = false;
	while(!found && count > 0)
	{
		var windows = g_util.FindWindows("regex:Unified Service Desk.*", "regex:HwndWrapper.*");
		if (windows.length > 0)
		{
			found = true;
		}
		count--;
		Global.DoSleep(5000);
	}
}

function zSetSeleniumDriverExecutableFolder()
{
	if (IsSeleniumTest())
	{
		var WshShell = new ActiveXObject("WScript.Shell");
		var _processEnv = WshShell.Environment("PROCESS");
		_processEnv("PATH") = _processEnv("PATH") + ";" + Global.GetFullPath('Profiles');
	}
}

// Load functions for testing Dynamics 365 for Sales (CRM)
eval(File.IncludeOnce('%WORKDIR%/UserCrm.js'));