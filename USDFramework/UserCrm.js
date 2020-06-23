//Put your custom functions and variables in this file

function LogAssert(/**string*/ msg)
{
	Log(msg);
	Tester.Assert(msg, false);
}

function CrmFindObject(/**string*/ xpath)
{
	for(var i = 0; i < g_objectLookupAttempts; i++)
	{
		var obj = Navigator.Find(xpath);
		if (obj)
		{
			return obj;
		}
		Global.DoSleep(g_objectLookupAttemptInterval);
	}
	return null;
}

/**
 * Launches Dynamics 365 in a browser and opens specified module. Dynamics365Url, UserName, Password must be set in Config.xlsx
 */
function CrmLaunch(/**string*/ module)
{
	var url = Global.GetProperty("Dynamics365Url", "", "%WORKDIR%\\Config.xlsx");
	var usr = Global.GetProperty("UserName", "", "%WORKDIR%\\Config.xlsx");
	var pwd = Global.GetProperty("Password", "", "%WORKDIR%\\Config.xlsx");
	LoginMicrosoftOnline(url, usr, pwd);
	CrmFindObject("//iframe[@id='AppLandingPage']");
	Global.DoSleep(3000);
	var xpath = "//iframe[@id='AppLandingPage']@@@//div[@data-type='app-title' and @title='" + module + "']";
	var obj = CrmFindObject(xpath);
	if (obj)	
    {
    	obj.object_name = module;
    	obj.DoEnsureVisible();
    	obj.DoClick();
	}
	else
	{
		LogAssert("CrmLaunch: module element is not found: " + module, false);
	}	
}

/**
 * Launches Dynamics 365 for Sales in a browser. Dynamics365SalesUrl, UserName, Password must be set in Config.xlsx
 */
function CrmLaunchSales()
{
	var url = Global.GetProperty("Dynamics365SalesUrl", "", "%WORKDIR%\\Config.xlsx");
	var usr = Global.GetProperty("UserName", "", "%WORKDIR%\\Config.xlsx");
	var pwd = Global.GetProperty("Password", "", "%WORKDIR%\\Config.xlsx");
	LoginMicrosoftOnline(url, usr, pwd);
}

/**
 * Changes area in the left bottom corner of the dashboard.
 */
function CrmChangeArea(/**string*/ name)
{
	SeS('G_OpenAreaList').DoClick();
	var xpath = "//li[@role='menuitemcheckbox' and normalize-space(.)='" + name + "']";
	var obj = CrmFindObject(xpath);
	if (obj)	
    {
    	obj.object_name = name;
    	obj.DoClick();
	}
	else
	{
		LogAssert("CrmChangeArea: area element is not found: " + name, false);
	}
}

function PrintAreaItems()
{
	SeS('G_OpenAreaList').DoClick();
	var xpath = "//li[@role='menuitemcheckbox']";
	var items = Navigator.DOMFindByXPath(xpath, true);
	for(var i = 0; i < items.length; i++)
	{
		var caption = items[i].GetInnerText();
		Tester.Message(caption);
	}
}

/**
 * Opens entity in the site map.
 */
function CrmOpenEntity(/**string*/ entity)
{
	var xpath = "//li[@aria-label='" + entity + "' and contains(@id,'sitemap-entity')]";
	var obj = CrmFindObject(xpath);
	if (obj)	
	{
		obj.object_name = entity;
		obj.DoEnsureVisible();
		obj.DoClick();
	}
	else
	{
		LogAssert("CrmOpenEntity: entity element is not found: " + entity, false);
	}	
}

/**
 * Clicks button on a toolbar.
 */
function CrmClickButton(/**string*/ name)
{
	var xpath = "//button[@aria-label='" + name + "']";
	var obj = CrmFindObject(xpath);
	if (obj)	
	{
		obj.object_name = name;
		obj.DoClick();
	}
	else
	{
		LogAssert("CrmClickButton: button element is not found: " + name, false);
	}
}

/** 
 * Selects tab on the page.
 */
function CrmSelectTab(/**string*/ name)
{
	var xpath = "//li[@role='tab' and @title='" + name + "']";
	var obj = CrmFindObject(xpath);
	if (obj)	
	{
		obj.object_name = name;
		obj.DoClick();
	}
	else
	{
		LogAssert("CrmSelectTab: tab element is not found: " + name, false);
	}
}

/**
 * Selects value from a lookup field.
 * @param field Repository ID of a lookup object.
 * @param value Value to select.
 */
function CrmLookupField(/**objectId*/ field, /**string*/ value) 
{
	var obj = SeS(field);
	if (obj)
	{
		obj._DoSetText(value);
		Global.DoSleep(2000);
		var xpath = "//ul//label/span[contains(text(),'" + value + "')]";
		var item = CrmFindObject(xpath);
		
		if (!item)
		{
			LogAssert("CrmLookupField: item is not found: " + value, false);
		}
		
		item.object_name = value;
		item.DoClick();
		
	}
	else
	{
		LogAssert("CrmLookupField: field is not found: " + field, false);
	}
}

/**
 * Scrolls to an element with given data-id
 * To find out the data-id you may use //div[@data-id] query in Web Spy.
 */
function CrmScrollTo(/**string*/ dataId)
{
	var xpath = "//div[@data-id='" + dataId + "']";
	var obj = CrmFindObject(xpath);
	if (obj)	
	{
		obj.object_name = dataId;
		obj.DoEnsureVisible();
	}
	else
	{
		LogAssert("CrmScrollTo: element is not found: " + dataId, false);
	}
}

/**
 * Sets value to a date field.
 * @param field Repository ID  of a date object.
 * @param value Date to set.
 */
function CrmSetDate(/**objectId*/ field, /**string*/ value)
{
	var obj = SeS(field);
	if (obj)
	{
		obj.DoClick();
		obj.DoSetText(value);
		obj._DoSendKeys("{TAB}");
	}
	else
	{
		LogAssert("CrmSetDate: field is not found: " + field, false);
	}
}

/**
 * Searches for records.
 * @param value Value to search for.
 */
function CrmSearchRecords(/**string*/ value)
{
	var input = CrmFindObject("//input[contains(@id,'quickFind_text')]");
	var button = CrmFindObject("//button[contains(@id,'quickFind_button')]");
	
	if (!input)
	{
		LogAssert("CrmSearchRecords: input field not found");
		return;
	}
	
	if (!button)
	{
		LogAssert("CrmSearchRecords: button field not found");
		return;
	}
	
	
	input.object_name = "SearchField";
	button.object_name = "SearchButton";
	
	input.DoClick();
	input.DoSetText(value);
	button.DoClick();
}

/**
 * Navigates to the specified URL and performs login at https://login.microsoftonline.com/
 * Opens a browser if necessary.
 * @param url
 * @param userName
 * @param password
 */
function LoginMicrosoftOnline(/**string*/ url, /**string*/ userName, /**string*/ password)
{
	var o = {
		"UseAnotherAccount": "//div[@id='otherTileText']",
		"UserName": "//input[@name='loginfmt']",
		"Sumbit": "//input[@type='submit']",
		"Password": "//input[@name='passwd' and @type='password']",
		"DontShowAgain": "//input[@name='DontShowAgain']",
		"No": "//input[@type='button' and @id='idBtn_Back']"
	};

	Navigator.Open(url);
	Navigator.SetPosition(0, 0);
	
	Tester.SuppressReport(true);

	try
	{
		if (Navigator.Find(o["UseAnotherAccount"]))
		{
			Navigator.Find(o["UseAnotherAccount"]).DoClick();	
		}
		
		Navigator.Find(o["UserName"]).DoSetText(userName);
		Navigator.Find(o["Sumbit"]).DoClick();
		Global.DoSleep(2000);
		Navigator.Find(o["Password"]).DoSetText(password);
		Navigator.Find(o["Sumbit"]).DoClick();
		Global.DoSleep(2000);
		
		if (Navigator.Find(o["DontShowAgain"]))
		{
			Navigator.Find(o["No"]).DoClick();	
		}
		
		Tester.SuppressReport(false);
		Tester.Message("Logged in as " + userName);
	}
	catch(e)
	{
		Tester.SuppressReport(false);	
		Tester.Message(e.message);
	}
}

/**
 * Saves DOM tree of the current page to dom.xml file.
 */
function CrmSaveDom()
{
	var domTree = Navigator.GetDomTree();
	if (domTree)
	{
		Navigator.SaveDomToXml("dom.xml", domTree);
	}
	else
	{
		Tester.Message("Failed to get DOM tree");
	}
}

/**
 * Writes key/value pair to Output.xlsx
 * @param key
 * @param value
 */
function SetOutputValue(/**string*/ key, /**string*/ value)
{
	Global.SetProperty(key, value, "%WORKDIR%\\Output.xlsx");
}


/**
 * Reads value from Output.xlsx
 * @param key
 * @param [defValue]
 */
function GetOutputValue(/**string*/ key, /**string*/ defValue)
{
	return Global.GetProperty(key, defValue, "%WORKDIR%\\Output.xlsx");
}

