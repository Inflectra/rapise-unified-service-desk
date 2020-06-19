//Put your custom functions and variables in this file

g_browserLibrary = "UnifiedServiceDesk_IE";   // Set to one of "UnifiedServiceDesk_IE" or "Selenium - Chrome"

g_usdConfigPath = "ConfigInflectraIE.xlsx";

g_recordUrls = false;
//g_uiaNameFromControlType = true;

if (!g_recording)
{
	TestInit = function()
	{
		Global.DoLoadObjects('%WORKDIR%/Objects.js');
		Navigator.EnsureVisibleVerticalAlignment = "center";
	}
}
else
{
	TestPrepare = function()
	{
		g_UIAutomationWrapper.DeepPointTracking(true);
	}
}

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
